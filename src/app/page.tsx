import { SignOut } from "@/components/Auth/signOut";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/signIn">SignIn</Link>
      <SignOut />
    </div>
  );
}
