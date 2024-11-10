import { auth } from "@/auth";
import UserProfile from "@/components/user/user-profile";
import { prisma } from "@/prisma";
import { MyUser } from "@/types";

const UserProfilePage = async () => {
  const session = await auth();
  const response = await prisma.user.findUnique({
    where: { id: session?.user.id },
  });
  const user: MyUser = JSON.parse(JSON.stringify(response));
  return <UserProfile user={user} />;
};

export default UserProfilePage;
