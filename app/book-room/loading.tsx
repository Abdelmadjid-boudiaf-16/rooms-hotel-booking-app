import { Icons } from "@/components/icons";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Icons.spinner className="mr-2 h-10 w-10 animate-spin" />
    </div>
  );
}
