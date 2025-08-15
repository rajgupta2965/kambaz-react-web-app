import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import LessonControlButtons from "../LessonControlButtons";
import AssignmentControls from "./AssignmentsControls";
// import Exams from "./Exams";
// import Projects from "./Projects";
// import Quizzes from "./Quizzes";
import { IoMdArrowDropdown } from "react-icons/io";
import AssignmentControlButtons from "./AssignmentControlButtons";
import { GrDocumentText } from "react-icons/gr";
import { Link } from "react-router";


export default function Assignments() {
	return (
		<Container className="m-2">
			<div id="wd-assignments">
				<AssignmentControls /><br /><br />

				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" /> <IoMdArrowDropdown className="me-2 fs-3" />
						ASSIGNMENTS
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>40% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						<ListGroup.Item className="wd-lesson p-3 ps-1">
							<Row className="align-items-center text-nowrap gx-3">
								<Col xs="auto" className="d-flex align-items-center"><BsGripVertical className="me-2 fs-3" /><GrDocumentText className="fs-3 text-success" /></Col>
								<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
									<Link to="/Kambaz/Courses/1234/Assignments/123"
										className="fw-semibold text-truncate d-block text-dark text-decoration-none">
										A1
									</Link>
									<p className="mb-0 text-truncate small">
										<span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 6 at 12:00am | <br />
										<b> Due</b> May 13 at 11:59pm | 100 pts</p>
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
										A2
									</Link>
									<p className="mb-0 text-truncate small">
										<span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 13 at 12:00am | <br />
										<b> Due</b> May 20 at 11:59pm | 100 pts</p>
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
										A3
									</Link>
									<p className="mb-0 text-truncate small">
										<span className="text-danger">Multiple Modules</span> | <b>Not available until</b> May 20 at 12:00am | <br />
										<b> Due</b> May 27 at 11:59pm | 100 pts</p>
								</Col>
								<Col xs="auto" className="d-flex justify-content-end align-items-center"><LessonControlButtons /></Col>
							</Row>
						</ListGroup.Item>
					</ListGroup>
				</ListGroup.Item>

				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" /> <IoMdArrowDropdown className="me-2 fs-3" />
						QUIZZES
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>10% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						<ListGroup.Item className="wd-lesson p-3 ps-1">
							<Row className="align-items-center text-nowrap gx-3">
								<Col xs="auto" className="d-flex align-items-center"><BsGripVertical className="me-2 fs-3" /><GrDocumentText className="fs-3 text-success" /></Col>
								<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
									<Link to="/Kambaz/Courses/1234/Assignments/123"
										className="fw-semibold text-truncate d-block text-dark text-decoration-none">
										Q1
									</Link>
									<p className="mb-0 text-truncate small">
										Lectures from <span className="text-danger">Module 1</span> | <b>Not available until</b> May 2 at 12:00am | <br />
										<b> Due</b> May 3 at 11:59pm | 100 pts</p>
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
										Q2
									</Link>
									<p className="mb-0 text-truncate small">
										Lectures from <span className="text-danger">Module 2</span> | <b>Not available until</b> May 7 at 12:00am | <br />
										<b> Due</b> May 8 at 11:59pm | 100 pts</p>
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
										Q3
									</Link>
									<p className="mb-0 text-truncate small">
										Lectures from <span className="text-danger">Module 3</span> | <b>Not available until</b> May 11 at 12:00am | <br />
										<b> Due</b> May 12 at 11:59pm | 100 pts</p>
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
										Q4
									</Link>
									<p className="mb-0 text-truncate small">
										Lectures from <span className="text-danger">Module 4</span> | <b>Not available until</b> May 17 at 12:00am | <br />
										<b> Due</b> May 18 at 11:59pm | 100 pts</p>
								</Col>
								<Col xs="auto" className="d-flex justify-content-end align-items-center"><LessonControlButtons /></Col>
							</Row>
						</ListGroup.Item>
					</ListGroup>
				</ListGroup.Item>

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

				<ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
					<div className="wd-title p-3 ps-2 bg-secondary">
						<BsGripVertical className="fs-3" /> <IoMdArrowDropdown className="me-2 fs-3" />
						PROJECTS
						<AssignmentControlButtons />
						<Button variant="secondary" size="sm" className="me-2 float-end" active>30% of Total</Button>
					</div>
					<ListGroup className="wd-lessons rounded-0">
						<ListGroup.Item className="wd-lesson p-3 ps-1">
							<Row className="align-items-center text-nowrap gx-3">
								<Col xs="auto" className="d-flex align-items-center"><BsGripVertical className="me-2 fs-3" /><GrDocumentText className="fs-3 text-success" /></Col>
								<Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
									<Link to="/Kambaz/Courses/1234/Assignments/123"
										className="fw-semibold text-truncate d-block text-dark text-decoration-none">
										P1
									</Link>
									<p className="mb-0 text-truncate small"> Make <span className="text-danger">Portfolio Website</span> | Date: May 16 at 2:00pm | 100pts <br />
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
										P2
									</Link>
									<p className="mb-0 text-truncate small">Make <span className="text-danger">Kambaz Website</span> | Date: May 30 at 2:00pm | 100pts <br />
									</p>
								</Col>
								<Col xs="auto" className="d-flex justify-content-end align-items-center"><LessonControlButtons /></Col>
							</Row>
						</ListGroup.Item>
					</ListGroup>
				</ListGroup.Item>

				{/* Can be implemented by making sep files
      <div><Quizzes /></div>
        <div><Exams /></div>
        <div><Projects /></div> */}

			</div >
		</Container>
	);
}
