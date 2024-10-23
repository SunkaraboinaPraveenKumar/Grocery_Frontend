"use client"
import GlobalApi from '@/app/_utils/GlobalApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoaderIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';

function SignIn() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const router = useRouter();
  const [loader,setLoader]=useState(false);
  useEffect(()=>{
      const jwt=sessionStorage.getItem("jwt");
      if(jwt){
        router.replace("/");
      }
  },[])
  const onLogin = () => {
    setLoader(true);
    GlobalApi.signIn(email, password).then(resp => {
      // console.log(resp.data.user)
      // console.log(resp.data.jwt)
      sessionStorage.setItem("user", JSON.stringify(resp.data.user));
      sessionStorage.setItem("jwt", resp.data.jwt);
      toast("Login Successfull!")
      router.push("/");
      setLoader(false);
    }, (e) => {
      toast(e?.response?.data?.error?.message)
      // console.log(e);
      setLoader(false);
    })
  }
  return (
    <div className='flex items-baseline justify-center my-20'>
      <div className='flex flex-col items-center justify-center p-10 bg-slate-200 border border-gray-200'>
        <Image src={"/logo.png"} alt='logo' width={200} height={200} />
        <h2 className='font-bold text-3xl mt-5'>Sign In to Your Account</h2>
        <h2 className='text-gray-500'>Enter Your Email and Password to Login.</h2>
        <div className='w-full flex flex-col gap-5 mt-7'>
          <Input placeholder='name@example.com' onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder='Password' type='password' onChange={(e) => setPassword(e.target.value)} />
          <Button disabled={!(email && password)} onClick={() => onLogin()}>
            {loader?<LoaderIcon className='animate-spin'/>:'Sign In'}
          </Button>
          <p>Donot have an account?
            <Link href={"/sign-in"} className='text-blue-500'>
              Click here to Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn