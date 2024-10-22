'use server'

import axios, { AxiosError } from "axios";
import { AuthTokenError } from "./errors/AuthTokenError";
import { auth } from "../lib/auth";


const baseURL = process.env.BASE_URL as string

export async function setupAPIClient(ctx = {}) {


    const session = await auth()

    const api = axios.create({
        baseURL: baseURL,
        headers: {
            Authorization: `Bearer ${session?.user?.token}`
        }
    })
    api.interceptors.response.use(response => {

        return response
    }, async (error: AxiosError) => {
        //console.log("error axios: ", error)
        if (error.response?.status === 401) {
            if (typeof window !== undefined) {

                return Promise.reject(new AuthTokenError)
            }
            else {
                console.log('caiu aqui 2')
                return Promise.reject(new AuthTokenError)
            }


        }

        return Promise.reject(error)
    })

    return api
}
