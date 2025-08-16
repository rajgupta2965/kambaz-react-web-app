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

	const courseExams = assignments.filter(
		(a) => a.course === currentCourseId && a.type === "exam"
	);

	return (
		<Container className="m-2">
			<div id="wd-assignments">
				<AssignmentControls /><br /><br />

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

			</div >
		</Container>
	);
}
