import React from "react";
import useIsFaculty from "./userIsFaculty";

type Props = { children: React.ReactNode };

export default function ShowIfFaculty({ children }: Props) {
  const isFaculty = useIsFaculty();
  return isFaculty ? <>{children}</> : null;
}