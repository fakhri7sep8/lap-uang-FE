'use client'

import React, { useState } from 'react'
import * as Yup from 'yup'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Form, useFormik } from 'formik'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email().required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .required('Password is required')
})

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      console.log('Form submitted:', values)
      // Handle form submission logic here
    },
    validationSchema: LoginSchema
  })

  return (
    <div>
      <section className='flex gap-0'>
        <div className="w-full bg-[url('/img/login.png')] bg-cover bg-no-repeat bg-center h-screen flex items-center justify-center"></div>
        <div className="w-full bg-[url('/img/bg-login.png')] bg-no-repeat bg-inherit bg-cover  h-screen flex items-center justify-center px-24 py-12 ">
          <div className=' glass-card w-full h-full flex items-center justify-center flex-col gap-8  rounded-4xl py-6 px-12 '>
            <Image
              src='/img/logo.png'
              alt='Logo'
              width={200}
              height={200}
              className=''
            />
            <h3 className='text-xl font-semibold'>
              Selamat Datang di Aplikasi LapUang
            </h3>
            <div className='w-full h-full flex flex-col gap-4'>
              <form
                className='flex flex-col gap-4 '
                action=''
                onSubmit={formik.handleSubmit}
                method=''
              >
                <div className='flex flex-col gap-2'>
                  <span>Email</span>
                  <Input
                    type='email'
                    className='h-14 ring-none outline-0'
                    placeholder='enter your email'
                    onChange={(e)=> formik.setFieldValue("email", e.target.value)}
                  />
                </div>
                <div className='flex flex-col gap-2'>
                  <span>Email</span>
                  <Input
                    type='password'
                    className='h-14 ring-none outline-0'
                    placeholder='enter your email'
                    onChange={(e) =>formik.setFieldValue("password", e.target.value)}
                  />
                </div>
                <button  type="submit"  className='w-full h-14 flex justify-center items-center bg-black rounded-xl mt-4 text-white'>Login</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LoginPage
