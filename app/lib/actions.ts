"use server"

import { CompanyUser } from "../(admin-routes)/dashboard/users/page"
import { dataSchemaZod } from "../components/companyDataForm/validationDataSchema"
import { setupAPIClient } from "../services/api"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth, update } from "./auth"
import { userInfoSchema, userInfoSchemaFirstSignIn } from "../components/userInfo/userInfoValidationSchema"


export async function fetchCompanyData() {
  const api = await setupAPIClient()
  const session = await auth()

  if(session){

    try {
      const response = await api.get(`/business-info?business_info_uuid=${session.user.business_info_id}`)
      return { status: response.status, data: response.data }
    } catch (err: any) {
      //console.log("erro data: ", err)
      if (err.response) return err.response.data

      // return err.response.data.error
    }
  }
  return false

}

export const fetchCompanyAddress = async (address_uuid: string) => {
  const api = await setupAPIClient()

  try {
    const response = await api.get(`/company-address?address_id=${address_uuid}`)

    return { status: response.status, data: response.data }
  } catch (err: any) {
     console.log("erro endereço: ", err)
    if (err.response) return err.response.data
    // return err.response.data.error
  }

}


export const updateData = async (formData: FormData) => {
  const api = await setupAPIClient();

  const {
    data_uuid,
    address_uuid,
    line1,
    line2,
    line3,
    postal_code,
    neighborhood,
    city,
    state,
    country,
    fantasy_name,
    document,
    classification,
    colaborators_number,
    phone_1,
    phone_2


  } = Object.fromEntries(formData)


  const result = dataSchemaZod.safeParse({
    line1,
    line2,
    line3,
    postal_code,
    neighborhood,
    city,
    state,
    country,
    fantasy_name,
    document,
    classification,
    colaborators_number,
    phone_1,
    phone_2
  })
  if (!result.success) {
    return { error: result.error.issues }
  }

  let colaborators_int = +colaborators_number


  try {
    await api.patch(`/company-data?data_uuid=${data_uuid}&address_uuid=${address_uuid}`, {
      line1,
      line2,
      line3,
      postal_code,
      neighborhood,
      city,
      state,
      country,
      fantasy_name,
      document,
      classification,
      colaborators_number: colaborators_int,
      phone_1,
      phone_2
    })
  } catch (err: any) {
    if (err.response) return err.response.data
    console.log("Unable to update data", err)

  }

  redirect('/dashboard/settings')
}


export const fetchSingleUser = async (user_uuid: string) => {

  const api = await setupAPIClient();

  try {
    const response = await api.get(`/business/admin/details/user?user_uuid=${user_uuid}`);

    return {status: response.status, data: response.data}

  } catch (err: any) {
    if (err.response) return {data: err.response.data.error, status: err.response.status}
    console.log({ err });
  }
};

export const fetchCompanyUsers = async (q: string, page: any, business_info_uuid: string) => {
  const result: { count?: number; users?: CompanyUser[]; error?: string } = {};
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 5;
  const api = await setupAPIClient();

  try {
    const response = await api.get(`/company-users?business_info_uuid=${business_info_uuid}`);
    const users = response.data
      .filter((user: CompanyUser) => regex.test(user.user_name))
      .slice(ITEM_PER_PAGE * (page - 1), ITEM_PER_PAGE * page);


    return { count: users.length, users }
  } catch (err: any) {
    if (err.response) return err.response.data

    console.log({ err });
  }
};

export const addUser = async (formData: FormData) => {
  const api = await setupAPIClient();

  const { user_name, password, permissions } = Object.fromEntries(formData)
  const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : [];
  try {
    const response = await api.post("/business/admin/register/user", {

      password,
      user_name,
      permissions: parsedPermissions
    })

    return {status: response.status, data: response.data}

  } catch (err: any) {
    if (err.response) return {data: err.response.data.error, status: err.response.status}
    console.log("Erro ao criar usuário", err)
  }
  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export const editUser = async (formData: FormData) => {
  const api = await setupAPIClient()

  const { user_id, password, permissions, is_active, user_name } = Object.fromEntries(formData)
  const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : [];
  const active = is_active === "Ativo" ? 'active': 'inactive'

  try {
    const response = await api.patch(`/company-user?user_id=${user_id}`, {
      password,
      user_name,
      permissions: parsedPermissions,
      status: active
    })


  } catch (err: any) {
    if (err.response) return {data: err.response.data.error, status: err.response.status}
    return {data: '', status: ''}
  }
  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export const deleteUser = async (formData: FormData) => {
  console.log('chamou')
  const api = await setupAPIClient()

  const { id } = Object.fromEntries(formData)
  try {
    await api.patch(`/company-user/delete?user_id=${id}`)

  } catch (err: any) {
    console.log("Erro ao deletar usuário: ", err)


  }
  revalidatePath('/dashboard/users')
}

export const fetchCompanyUserDetails = async () => {
  const api = await setupAPIClient()
  const session = await auth()
  try {
    if (session) {
      const userData = await api.get("/company-user-details")

      return userData.data
    }
  } catch (err: any) {
    if (err.response) return err.response.data

    console.log(err)
  }
}

//Company Details
export const updateCompanyUserDetails = async (formData: FormData) => {
  console.log({formData})
  const api = await setupAPIClient()
  const session = await auth()
  let { name, user_name, document, new_password, confirm_password } = Object.fromEntries(formData)


  if (session) {

    if (session.user.status === 'pending_password') {
      const result = userInfoSchemaFirstSignIn.safeParse({
        name,
        user_name,
        document,
        new_password,
        confirm_password
      })
      if (!result.success) {
        return { error: result.error.issues }
      }


      try {

        const response = await api.put(`/company-admin`, {
          uuid: session.user.uuid,
          name: name ? name : null,
          user_name: user_name ? user_name : null,
          document: document,
          password: new_password,
          status: 'active'
        })


        return { status: response.status, data: response.data }

      } catch (err: any) {
        if (err.response) return { status: err.response.status, data: err.response.data }
        return { status: '', data: '' }

      }

    } else {
      const result = userInfoSchema.safeParse({
        name,
        user_name,
        document,
        new_password,
        confirm_password
      })

      if (!result.success) {
        return { error: result.error.issues }
      }

      try {
        const response = await api.put(`/company-admin`, {
          uuid: session.user.uuid,
          name: name ? name : null,
          user_name: user_name ? user_name : null,
          document: document,
          password: new_password,
        })


        return { status: response.status, data: response.data }

      } catch (err: any) {
        if (err.response) return { status: err.response.status, data: err.response.data }
        return { status: "", data: "" }

      }
    }

  }
}


export const createContract = async (formData: FormData) => {
  const api = await setupAPIClient()
  const { name, content, version, password, business_info_uuid } = Object.fromEntries(formData)

  try {
    const response = await api.post('/company-contract', {
      name,
      content,
      version,
      password,
      business_info_uuid
    })

    console.log("response actions contracts: ", response)

    return { status: response.status, data: response.data }

  } catch (err: any) {

    console.log("Erro ao atualizar dados: ", err)
    if (err.response) return err.response.data

  }


}


export const fetchContracts = async (business_info_uuid: string) => {
  const api = await setupAPIClient()

  try{
    const response = await api.get(`company-contracts?business_info_uuid=${business_info_uuid}`)

    return { status: response.status, data: response.data }

  }catch(err: any){
    //console.log("Error fetching contracts: ", err)
    if (err.response?.data) return err.response.data
  }

}


export const updateSession = async () => {
  const session = await auth()
  await update({
    ...session,
    user: {
      ...session?.user,
      status: 'active'
    }
  })
}
