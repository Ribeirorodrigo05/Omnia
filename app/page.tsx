import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootPage() {
  const session = await auth.api.getSession()

  if(!session) {
    redirect('/sign-in')
  }

  if(session.user) {
    redirect('/home')
  }
}
