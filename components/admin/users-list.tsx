"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MyUser } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { CheckIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const UsersList = ({ users }: { users: MyUser[] }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
    userId: string,
  ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedRole = formData.get("role") as string;
    try {
      const response = await fetch(`/api/users/update-role/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      toast({
        title: "Updating Role",
        description: "User role updated successfully",
      });
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "updating role",
        description: `${error}`,
      });
    }
  };
  return (
    <Table>
      <TableCaption>
        <div className="mt-10 flex flex-col items-center gap-y-3">
          <span>A list of your users.</span>{" "}
        </div>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>UserId</TableHead>
          <TableHead>User Role</TableHead>
          <TableHead>Change Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.id}</TableCell>
            <TableCell>{user.admin ? "admin" : "user"}</TableCell>
            {user.id !== session?.user.id && (
              <TableCell>
                <form
                  onSubmit={(event) => handleSubmit(event, user.id)}
                  className="flex items-center gap-2"
                >
                  <Select
                    name="role"
                    defaultValue={user.admin ? "admin" : "user"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <Input type="hidden" value={user.id} name="id" />
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <Button variant={"outline"}>
                    <CheckIcon />
                  </Button>
                </form>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersList;
