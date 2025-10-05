import { useSelector } from "react-redux";

type RootState = any;

export default function useIsFaculty(): boolean {
  const { currentUser } =
    useSelector((s: RootState) => s.accountReducer) ?? {};
  return currentUser?.role === "FACULTY" || currentUser?.role === "TA";
}