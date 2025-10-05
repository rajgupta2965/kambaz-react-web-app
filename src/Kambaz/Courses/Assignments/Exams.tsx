import { useParams, Link } from "react-router-dom";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import { GrDocumentText } from "react-icons/gr";
import AssignmentControls from "./AssignmentsControls";
import AssignmentTypeControlButtons from "./AssignmentTypeControlButtons";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setAssignments } from "./reducer";
import * as client from "./client";

export default function Assignments() {
	const { courseId, cid } = useParams();
	const currentCourseId = courseId ?? cid ?? "";
	const { assignments } = useSelector((s: any) => s.assignmentsReducer);

	const dispatch = useDispatch();

	useEffect(() => {
		if (!currentCourseId) return;
		client.findAssignmentsForCourse(currentCourseId).then((list) => {
			dispatch(setAssignments(list));
		});
	}, [currentCourseId, dispatch]);

	const courseExams = assignments.filter(
		(a: any) => a.course === currentCourseId && a.assignType === "Exam"
	);
	const [showExams, setShowExams] = useState(true);
	

	return (
		<Container className="m-2">
			<div id="wd-assignments">
				<AssignmentControls /><br /><br />
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

			</div >
		</Container>
	);
}
