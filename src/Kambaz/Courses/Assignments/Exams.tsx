import { Button, ListGroup, Row, Col, Container } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { GrDocumentText } from "react-icons/gr";
import { IoMdArrowDropdown } from "react-icons/io";
import { Link } from "react-router";
import LessonControlButtons from "../LessonControlButtons";
import AssignmentControlButtons from "./AssignmentControlButtons";
import AssignmentControls from "./AssignmentsControls";

export default function Quizzes() {
	return (
		<Container className="m-2">
			<div id="wd-assignments">
				<AssignmentControls /><br /><br />

				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" /> <IoMdArrowDropdown className="me-2 fs-3" />
						EXAMS
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>20% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						<ListGroup.Item className="wd-lesson p-3 ps-1">
							<Row className="align-items-center text-nowrap gx-3">
								<Col xs="auto" className="d-flex align-items-center"><BsGripVertical className="me-2 fs-3" /><GrDocumentText className="fs-3 text-success" /></Col>
								<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
									<Link to="/Kambaz/Courses/1234/Assignments/123"
										className="fw-semibold text-truncate d-block text-dark text-decoration-none">
										E1
									</Link>
									<p className="mb-0 text-truncate small"><span className="text-danger">Module 1-3</span> | Date: May 15 at 2:00pm | 100pts <br />
									</p>
								</Col>
								<Col xs="auto" className="d-flex justify-content-end align-items-center"><LessonControlButtons /></Col>
							</Row>
						</ListGroup.Item>
						<ListGroup.Item className="wd-lesson p-3 ps-1">
							<Row className="align-items-center text-nowrap gx-3">
								<Col xs="auto" className="d-flex align-items-center"><BsGripVertical className="me-2 fs-3" /><GrDocumentText className="fs-3 text-success" /></Col>
								<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
									<Link to="/Kambaz/Courses/1234/Assignments/123"
										className="fw-semibold text-truncate d-block text-dark text-decoration-none">
										E2
									</Link>
									<p className="mb-0 text-truncate small"><span className="text-danger">Module 4-6</span> | Date: May 25 at 2:00pm | 100pts</p>
								</Col>
								<Col xs="auto" className="d-flex justify-content-end align-items-center"><LessonControlButtons /></Col>
							</Row>
						</ListGroup.Item>
					</ListGroup>
				</ListGroup.Item>
			</div>
		</Container>
	);
}
