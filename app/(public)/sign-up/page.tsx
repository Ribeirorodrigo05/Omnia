import { GalleryVerticalEnd } from 'lucide-react'
import Link from 'next/link'

import { SignupForm } from '@/components/signup-form'
import Image from 'next/image'

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
       
        <div className="flex flex-1 items-center justify-center">
          
          <div className="w-full max-w-xs">
             <div className="flex justify-center items-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center justify-center gap-2 font-medium w-full py-6">
            <Image 
            src={"https://i.ibb.co/CK6PbDFH/OMNIA-Logo-Expandida-Color-3x.png"}
            alt="omnia logo"
            width={200}
            height={50}
            />
          </Link>
        </div>
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
