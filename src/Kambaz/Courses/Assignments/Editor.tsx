import { Form, Row, Col, Card, Button, FormControl, FormSelect, Container } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { assignments } from "../../Database";

export default function AssignmentEditor() {
	const { courseId, cid, assignmentId, aid } = useParams();
	const currentCourseId = courseId ?? cid ?? "";
	const currentAssignmentId = assignmentId ?? aid ?? "";

	const item = assignments.find(
		(a) => a.course === currentCourseId && a._id === currentAssignmentId
	);

	return (
		<Container className="m-2">
			<Form>
				<Form.Group className="mb-3">
					<Form.Label className="h5 mb-2">Assignment Name</Form.Label>
					<FormControl defaultValue={item?.title ?? "Assignment"} size="lg" />
				</Form.Group>

				<Card className="mb-4 border-secondary-subtle">
					<Card.Body className="pt-3">
						<p className="mb-2">
							This <b>{item?.type}</b> (<b>{item?.title}</b>) for course <b>{item?.course} </b>
							is worth <b>{item?.points} points</b>.
						</p>
						<p className="mb-2">
							It will be available from <b>{item?.startDate} </b>
							until <b> {item?.endDate}</b>.
						</p>
						<p className="mb-2">
							Submit a link to the landing page of your Web application running on Netlify: <br />
							<a>https://rajgupta-webdev2025.netlify.app/</a>
						</p>
					
						<ul className="mb-0">
							<li>Name: Raj Gupta</li>
							<li>Course: CS5610 Web Development</li>
							<li>Section: 01 | CRN: 60924 | Online</li>
						</ul>
					</Card.Body>
				</Card>

				<Row className="g-3 mb-4">
					<Col md={4}>
						<Form.Label>Points</Form.Label>
						<FormControl defaultValue={item?.points ?? "Assignment"} />
					</Col>
					<Col md={4}>
						<Form.Label>Assignment Group</Form.Label>
						<FormSelect defaultValue={item?.type ?? "assignment"}>
							<option value="assignment">Assignments</option>
							<option value="quiz">Quizzes</option>
							<option value="exam">Exams</option>
							<option value="project">Projects</option>
						</FormSelect>
					</Col>
					<Col md={4}>
						<Form.Label>Display Grade as</Form.Label>
						<FormSelect defaultValue="Percentage">
							<option value="Percentage">Percentage</option>
							<option value="Grade">Grade</option>
						</FormSelect>
					</Col>
				</Row>

				<Row className="g-4 mb-4">
					<Col md={6}>
						<Form.Label>Submission Type</Form.Label>
						<FormSelect defaultValue="Online">
							<option value="Online">Online</option>
							<option value="Offline">Offline</option>
						</FormSelect>
						<div className="mt-3">
							<div className="fw-semibold small mb-2">Online Entry Options</div>
							<Form.Check id="wd-text-entry" label="Text Entry" />
							<Form.Check id="wd-website-url" label="Website URL" defaultChecked />
							<Form.Check id="wd-media-recordings" label="Media Recordings" />
							<Form.Check id="wd-student-annotation" label="Student Annotation" />
							<Form.Check id="wd-file-upload" label="File Uploads" />
						</div>
					</Col>

					<Col md={6}>
						<Form.Label>Assign</Form.Label>
						<Card className="border-secondary-subtle">
							<Card.Body>
								<Form.Label>Assign to</Form.Label>
								<FormControl defaultValue="Everyone" className="mb-3" />
								<Row className="g-3">
									<Col xs={12}>
										<Form.Label>Due</Form.Label>
										<FormControl
											type="datetime-local"
											defaultValue={item?.endDate ?? ""}
										/>
									</Col>
									<Col sm={6}>
										<Form.Label>Available from</Form.Label>
										<FormControl
											type="datetime-local"
											defaultValue={item?.startDate ?? ""}
										/>
									</Col>
									<Col sm={6}>
										<Form.Label>Until</Form.Label>
										<FormControl
											type="datetime-local"
											defaultValue={item?.endDate ?? ""}
										/>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>
				</Row>

				<div className="d-flex justify-content-end gap-2">
					<Link to={`/Kambaz/Courses/${currentCourseId}/Assignments`}>
						<Button variant="secondary" type="button">
							Cancel
						</Button>
					</Link>
					<Link to={`/Kambaz/Courses/${currentCourseId}/Assignments`}>
						<Button variant="danger" type="button">
							Save
						</Button>
					</Link>
				</div>
			</Form>
		</Container>
	);
}
