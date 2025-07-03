

import { Metadata } from "next";
import LoginScreen from "./screen/login-screen";
import { constructMetadata } from "@/configs";


export const metadata: Metadata = constructMetadata({
  title: 'Login - Notiqo',
  description: 'Login to your Notiqo account',
  canonical: '/login',
})

export default function LoginPage() {


  return <LoginScreen />
}
