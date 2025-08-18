import { useParams, Link } from "react-router-dom";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { GrDocumentText } from "react-icons/gr";
import AssignmentControls from "./AssignmentsControls";
import AssignmentTypeControlButtons from "./AssignmentTypeControlButtons";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function Assignments() {
	const { courseId, cid } = useParams();
	const currentCourseId = courseId ?? cid ?? "";
	const { assignments } = useSelector((s: any) => s.assignmentsReducer);

	const courseAssignments = assignments.filter(
		(a: any) => a.course === currentCourseId && a.assignType === "Assignment"
	);
	const courseQuizzes = assignments.filter(
		(a: any) => a.course === currentCourseId && a.assignType === "Quiz"
	);
	const courseExams = assignments.filter(
		(a: any) => a.course === currentCourseId && a.assignType === "Exam"
	);
	const courseProjects = assignments.filter(
		(a: any) => a.course === currentCourseId && a.assignType === "Project"
	);

	const [showAssignments, setShowAssignments] = useState(true);
	const [showQuizzes, setShowQuizzes] = useState(true);
	const [showExams, setShowExams] = useState(true);
	const [showProjects, setShowProjects] = useState(true);

	return (
		<Container className="m-2">
			<div id="wd-assignments">
				<AssignmentControls /><br /><br />

				{/* ASSIGNMENTS */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown
							className="me-2 fs-3"
							style={{
								transform: showAssignments ? "rotate(0deg)" : "rotate(-90deg)",
								transition: "transform 150ms ease"
							}}
							onClick={() => setShowAssignments(!showAssignments)}
							role="button"
							aria-label="Toggle assignments"
							tabIndex={0} />
						ASSIGNMENTS
						<AssignmentTypeControlButtons assignType="Assignment" />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>40% of Total</Button>
					</div>
					{showAssignments && (
						<ListGroup className="wd-lessons rounded-0">
							{courseAssignments.map((assignment: any) => (
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
											<AssignmentControlButtons
												assignmentId={assignment._id}
												initialTitle={assignment.title}
											/>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</ListGroup.Item>

				{/* QUIZZES */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown
							className="me-2 fs-3"
							style={{
								transform: showQuizzes ? "rotate(0deg)" : "rotate(-90deg)",
								transition: "transform 150ms ease"
							}}
							onClick={() => setShowQuizzes(!showQuizzes)}
							role="button"
							aria-label="Toggle quizzes"
							tabIndex={0} />
						QUIZZES
						<AssignmentTypeControlButtons assignType="Quiz" />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>10% of Total</Button>
					</div>
					{showQuizzes && (
						<ListGroup className="wd-lessons rounded-0">
							{courseQuizzes.map((quiz: any) => (
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
											<AssignmentControlButtons assignmentId={quiz._id} initialTitle={quiz.title} />
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</ListGroup.Item>

				{/* EXAMS */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown
							className="me-2 fs-3"
							style={{
								transform: showExams ? "rotate(0deg)" : "rotate(-90deg)",
								transition: "transform 150ms ease"
							}}
							onClick={() => setShowExams(!showExams)}
							role="button"
							aria-label="Toggle exams"
							tabIndex={0} />
						EXAMS
						<AssignmentTypeControlButtons assignType="Exam" />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>20% of Total</Button>
					</div>
					{showExams && (
						<ListGroup className="wd-lessons rounded-0">
							{courseExams.map((exam: any) => (
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
												<b>Not available until</b> {exam.startDate} | <br />
												<b>Due</b> {exam.endDate} | {exam.points} pts
											</p>
										</Col>
										<Col xs="auto" className="d-flex justify-content-end align-items-center">
											<AssignmentControlButtons assignmentId={exam._id} initialTitle={exam.title} />
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</ListGroup.Item>

				{/* PROJECTS */}
				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" />{" "}
						<IoMdArrowDropdown
							className="me-2 fs-3"
							style={{
								transform: showProjects ? "rotate(0deg)" : "rotate(-90deg)",
								transition: "transform 150ms ease"
							}}
							onClick={() => setShowProjects(!showProjects)}
							role="button"
							aria-label="Toggle projects"
							tabIndex={0} />
						PROJECTS
						<AssignmentTypeControlButtons assignType="Project" />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>30% of Total</Button>
					</div>
					{showProjects && (
						<ListGroup className="wd-lessons rounded-0">
							{courseProjects.map((project: any) => (
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
												<b>Not available until</b> {project.startDate} | <br />
												<b>Due</b> {project.endDate} | {project.points} pts
											</p>
										</Col>
										<Col xs="auto" className="d-flex justify-content-end align-items-center">
											<AssignmentControlButtons assignmentId={project._id} initialTitle={project.title} />
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					)}
				</ListGroup.Item>

			</div >
		</Container>
	);
}
