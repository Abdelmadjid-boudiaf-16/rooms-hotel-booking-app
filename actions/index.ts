'use server'

import { signIn, signOut } from "@/auth";
export const googleHandleSignIn = async () => {
    await signIn('google', {redirectTo: '/'})
}

export const credentialsHandleSignIn = async (data:{
    email: string;
    password: string;
}) => {
    const { email, password } = data
    const result = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
    })
    return result 
   
    
}

export const handleSignOut = async () => {
    await signOut({ redirectTo: '/login' })
}