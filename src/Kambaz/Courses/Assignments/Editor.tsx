import { Form, Row, Col, Card, Button, FormControl, FormSelect, Container } from "react-bootstrap";

export default function AssignmentEditor() {
	return (
		<Container className="m-2">
			<Form action="#/Kambaz/Courses/1234/Assignments" id="wd-assignments-editor">
				<Form.Group className="mb-3">
					<Form.Label className="h5 mb-2">Assignment Name</Form.Label>
					<FormControl defaultValue="A1" size="lg" />
				</Form.Group>
				<Card className="mb-4 border-secondary-subtle">
					<Card.Body className="pt-3">
						<p className="mb-2">
							The assignment is <span className="text-danger">available online</span>
						</p>
						<p className="mb-2">
							Submit a link to the landing page of your Web application running on
							Netlify.
						</p>
						<p className="mb-2">The landing page should include the following:</p>
						<ul className="mb-0">
							<li>Your full name and section</li>
							<li>Links to each of the lab assignments</li>
							<li>Link to the Kambaz application</li>
							<li>Links to all relevant source code repositories</li>
						</ul>
						<p className="mt-3 mb-0">
							The Kambaz application should include a link to navigate back to the
							landing page.
						</p>
					</Card.Body>
				</Card>

				<Row className="g-3 mb-4">
					<Col md={4}>
						<Form.Label>Points</Form.Label>
						<FormControl defaultValue={100} />
					</Col>
					<Col md={4}>
						<Form.Label>Assignment Group</Form.Label>
						<FormSelect defaultValue="ASSIGNMENTS">
							<option value="ASSIGNMENTS">Assignments</option>
							<option value="QUIZZES">Quizzes</option>
							<option value="EXAMS">Exams</option>
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
											defaultValue="2024-05-13T23:59"
										/>
									</Col>
									<Col sm={6}>
										<Form.Label>Available from</Form.Label>
										<FormControl
											type="datetime-local"
											defaultValue="2024-05-06T00:00"
										/>
									</Col>
									<Col sm={6}>
										<Form.Label>Until</Form.Label>
										<FormControl
											type="datetime-local"
											defaultValue="2024-05-20T00:00"
										/>
									</Col>
								</Row>
							</Card.Body>
						</Card>
					</Col>

				</Row>

				<div className="d-flex justify-content-end gap-2">
					<Button variant="secondary" type="button">
						Cancel
					</Button>
					<Button variant="danger" type="submit">
						Save
					</Button>
				</div>
			</Form>
		</Container>
	);
}
