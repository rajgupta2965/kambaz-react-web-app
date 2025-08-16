import Home from "./Home";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import Piazza from "./Piazza";
import Zoom from "./Zoom";
import Quizzes from "./Assignments/Quizzes";
import Grades from "./Grades";
import { Navigate, Route, Routes, useParams, useLocation } from "react-router-dom";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./People/Table";
import { Container } from "react-bootstrap";
import { courses } from "../Database";

export default function Courses() {
  const { cid } = useParams();
  const course = courses.find((course) => course._id === cid);
  const { pathname } = useLocation();
  return (
    <Container className="m-2">
      <div id="wd-courses">
        <h2 className="text-danger">
          <FaAlignJustify className="me-4 fs-4 mb-1" />
          {course && course.name} &gt; {pathname.split("/")[4]}
        </h2>

        <div className="d-flex">
          <div className="d-none d-md-block">
            <CourseNavigation />
          </div>
          <div className="flex-fill">
            <Routes>
              <Route path="/" element={<Navigate to="Home" />} />
              <Route path="Home" element={<Home />} />
              <Route path="Modules" element={<Modules />} />
              <Route path="Piazza" element={<Piazza />} />
              <Route path="Zoom" element={<Zoom />} />
              <Route path="Assignments" element={<Assignments />} />
              <Route path="Assignments/:aid" element={<AssignmentEditor />} />
              <Route path="Quizzes" element={<Quizzes />} />
              <Route path="Grades" element={<Grades />} />
              <Route path="People" element={<PeopleTable />} />
            </Routes>
          </div>
        </div>

      </div>
    </Container>
  );
}
