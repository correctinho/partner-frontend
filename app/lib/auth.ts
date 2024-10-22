
import {setupAPIClient } from "@/app/services/api"
import NextAuth from "next-auth"
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from "./auth.config";

const base_url = process.env.BASE_URL

export const {
    handlers: { GET, POST },
    auth,
    update,
    signIn,
    signOut,
} = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            name: 'credentials',
            credentials: {
                business_document: { label: 'business_document', type: 'text' },
                user_name: { label: 'user_name', type: 'text' },
                email: { label: 'email', type: 'email' },
                password: { label: 'password', type: 'password' }
            },

            async authorize(credentials) {
                const api = await setupAPIClient()
                try {

                    const response = await api.post("/business/admin/login", {
                        business_document: credentials.business_document,
                        email: credentials?.email,
                        user_name: credentials?.user_name,
                        password: credentials?.password
                    })
                    const user = await response.data

                    if (user) {
                        const headers = {
                            Authorization: `Bearer ${user.token}`
                        };

                        try {
                            const userDataResponse = await fetch(`${base_url}/business/admin/details`, {
                                method: 'GET',
                                headers: headers
                            });
                            if (!userDataResponse.ok) {
                                throw new Error('Network response was not ok');
                            }
                            const userData = await userDataResponse.json();
                            console.log({userData})

                            // Atribuição dos dados de userData a user
                            user.uuid = userData.uuid;
                            user.business_info_id = userData.business_info_uuid;
                            user.is_admin = userData.is_admin;
                            user.document = userData.document;
                            user.name = userData.name;
                            user.email = userData.email;
                            user.user_name = userData.user_name;
                            user.function = userData.function;
                            user.permissions = userData.permissions;
                            user.status = userData.status;
                            //user.business_status = userData.BusinessInfo.status

                            return user;
                        } catch (error) {
                            console.error('Error fetching user data:', error);
                            return null;
                        }

                    }

                    return null
                } catch (err) {

                    console.log("Login Error: ", err)
                    return
                }
            }

        })
    ],
    callbacks: {
        // jwt: async ({ token, user }) => {
        //     user && (token.user = user)

        //     return token
        // },
        // session: async ({ session, token }: any) => {
        //     session.user = token.user


        //     return session
        // },
        ...authConfig.callbacks
    }
})
