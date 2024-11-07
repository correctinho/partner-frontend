"use client"

import styles from './page.module.css'
import { z } from 'zod';

import Link from 'next/link';
import { signIn } from 'next-auth/react';

import { useRouter } from 'next/navigation';

import { RiLockPasswordFill } from "react-icons/ri";
import { HiIdentification } from "react-icons/hi2";
import { MdAlternateEmail } from "react-icons/md";

import Image from "next/image";
export default function Home() {
  const router = useRouter()

  async function login(formData: FormData) {


    const { business_document, credential, password } = Object.fromEntries(formData)
    if (!business_document || !credential || !password) {
      alert("preencha tudo")
      return
    }

    let emailValue = ''
    let user_name = ''


    const emailValidation = z.string().email().safeParse(credential)
    if (emailValidation.success) {
      emailValue = emailValidation.data

    } else {
      user_name = credential as string
      emailValue = ''
    }
    try {

      const result = await signIn('credentials', {
        business_document,
        email: emailValue,
        user_name,
        password,
        redirect: false
      })


      if (result?.error) {
        router.replace('/')
        return
      }


      router.replace('/dashboard')
    } catch (err: any) {

      console.log("Login error: ", err)
    }



  }

  return (
    <>

      <main className={styles.containerCenter}>


        <section className={styles.login}>

          <div className={styles.logoTop}>
            <h2>Correct</h2>
            {/* <Image src={`https://ggeixytstedqzounudkz.supabase.co/storage/v1/object/public/correctcards/refeicao.png`} width={200} height={200} alt="Card" /> */}
          </div>

          <form action={login} className={styles.formLogin}>
            <h1>Faça seu login
              na plataforma</h1>

            <section className={styles.containerInputsLogin}>
              <div className={styles.inputLogin}>
                <label htmlFor="document">
                  <HiIdentification size={20} />
                </label>
                <input
                  type="text"
                  name="business_document"
                  placeholder='CNPJ / CPF'
                  required
                />
              </div>
              <div className={styles.inputLogin}>
                <label htmlFor="credentials">
                  <MdAlternateEmail size={20} />
                </label>
                <input
                  type="text"
                  name="credential"
                  placeholder='Email ou nome de usuário'
                  required
                />
              </div>
              <div className={styles.inputLogin}>
                <label htmlFor="password">
                  <RiLockPasswordFill size={20} />
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder='Senha'
                  required
                />
              </div>

            </section>

            <div className={styles.forgetPass}>
              <span>
                <a href="#">Esqueci minha senha</a>
              </span>
            </div>

            <button
              type='submit'
              className={styles.buttonLogin}
            >
              Entrar
            </button>

          </form>


          <Link href="/signup" className={styles.text}>Não possui conta ? Cadastre-se</Link>

          <div className={styles.logoBottom}>
            <h2>Correct</h2>
          </div>
        </section>
      </main >

    </>
  )
}
