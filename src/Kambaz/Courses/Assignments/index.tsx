import { assignments } from "../../Database";
import { useParams, Link } from "react-router-dom";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { GrDocumentText } from "react-icons/gr";
import LessonControlButtons from "../Modules/LessonControlButtons";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentControls from "./AssignmentsControls";

export default function Assignments() {
	const { courseId, cid } = useParams();
	const currentCourseId = courseId ?? cid ?? "";

	const courseAssignments = assignments.filter(
		(a) => a.course === currentCourseId && a.type === "assignment"
	);
	const courseQuizzes = assignments.filter(
		(a) => a.course === currentCourseId && a.type === "quiz"
	);
	const courseExams = assignments.filter(
		(a) => a.course === currentCourseId && a.type === "exam"
	);
	const courseProjects = assignments.filter(
		(a) => a.course === currentCourseId && a.type === "project"
	);

	return (
		<Container className="m-2">
			<div id="wd-assignments">
				<AssignmentControls /><br /><br />

				{/* ASSIGNMENTS */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown className="me-2 fs-3" />
						ASSIGNMENTS
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>40% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						{courseAssignments.map((assignment) => (
							<ListGroup.Item key={assignment._id} className="wd-lesson p-3 ps-1">
								<Row className="align-items-center text-nowrap gx-3">
									<Col xs="auto" className="d-flex align-items-center">
										<BsGripVertical className="me-2 fs-3" />
										<GrDocumentText className="fs-3 text-success" />
									</Col>
									<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
										<Link to={`/Kambaz/Courses/${currentCourseId}/Assignments/${assignment._id}`}
											className="fw-semibold text-truncate d-block text-dark text-decoration-none">
											{assignment.title}
										</Link>
										<p className="mb-0 text-truncate small">
											<span className="text-danger">Multiple Modules</span> |{" "}
											<b>Not available until</b> {assignment.startDate} | <br />
											<b>Due</b> {assignment.endDate} | {assignment.points} pts
										</p>
									</Col>
									<Col xs="auto" className="d-flex justify-content-end align-items-center">
										<LessonControlButtons />
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				</ListGroup.Item>

				{/* QUIZZES */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown className="me-2 fs-3" />
						QUIZZES
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>10% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						{courseQuizzes.map((quiz) => (
							<ListGroup.Item key={quiz._id} className="wd-lesson p-3 ps-1">
								<Row className="align-items-center text-nowrap gx-3">
									<Col xs="auto" className="d-flex align-items-center">
										<BsGripVertical className="me-2 fs-3" />
										<GrDocumentText className="fs-3 text-success" />
									</Col>
									<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
										<Link to={`/Kambaz/Courses/${currentCourseId}/Assignments/${quiz._id}`}
											className="fw-semibold text-truncate d-block text-dark text-decoration-none">
											{quiz.title}
										</Link>
										<p className="mb-0 text-truncate small">
											<span className="text-danger">Multiple Modules</span> |{" "}
											<b>Not available until</b> {quiz.startDate} | <br />
											<b>Due</b> {quiz.endDate} | {quiz.points} pts
										</p>
									</Col>
									<Col xs="auto" className="d-flex justify-content-end align-items-center">
										<LessonControlButtons />
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				</ListGroup.Item>

				{/* EXAMS */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown className="me-2 fs-3" />
						EXAMS
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>20% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						{courseExams.map((exam) => (
							<ListGroup.Item key={exam._id} className="wd-lesson p-3 ps-1">
								<Row className="align-items-center text-nowrap gx-3">
									<Col xs="auto" className="d-flex align-items-center">
										<BsGripVertical className="me-2 fs-3" />
										<GrDocumentText className="fs-3 text-success" />
									</Col>
									<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
										<Link to={`/Kambaz/Courses/${currentCourseId}/Assignments/${exam._id}`}
											className="fw-semibold text-truncate d-block text-dark text-decoration-none">
											{exam.title}
										</Link>
										<p className="mb-0 text-truncate small">
											<span className="text-danger">Multiple Modules</span> |{" "}
											<b>Date:</b> {exam.startDate} | {exam.points} pts
										</p>
									</Col>
									<Col xs="auto" className="d-flex justify-content-end align-items-center">
										<LessonControlButtons />
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				</ListGroup.Item>

				{/* PROJECTS */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown className="me-2 fs-3" />
						PROJECTS
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>30% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						{courseProjects.map((project) => (
							<ListGroup.Item key={project._id} className="wd-lesson p-3 ps-1">
								<Row className="align-items-center text-nowrap gx-3">
									<Col xs="auto" className="d-flex align-items-center">
										<BsGripVertical className="me-2 fs-3" />
										<GrDocumentText className="fs-3 text-success" />
									</Col>
									<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
										<Link to={`/Kambaz/Courses/${currentCourseId}/Assignments/${project._id}`}
											className="fw-semibold text-truncate d-block text-dark text-decoration-none">
											{project.title}
										</Link>
										<p className="mb-0 text-truncate small">
											<span className="text-danger">Project Work</span> |{" "}
											<b>Date:</b> {project.startDate} | {project.points} pts
										</p>
									</Col>
									<Col xs="auto" className="d-flex justify-content-end align-items-center">
										<LessonControlButtons />
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				</ListGroup.Item>

			</div >
		</Container>
	);
}
