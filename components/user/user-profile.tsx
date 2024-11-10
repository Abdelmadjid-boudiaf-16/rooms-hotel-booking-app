import { MyUser } from "@/types";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import dayjs from "dayjs";

const UserProfile = ({ user }: { user: MyUser}) => {
  return (
    <Card className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="flex flex-wrap items-center gap-3 p-2 sm:flex-col sm:items-start">
        <Label>Name</Label>
        <span className="font-semibold">{user.name}</span>
      </Card>
      <Card className="flex flex-wrap items-center gap-3 p-2 sm:flex-col sm:items-start">
        <Label>Email</Label>
        <span className="font-semibold">{user.email}</span>
      </Card>
      <Card className="flex flex-wrap items-center gap-3 p-2 sm:flex-col sm:items-start">
        <Label>Role</Label>
        <span className="font-semibold">{user.admin ? "Admin" : "User"}</span>
      </Card>
      <Card className="flex flex-wrap items-center gap-3 p-2 sm:flex-col sm:items-start">
        <Label>Active Status</Label>
        <span className="font-semibold">
          {user.active ? "Active" : "Not active"}
        </span>
      </Card>
      <Card className="flex flex-wrap items-center gap-3 p-2 sm:flex-col sm:items-start">
        <Label>Joined at</Label>
        <span className="font-semibold">{dayjs(user.createdAt).format('hh:mm:ss / DD-MM-YYYY')}</span>
      </Card>
    </Card>
  );
};

export default UserProfile;
