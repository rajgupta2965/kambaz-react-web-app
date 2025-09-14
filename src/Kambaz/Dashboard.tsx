import { Link } from "react-router-dom";
import { Button, Card, Col, FormControl, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import ShowIfFaculty from "./auth/ShowIfFaculty";
import { useState } from "react";

export default function Dashboard({ courses = [], allCourses = [], addNewCourse, deleteCourse, updateCourse, enrolling, setEnrolling, updateEnrollment }
  : {
    courses: any[]; allCourses: any[];
    addNewCourse?: (course: any) => Promise<void> | void;
    deleteCourse?: (courseId: string) => Promise<void> | void;
    updateCourse?: (course: any) => Promise<void> | void;
    enrolling: boolean;
    setEnrolling: (enrolling: boolean) => void;
    updateEnrollment: (courseId: string, enrolled: boolean) => void;
  }) {

  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY" || currentUser?.role === "TA";
  const isStudent = currentUser?.role === "STUDENT";
  const isAdmin = currentUser?.role === "ADMIN";
  const visibleCourses = (isFaculty || isAdmin) ? allCourses : (enrolling ? allCourses : courses);

  const [course, setCourse] = useState<any>({
    _id: "new",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
    image: "reactjs.jpg",
  });

  const addCourse = async () => {
    if (!addNewCourse) return;
    const { _id, ...payload } = course;
    await addNewCourse(payload);
    setCourse({
      _id: "new",
      name: "New Course",
      number: "New Number",
      startDate: "2023-09-10",
      endDate: "2023-12-15",
      description: "New Description",
      image: "reactjs.jpg",
    });
  };

  const removeCourse = async (courseId: string) => {
    await deleteCourse?.(courseId);
  };

  const saveUpdateCourse = async () => {
    if (!course?._id || course._id === "new") return;
    await updateCourse?.(course);
  };

  const isEnrolled = (courseId: string) =>
    isStudent &&
    (enrolling
      ? courses.some((c: any) => String(c._id) === String(courseId) && c.enrolled === true)
      : courses.some((c: any) => String(c._id) === String(courseId)));

  const enrolledCount = enrolling ? courses.filter((c: any) => c.enrolled).length : courses.length;

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        {isStudent && (
          <Button
            variant="primary"
            className="float-end"
            id="wd-enrollments-toggle"
            onClick={() => setEnrolling(!enrolling)}
          >
            {enrolling ? "My Courses" : "All Courses"}
          </Button>
        )}
      </h1>
      <hr />

      <ShowIfFaculty>
        <h5>
          New Course
          <button
            className="btn btn-primary float-end"
            id="wd-add-new-course-click"
            onClick={addCourse}
          >{" "}
            Add
          </button>
          <button
            className="btn btn-warning float-end me-2"
            onClick={saveUpdateCourse}
            id="wd-update-course-click"
          >{" "}
            Update
          </button>
        </h5>
        <br />
        <FormControl
          value={course.name}
          className="mb-2"
          onChange={(e) => setCourse({ ...course, name: e.target.value })}
        />
        <FormControl
          as="textarea"
          value={course.description}
          rows={3}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
        />
        <hr />
      </ShowIfFaculty>

      <h2 id="wd-dashboard-published">
        {(isFaculty || isAdmin)
          ? `Published Courses (${allCourses.length})`
          : enrolling
            ? `Published Courses (${allCourses.length})`
            : `Enrolled Courses (${enrolledCount})`}
      </h2>

      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((course: any) => {
            const enrolled = isEnrolled(course._id);
            return (
              <Col
                key={course._id}
                className="wd-dashboard-course"
                style={{ width: "300px" }}
              >
                <Card>
                  <Link
                    to={`/Kambaz/Courses/${course._id}/Home`}
                    className="wd-dashboard-course-link text-decoration-none text-dark"
                    onClick={(e) => {
                      if (!isFaculty && !enrolled) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <Card.Img
                      src={
                        course.image
                          ? course.image.startsWith("/") || course.image.startsWith("http")
                            ? course.image
                            : `/images/${course.image}`
                          : "/images/reactjs.jpg"
                      }
                      alt={course.name}
                      variant="top"
                      width="100%"
                      height={160}
                    />

                    <Card.Body className="card-body">
                      <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                        {course.name}
                      </Card.Title>
                      <Card.Text
                        className="wd-dashboard-course-description overflow-hidden"
                        style={{ height: "100px" }}
                      >
                        {course.description}
                      </Card.Text>

                      <Button variant="primary" disabled={!isFaculty && !enrolled}> Go </Button>

                      {isStudent && enrolling && (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            updateEnrollment(course._id, !enrolled);
                          }}
                          className={`btn ${enrolled ? "btn-danger" : "btn-success"} float-end`}
                        >
                          {enrolled ? "Unenroll" : "Enroll"}
                        </button>
                      )}

                      <ShowIfFaculty>
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                            removeCourse(course._id);
                          }}
                          className="btn btn-danger float-end"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </button>
                      </ShowIfFaculty>

                      <ShowIfFaculty>
                        <button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          className="btn btn-warning me-2 float-end"
                        >
                          Edit
                        </button>
                      </ShowIfFaculty>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
}