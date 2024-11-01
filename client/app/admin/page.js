"use client";

import { useRouter } from "next/navigation";
import Loading from "../loading";

function Page() {
  const router = useRouter();
  router.push("/auth/chon-chi-nhanh");

  return (
    <div>
      <Loading />
    </div>
  );
}

export default Page;
