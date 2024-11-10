"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { hotelSchema } from "@/form-schemas";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { CancelConfirm } from "../confirm-cancel";
import { useToast } from "@/hooks/use-toast";
import { Icons } from "../icons";
import Image from "next/image";
import { Hotel } from "@/types";

interface ApiResponse {
  message: string;
  status: number;
}

const HotelForm = ({
  title,
  type = "add",
  hotel,
}: {
  title: string;
  type?: string;
  hotel?: Hotel;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof hotelSchema>>({
    resolver: zodResolver(hotelSchema),
    defaultValues: {
      name: hotel?.name ?? "",
      email: hotel?.email ?? "",
      phone: hotel?.phone ?? "",
      images: hotel?.images ?? [],
      location: hotel?.location ?? "",
      owner: hotel?.owner ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof hotelSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        type === "add" ? "/api/hotels/add" : `/api/hotels/edit/${hotel?.id}`,
        {
          method: type === "add" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        },
      );

      const data = (await response.json()) as ApiResponse;

      if (response.ok) {
        toast({
          title: type === "add" ? "Add hotel" : "Edit hotel",
          description: `${type === "add" ? "Add" : "Edit"} hotel successful`,
        });
        router.push("/admin/hotels");
      } else {
        toast({
          variant: "destructive",
          title: `${type === "add" ? "Add" : "Edit"} hotel failed`,
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `An unexpected error occurred: ${error}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-2xl flex-col gap-y-6 rounded-lg border p-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Hotel Name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="owner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Owner <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Owner" />
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
                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Email Address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Phone Number <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Location <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <div>
                    <CldUploadWidget
                      uploadPreset={`${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`}
                      onSuccess={(result) => {
                        const info = result.info as {
                          secure_url: string;
                        };
                        field.onChange([...field.value, info.secure_url]);
                      }}
                      options={{
                        multiple: true,
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => open()}
                        >
                          Upload Images
                        </Button>
                      )}
                    </CldUploadWidget>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {field.value.map((url, index) => (
                        <div className="relative" key={index}>
                          <Image
                            src={url}
                            alt={`Uploaded image ${index + 1}`}
                            className="h-24 w-24 object-cover"
                            width={96}
                            height={96}
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              const newImages = [...field.value];
                              newImages.splice(index, 1);
                              field.onChange(newImages);
                            }}
                            className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
                          >
                            <Icons.close className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <div className="flex items-center justify-end space-x-4">
              <CancelConfirm path="/admin/hotels" />
              <Button disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default HotelForm;
