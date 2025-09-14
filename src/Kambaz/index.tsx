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
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";

export default function Kambaz() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);

  function RequireEnrollment({ children }: { children: JSX.Element }) {
    const { cid } = useParams();
    const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "TA";
    const isEnrolled = !!cid && courses.some((c: any) => String(c._id) === String(cid));
    return isFaculty || isEnrolled ? children : <Navigate to="/Kambaz/Dashboard" replace />;
  }

  const [enrolling, setEnrolling] = useState<boolean>(false);
  const findCoursesForUser = async () => {
    try {
      const courses = await userClient.findCoursesForUser(currentUser._id);
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  const updateEnrollment = async (courseId: string, enrolled: boolean) => {
    if (enrolled) {
      await userClient.enrollIntoCourse(currentUser._id, courseId);
    } else {
      await userClient.unenrollFromCourse(currentUser._id, courseId);
    }
    setCourses(
      courses.map((course) => {
        if (course._id === courseId) {
          return { ...course, enrolled: enrolled };
        } else {
          return course;
        }
      })
    );
  };
  const fetchCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses();
      setAllCourses(allCourses);
      const enrolledCourses = await userClient.findCoursesForUser(
        currentUser._id
      );
      const courses = allCourses.map((course: any) => {
        if (enrolledCourses.find((c: any) => c._id === course._id)) {
          return { ...course, enrolled: true };
        } else {
          return course;
        }
      });
      setCourses(courses);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!currentUser) return;
    const isFaculty = currentUser.role === "FACULTY" || currentUser.role === "TA" || currentUser.role === "ADMIN";
    if (isFaculty || enrolling) {
      fetchCourses();
    } else {
      findCoursesForUser();
    }
  }, [currentUser, enrolling]);

  const addNewCourse = async (course: any) => {
    const newCourse = await courseClient.createCourse(course);
    setAllCourses((prev) => [...prev, newCourse]);
    setCourses((prev) => [...prev, newCourse]);
  };

  const updateCourse = async (updated: any) => {
    await courseClient.updateCourse(updated);
    setCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
    setAllCourses((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
  };

  const deleteCourse = async (courseId: string) => {
    await courseClient.deleteCourse(courseId);
    setAllCourses((prev) => prev.filter((c) => c._id !== courseId));
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
                addNewCourse={addNewCourse}
                deleteCourse={deleteCourse}
                updateCourse={updateCourse}
                enrolling={enrolling}
                setEnrolling={setEnrolling}
                updateEnrollment={updateEnrollment}
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
