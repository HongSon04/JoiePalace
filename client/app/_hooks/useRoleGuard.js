"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBranch } from "../_lib/features/branch/branchSlice";

const useRoleGuard = (requiredRoles = ["admin", "manager"]) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const user = useSelector((state) => state.account.user);
  const currentBranch = useSelector((state) => state.branch.currentBranch);
  const dispatch = useDispatch();

  // console.log(currentBranch);

  React.useEffect(() => {
    const storedBranch = JSON.parse(localStorage.getItem("currentBranch"));
    if (storedBranch) {
      dispatch(getCurrentBranch(storedBranch));
    }
  }, []);

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

    return () => {};
  }, [user, requiredRoles, currentBranch, router]);

  return { isLoading };
};

export default useRoleGuard;
