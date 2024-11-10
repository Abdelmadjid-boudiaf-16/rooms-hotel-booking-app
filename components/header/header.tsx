import { MyUser } from "@/types";
import { Button } from "../ui/button";
import UserInfo from "./user-info";
import Link from "next/link";
import Logo from "../logo";
import { Building2Icon } from "lucide-react";
const HeaderComponent = ({
  userInfo,
}: {
  userInfo: MyUser | null
  }) => {
  return (
    <div className="sticky top-0 z-10 flex w-full items-center justify-between border-b border-primary/20 px-2 py-3 backdrop-blur md:top-4 md:rounded-xl md:border-2">
      <div className="flex gap-2 items-center">
        <Logo />
        <Building2Icon size={30} className="text-destructive" />
      </div>
      <div className="inline-flex items-center space-x-4">
        {!userInfo ? (
          <Button
            variant={"outline"}
            size={"sm"}
            asChild
            className="rounded-full"
          >
            <Link href={"/login"}>Sign In</Link>
          </Button>
        ) : (
          <UserInfo userInfo={userInfo} />
        )}
      </div>
    </div>
  );
};

export default HeaderComponent;
