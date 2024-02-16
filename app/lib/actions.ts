"use server"

import { CompanyUser } from "../(admin-routes)/dashboard/users/page"
import { dataSchemaZod } from "../components/companyDataForm/validationDataSchema"
import { setupAPIClient } from "../services/api"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth, update } from "./auth"
import { userInfoSchema, userInfoSchemaFirstSignIn } from "../components/userInfo/userInfoValidationSchema"


export async function fetchCompanyData(business_info_id: string | undefined) {
  const api = await setupAPIClient()

  try {
    const response = await api.get(`/business-info?business_info_uuid=${business_info_id}`)

    const result = response.data
    return result
  } catch (err: any) {
    if (err.response.data) return err.response.data

    console.log("erro: ", err)
    // return err.response.data.error
  }
}

export const fetchCompanyAddress = async (address_uuid: string) => {
  const api = await setupAPIClient()

  try {
    const response = await api.get(`/company-address?address_id=${address_uuid}`)

    const result = response.data
    console.log('dados atualizados')
    return result
  } catch (err: any) {
    if (err.response.data) return err.response.data
    console.log("erro: ", err)
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
    if (err.response.data) return err.response.data
    console.log("Unable to update data", err)

  }

  redirect('/dashboard/settings')
}


export const fetchSingleUser = async (user_uuid: string) => {

  const api = await setupAPIClient();

  try {
    const response = await api.get(`/company-user?user_uuid=${user_uuid}`);

    return response.data
  } catch (err: any) {
    if (err.response.data) return err.response.data
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
    if (err.response.data) return err.response.data

    console.log({ err });
  }
};

export const addUser = async (formData: FormData) => {
  const api = await setupAPIClient();

  const { user_name, password, permissions } = Object.fromEntries(formData)
  const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : [];
  try {
    await api.post("/company-user", {

      password,
      user_name,
      permissions: parsedPermissions
    })



  } catch (err: any) {
    if (err.response.data) return err.response.data

    console.log("Erro ao criar usuário", err)
  }
  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export const editUser = async (formData: FormData) => {
  const api = await setupAPIClient()
  const session = await auth()

  const { user_id, password, permissions, is_active } = Object.fromEntries(formData)
  const parsedPermissions = typeof permissions === 'string' ? JSON.parse(permissions) : [];
  const active = is_active === "Ativo" ? true : false

  try {
    await api.put(`/company-user?user_id=${user_id}&business_document=${session?.user.document}`, {
      password,
      permissions: parsedPermissions,
      is_active: active
    })

  } catch (err: any) {
    if (err.response.data) return err.response.data

    console.log("Erro ao editar usuário: ", err)
  }
  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')

}

export const deleteUser = async (formData: FormData) => {
  const api = await setupAPIClient()

  const { id, business_document } = Object.fromEntries(formData)
  try {
    await api.delete(`/company-user?user_id=${id}&business_document=${business_document}`)

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
    if (err.response.data) return err.response.data

    console.log(err)
  }
}

export const updateCompanyUserDetails = async (formData: FormData) => {
  const api = await setupAPIClient()
  const session = await auth()

  let { name, user_name, document, new_password, confirm_password } = Object.fromEntries(formData)

  if (session) {

    if (session.user.status === 'pending_password') {

      if (session.user.document) {
        document = session.user.document
      }

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

        const response = await api.patch(`/company-user?user_id=${session.user.uuid}`, {
          name: name,
          user_name: user_name,
          document: document,
          password: new_password,
          status: 'active'
        })


        return { status: response.status, data: response.data }

      } catch (err: any) {
        if (err.response.data) return err.response.data

        console.log("Erro ao atualizar dados do usuário: ", err)
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
        const response = await api.patch(`/company-user?user_id=${session.user.uuid}`, {
          name: name,
          user_name: user_name,
          document: document,
          password: new_password,
        })


        return { status: response.status, data: response.data }

      } catch (err: any) {
        if (err.response.data) return err.response.data
        console.log("Erro ao atualizar dados: ", err)

      }
    }

  }
}

export const createContract = async (formData: FormData) => {
  const api = await setupAPIClient()
  const { name, content, version, password } = Object.fromEntries(formData)

  try {
    const response = await api.post('/company-contract', {
      name,
      content,
      version,
      password
    })

    console.log({response})

    return { status: response.status, data: response.data }

  } catch (err: any) {

    if (err.response.data) return err.response.data
    console.log("Erro ao atualizar dados: ", err)

  }

  revalidatePath("/dashboard/settings/contract")

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