'use client'

import {  useEffect, useState } from 'react'
import styles from "./userInfo.module.css"
import { ZodIssue, z } from 'zod'
import { updateCompanyUserDetails } from '@/app/lib/actions'
import { signOut } from 'next-auth/react'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { MaskedCPFInput } from '../Forms/Inputs/formsInput'
import { ButtonComp } from '../Forms/Buttons/button'

export type UserInfoProps = {
  uuid: string,
  is_admin: boolean,
  document: string | null,
  user_name: string | null,
  email: string | null
  name: string | null,
  permissions: string[],
  function: string | null,
  status: string | null

}



type FormErrors = {
  [key: string]: string[] | undefined;
} | null;


export default function ProfileForm(props: UserInfoProps) {
  const [errorsMessage, setErrorsMessage] = useState<FormErrors>(null);
  const [passwordFieldIsVisible, setPasswordIsVisible] = useState(false)

  const router = useRouter()

  const handleSubmitFirstSignIn = async (formData: FormData) => {

    const response = await updateCompanyUserDetails(formData)

    if (response?.status === 200) {
      toast.success("Dados atualizados com sucesso")
      await signOut()
      return

    }

    if (response?.error) {
      const formattedErrors: FormErrors = {};

      response.error.forEach((issue: ZodIssue) => {
        const fieldName = issue.path[0];
        const errorMessage = issue.message;

        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = [];
        }

        formattedErrors[fieldName]?.push(errorMessage);
      });

      setErrorsMessage(formattedErrors);

      return

    }
    if (response?.data?.error === "Password must not be the same") {
      toast.warn("Digite uma nova senha")
      return
    }
    if (response?.data?.error === 'User name already registered') {
      toast.warn("Nome de usuário indisponível")
      return
    }

    toast.error("Algo deu Errado. Tente novamente")
    return
  }

  const handleSubmitRegularUpdates = async (formData: FormData) => {

    const response = await updateCompanyUserDetails(formData)

    if (response?.status === 200) {
      toast.success("Dados atualizados com sucesso")
      await signOut()
      return

    }

    if (response?.error) {

      const formattedErrors: FormErrors = {};

      response?.error?.forEach((issue: ZodIssue) => {
        const fieldName = issue.path[0];
        const errorMessage = issue.message;

        if (!formattedErrors[fieldName]) {
          formattedErrors[fieldName] = [];
        }

        formattedErrors[fieldName]?.push(errorMessage);
      });

      setErrorsMessage(formattedErrors);


      return
    }

    if (response?.data?.error === "Password must not be the same") {
      toast.warn("Digite uma nova senha")
      return
    }

    if (response?.data?.error === 'User name already registered') {
      toast.warn("Nome de usuário indisponível")
      return
    }

    toast.error("Algo deu Errado. Tente novamente")
    return

  }

  useEffect(() => {

    if (props.status === "pending_password") {
      setPasswordIsVisible(true)
    }
  }, [props.status])

  function editPassword() {
    if (!passwordFieldIsVisible) {
      setPasswordIsVisible(true)
    } else {
      setPasswordIsVisible(false)

    }
  }


  const handleRemoveError = (field: string) => {
    if (errorsMessage) {
      const updatedErrors = { ...errorsMessage };
      delete updatedErrors[field];
      setErrorsMessage(updatedErrors);
    }
  };
  return (
    <div className={styles.formBox}>

      {props.status === "pending_password" && (
        <form className={styles.form} action={handleSubmitFirstSignIn}>

          <input className={styles.inputForm} type="hidden" name='data_uuid' value={props.uuid} />
          <div className={styles.inputBox}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              placeholder={props.name ? props.name : ''}
              name='name'
            //defaultValue={props.name ? props.name : ''}
            />
          </div>
          <div className={styles.inputBox}>
            <label htmlFor="name">Email</label>
            <input disabled type="text" placeholder={props.email ? props.email : ''} />
          </div>


          <div className={styles.inputBox}>
            <label htmlFor="name">Nome de usuário (Opcional)</label>
            <input
              type="text"
              placeholder={props.user_name ? props.user_name : ''}
              name='user_name'
              defaultValue={props.user_name ? props.user_name : ''}
            />
          </div>
          <div className={styles.inputBox}>
            <label htmlFor="name">CPF {props.is_admin && !props.document ? <span style={{color: 'red'}}> *</span> : ''} </label>

            {props.is_admin ?
              <>
                <MaskedCPFInput
                  type='text'
                  name='document'
                  id='document'
                  placeholder={props.document ? props.document : ""}
                  disabled={props.is_admin ? true : false}
                  defaultValue={props.document ? props.document : ''}
                />

                {errorsMessage?.document && (
                  <p className={styles.errorMessage}>{errorsMessage.document.map((error, index) => (
                    <span key={index}>{error}</span>
                  ))}</p>)}
              </>
              :
              <input disabled type="text" placeholder={props.document ? props.document : ''} />
            }
          </div>


          <div className={styles.inputBox}>
            <label htmlFor="name">Nova Senha <span style={{color: 'red'}}> *</span></label>
            <input
              type="password"
              name='new_password'
              onChange={(e) => handleRemoveError('new_password')}

            />
            {errorsMessage?.new_password && (
              <p className={styles.errorMessage}>{errorsMessage.new_password.map((error, index) => (
                <span key={index}>{error}</span>
              ))}</p>)}
          </div>
          <div className={styles.inputBox}>
            <label htmlFor="name">Repetir nova senha <span style={{color: 'red'}}> *</span></label>
            <input
              type="password"
              name='confirm_password'
              onChange={(e) => handleRemoveError('confirm_password')}


            />
            {errorsMessage?.confirm_password && (
              <p className={styles.errorMessage}>{errorsMessage.confirm_password.map((error, index) => (
                <span key={index}>{error}</span>
              ))}</p>)}
          </div>

          <div className={styles.buttons}>
            <ButtonComp>Atualizar Dados</ButtonComp>

          </div>


        </form>
      )}

      {props.status !== "pending_password" && (
        <form className={styles.form} action={handleSubmitRegularUpdates}>
          {/* <input type="hidden" name='all_empty' /> */}
          <input type="hidden" name='data_uuid' value={props.uuid} />
          <div className={styles.grid2}>
            <div className={styles.inputBox}>
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                placeholder={props.name ? props.name : ''}
                name='name'
              />
            </div>
            <div className={styles.inputBox}>
              <label htmlFor="name">Email</label>
              <input disabled type="text" placeholder={props.email ? props.email : ''} />
            </div>


          </div>
          <div className={styles.grid2}>
            <div className={styles.inputBox}>
              <label htmlFor="name">Nome de usuário (Opcional)</label>
              <input
                type="text"
                placeholder={props.user_name ? props.user_name : ''}
                name='user_name'
              />
            </div>
            <div className={styles.inputBox}>
              <label htmlFor="name">CPF {props.is_admin && !props.document ? ' *' : ''} </label>
              {props.is_admin ?
                <>
                  <MaskedCPFInput
                    type='text'
                    name='document'
                    id='document'
                    placeholder={props.document ? props.document : ""}
                    disabled={props.is_admin ? true : false}
                    defaultValue={props.document ? props.document : ''}
                  />
                  {errorsMessage?.document && (
                    <p className={styles.errorMessage}>{errorsMessage.document.map((error, index) => (
                      <span key={index}>{error}</span>
                    ))}</p>)}

                </>
                :
                <input disabled type="text" placeholder={props.document ? props.document : ''} />
              }
            </div>

          </div>
          {!passwordFieldIsVisible && (
            <>
              <div onClick={editPassword} className={styles.passwordButton}>
                <p>Editar Senha</p>
              </div>
            </>
          )}
          {passwordFieldIsVisible && (
            <>
              <div onClick={editPassword} className={styles.passwordButton}>
                <p>Esconder</p>
              </div>
              <div className={styles.grid2}>

                <>
                  <div className={styles.inputBox}>
                    <label htmlFor="name">Nova Senha</label>
                    <input
                      type="password"
                      name='new_password'
                      onChange={(e) => handleRemoveError('new_password')}
                    />
                    {errorsMessage?.new_password && (
                      <p className={styles.errorMessage}>{errorsMessage.new_password.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}</p>)}
                  </div>
                  <div className={styles.inputBox}>
                    <label htmlFor="name">Repetir nova senha</label>
                    <input
                      type="password"
                      name='confirm_password'
                      onChange={(e) => handleRemoveError('confirm_password')}

                    />
                    {errorsMessage?.confirm_password && (
                      <p className={styles.errorMessage}>{errorsMessage.confirm_password.map((error, index) => (
                        <span key={index}>{error}</span>
                      ))}</p>)}
                  </div>
                </>
              </div>
            </>
          )}
          <div className={styles.buttons}>
            <ButtonComp>Atualizar Dados</ButtonComp>
          </div>

          {
            errorsMessage?.all_empty && (
              <p className={styles.errorMessage}>{errorsMessage.all_empty}</p>
            )
          }

        </form>
      )}
    </div>
  )
}
