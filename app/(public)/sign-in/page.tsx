import Link from 'next/link'
import Image from 'next/image'

import { LoginForm } from '@/components/login-form'

export default function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <div className="flex justify-center items-center gap-2 md:justify-start">
              <Link href="/" className="flex items-center justify-center gap-2 font-medium w-full py-6">
                <Image
                  src="https://i.ibb.co/CK6PbDFH/OMNIA-Logo-Expandida-Color-3x.png"
                  alt="omnia logo"
                  width={200}
                  height={50}
                />
              </Link>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
      
      <div className="relative hidden lg:flex justify-start items-center">
        <Image
          src="https://i.ibb.co/tMJ8GVBf/Gemini-Generated-Image-kl3fctkl3fctkl3f-1.png"
          alt="omnia app"
          width={520}
          height={520}
        />
      </div>
    </div>
  )
}
