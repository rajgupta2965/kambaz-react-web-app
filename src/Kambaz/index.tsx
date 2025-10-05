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
import { useEffect, useState, type JSX } from "react";
import Session from "./Account/Session";
import * as client from "./Courses/client";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";

export default function Kambaz() {
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  function RequireEnrollment({ children }: { children: JSX.Element }) {
    const { cid } = useParams();
    const isFaculty = currentUser?.role === "FACULTY";
    const isEnrolled = !!cid && courses.some((c: any) => c._id === cid);
    return isFaculty || isEnrolled ? children : <Navigate to="/Kambaz/Dashboard" replace />;
  }

  const fetchCourses = async () => {
    try {
      const myCourses = await userClient.findMyCourses();
      setCourses(Array.isArray(myCourses) ? myCourses : myCourses?.courses ?? []);
    } catch (error) {
      console.error(error);
      setCourses([]);
    }
  }; useEffect(() => { fetchCourses(); }, [currentUser?._id]);

  const fetchAllCourses = async () => {
    try {
      const all = await client.findAllCourses();
      setAllCourses(Array.isArray(all) ? all : all?.courses ?? []);
    } catch (error) {
      console.error(error);
      setAllCourses([]);
    }
  }; useEffect(() => { fetchAllCourses(); }, [currentUser?._id]);

  const handleAddCourse = async (course: any) => {
    const newCourse = await userClient.createCourse(course);
    setCourses((prev) => [...prev, newCourse]);
    setAllCourses((prev) => [...prev, newCourse]);
  };

  const handleDeleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    setCourses((prev) => prev.filter((c) => c._id !== courseId));
    setAllCourses?.((prev) => prev.filter((c: any) => c._id !== courseId));
  };

  const handleUpdateCourse = async (updated: any) => {
    await courseClient.updateCourse(updated);
    setCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    setAllCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  const handleEnroll = async (courseId: string) => {
    const enrolledCourse = await userClient.enrollInCourse(courseId);
    setCourses((prev) =>
      prev.some((c) => c._id === enrolledCourse._id)
        ? prev
        : [...prev, enrolledCourse]
    );
  };

  const handleUnenroll = async (courseId: string) => {
    await userClient.unenrollFromCourse(courseId);
    setCourses((prev) => prev.filter((c) => c._id !== courseId));
  };

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="Account" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={<ProtectedRoute>
              <Dashboard
                courses={courses}
                allCourses={allCourses}
                onAddCourse={handleAddCourse}
                onDeleteCourse={handleDeleteCourse}
                onUpdateCourse={handleUpdateCourse}
                onEnroll={handleEnroll}
                onUnenroll={handleUnenroll}
              />
            </ProtectedRoute>} />
            <Route path="Courses/:cid/*" element={<ProtectedRoute><RequireEnrollment><Courses /></RequireEnrollment></ProtectedRoute>} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Inbox" element={<Inbox />} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
