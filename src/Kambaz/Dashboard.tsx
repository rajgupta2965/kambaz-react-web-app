import { Link } from "react-router-dom";
import { Button, Card, Col, FormControl, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ShowIfFaculty from "./auth/ShowIfFaculty";
import { useState } from "react";

import { addCourse, deleteCourse, updateCourse, enroll, unenroll } from "./Courses/reducer";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { courses, enrollments } = useSelector((state: any) => state.coursesReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [course, setCourse] = useState<any>({
    _id: "new",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    description: "New Description",
    image: "reactjs.jpg",
  });

  const [showAll, setShowAll] = useState(false);
  const toggleShowAll = () => setShowAll((v) => !v);
  
  const addNewCourse = () => {
    dispatch(addCourse(course));
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

  const saveUpdateCourse = () => {
    if (!course?._id || course._id === "new") return;
    dispatch(updateCourse(course));
  };

  const removeCourse = (courseId: string) => {
    dispatch(deleteCourse(courseId));
  };

  const isEnrolled = (courseId: string) =>
    enrollments.some(
      (e: any) => e.user === currentUser._id && e.course === courseId
    );

  const visibleCourses = isFaculty ? courses : showAll ? courses : courses.filter((c: any) => isEnrolled(c._id));

  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">
        Dashboard
        {!isFaculty && (
          <Button
            variant="primary"
            className="float-end"
            id="wd-enrollments-toggle"
            onClick={toggleShowAll}
          >
            Enrollments
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
            onClick={addNewCourse}
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
        {isFaculty
          ? `Published Courses (${courses.length})`
          : showAll
          ? `Published Courses (${courses.length})`
          : `Enrolled Courses (${visibleCourses.length})`}
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          {visibleCourses.map((course: any) => (
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
                    if (!isFaculty && !isEnrolled(course._id)) {
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

                    <Button variant="primary"> Go </Button>

                    {!isFaculty && (
                      isEnrolled(course._id) ? (
                        <button
                          className="btn btn-danger ms-2"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(unenroll({ userId: currentUser._id, courseId: course._id }));
                          }}
                        >
                          Unenroll
                        </button>
                      ) : (
                        <button
                          className="btn btn-success ms-2"
                          onClick={(e) => {
                            e.preventDefault();
                            dispatch(enroll({ userId: currentUser._id, courseId: course._id }));
                          }}
                        >
                          Enroll
                        </button>
                      )
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
          ))}
        </Row>
      </div>
    </div>
  );
}
