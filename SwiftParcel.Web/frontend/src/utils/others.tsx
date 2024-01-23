import { Fragment, ReactNode } from "react";
import { getUserInfo } from "./storage";
import { Navigate } from "react-router-dom";

export function RolesAuthRoute({children, roles,}: {
  children: ReactNode;
  roles: (string | null)[];
}) {
  const userInfo = getUserInfo();
  console.log("UserInfo: ", userInfo)

  console.log("Required role: ", roles);
  console.log("User's role: ", userInfo?.role); 

  const allowed = roles.includes(userInfo?.role) || (roles.includes(null) && !userInfo);

  if (allowed) {
    return <Fragment>{children}</Fragment>;
  }

  if (allowed) {
    return <Fragment>{children}</Fragment>;
  }

  return <Navigate to="/" />;
}
