"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import React from "react";

const useRoleGuard = (requiredRoles = ["admin", "manager"]) => {
  const [isLoading, setIsLoading] = React.useState(true);

  const router = useRouter();
  const user = useSelector((state) => state.account.user);
  const currentBranch = useSelector((state) => state.branch.currentBranch);

  React.useEffect(() => {
    const checkUserRole = () => {
      if (!currentBranch) {
        router.push("/auth/chon-chi-nhanh");
        return;
      }
      if (!user) {
        router.push(`/auth/dang-nhap/${currentBranch.slug}`);
        return;
      }
      if (!requiredRoles.includes(user.role)) {
        router.push("/auth/401");
        return;
      }
      setIsLoading(false);
    };

    checkUserRole();
  }, [user, requiredRoles, currentBranch, router]);

  return { isLoading };
};

export default useRoleGuard;
