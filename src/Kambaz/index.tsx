import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Account from "./Account";
import Dashboard from "./Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import Calendar from "./Calendar";
import Inbox from "./Inbox";
import "./styles.css";
import ProtectedRoute from "./Account/ProtectedRoute";
import type { JSX } from "react";

function RequireEnrollment({ children }: { children: JSX.Element }) {
  const { cid } = useParams();
  const { currentUser } = useSelector((s: any) => s.accountReducer);
  const { enrollments } = useSelector((s: any) => s.coursesReducer);

  const isFaculty = currentUser?.role === "FACULTY";
  const isEnrolled = !!cid && enrollments?.some((e: any) => e.user === currentUser?._id && e.course === cid);
  return isFaculty || isEnrolled ? children : <Navigate to="/Kambaz/Dashboard" replace />;
}

export default function Kambaz() {
  return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">
        <Routes>
          <Route path="/" element={<Navigate to="Account" />} />
          <Route path="/Account/*" element={<Account />} />
          <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route
            path="Courses/:cid/*"
            element={<ProtectedRoute><RequireEnrollment><Courses /></RequireEnrollment></ProtectedRoute>}
          />
          <Route path="/Calendar" element={<Calendar />} />
          <Route path="/Inbox" element={<Inbox />} />
        </Routes>
      </div>
    </div>
  );
}