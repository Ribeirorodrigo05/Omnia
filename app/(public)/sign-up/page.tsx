import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'

import { SignupForm } from '@/components/signup-form'
import Image from 'next/image'

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Omnia
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className=" relative hidden lg:flex justify-start items-center">
        <Image 
            src="https://drive.google.com/uc?id=15B67LE02sY_-hSbxwf3j6p5oxLKxUgKH"
            alt="omnia app preview"
            width={520}
            height={520}
        />
      </div>
    </div>
  )
}
