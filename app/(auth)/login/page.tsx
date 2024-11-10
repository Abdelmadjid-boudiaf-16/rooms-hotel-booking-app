"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { credentialsHandleSignIn, googleHandleSignIn } from "@/actions";
import Link from "next/link";
import { loginSchema } from "@/form-schemas";
import { PasswordInput } from "@/components/ui/password-input";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { update: updateSession } = useSession();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const result = await credentialsHandleSignIn(values);

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: result.error,
        });
        setIsLoading(false);
      } else {
        await updateSession();

        toast({
          title: "Success",
          description: "Logged in successfully",
        });

        router.replace("/");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: `${error}`,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-xl flex-col space-y-4 rounded-md border border-primary/20 bg-background p-8 shadow-lg">
      <h1 className="mb-4 text-4xl font-bold">Login</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    type="email"
                    autoComplete="email"
                    {...field}
                  />
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
                  <PasswordInput
                    placeholder="******"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <form action={googleHandleSignIn}>
        <Button variant="outline" className="w-full" type="submit">
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
      </form>
      <div className="flex w-full items-center justify-between text-sm">
        <span className="text-muted-foreground">Don&apos;t have an account?</span>
        <Button asChild variant="outline" size="sm">
          <Link href="/register">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
