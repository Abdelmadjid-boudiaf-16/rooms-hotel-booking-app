import Link from "next/link";

const Logo = () => {
  return (
    <div className="text-4xl font-bold uppercase tracking-wider">
      <Link href={"/"}>
        <big className="text-primary">J</big>
        <small className="relative inline-block">
          i{" "}
          <div className="absolute left-[1px] top-0 z-10 h-2 w-2 rounded-full bg-destructive" />
        </small>
        <big className="text-primary">d</big>
        <small>o</small>
      </Link>
    </div>
  );
};

export default Logo;
