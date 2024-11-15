"use client";

import { useEffect, useState } from "react";

const GetPlatform = () => {
  const [platform, setPlatform] = useState(null);
  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/android/i.test(userAgent)) {
      setPlatform("Android");
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      setPlatform("iOS");
    } else if (/Win/.test(userAgent)) {
      setPlatform("Windows");
    } else if (/Mac/.test(userAgent)) {
      setPlatform("macOS");
    } else {
      setPlatform("Web");
    }
  }, []);
  return platform;
};
const getSessionData = async () => {
  const response = await fetch("/api/auth/session");
  const session = await response.json();

  if (session && session.user) {
    console.log("Email:", session.user.email);
    console.log("Name:", session.user.name);
    console.log("Image:", session.user.image);
  } else {
    console.log("User not logged in");
  }
};
export { GetPlatform, getSessionData };
