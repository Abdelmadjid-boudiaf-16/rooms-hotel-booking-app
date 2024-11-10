"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Icons } from '@/components/icons'
import { useToast } from '@/hooks/use-toast'
import { registerSchema } from '@/form-schemas'
import { googleHandleSignIn } from '@/actions'
import Link from 'next/link'
import { PasswordInput } from '@/components/ui/password-input'


export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ''
    },
  })

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true)
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    if (response.ok) {
      toast({
        title: "Registration successful",
        description: "You can now log in with your new account.",
      })
      router.push('/login')
    } else {
      const errorData = await response.json()
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: errorData.message,
      })
    }
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col w-full max-w-xl border border-primary/20 rounded-md p-8 space-y-4 shadow-lg">
      <h1 className="text-4xl font-bold mb-4">Sign UP</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                 <PasswordInput  placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput  placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
            Register
          </Button>
        </form>
      </Form>
      <div className='relative border-t '><span className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-background'>Or</span></div>
      <form action={googleHandleSignIn}>
        <Button variant="outline" className='w-full'>
          <Icons.google className="mr-2 h-4 w-4" />
          Google
          </Button>
          </form>
      <div className='flex items-center w-full text-sm space-x-3 justify-between'>
        <span>Have an account?</span> <Button asChild variant={'outline'}><Link href={'/login'}>Login</Link></Button>
      </div>
    </div>
  )
}