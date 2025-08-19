import { Form, Row, Col, Card, Button, FormControl, FormSelect, Container } from "react-bootstrap";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import useIsFaculty from "../../auth/useIsFaculty";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateAssignment, addAssignment } from "./reducer";

export default function AssignmentEditor() {
  const { courseId, cid, assignmentId, aid } = useParams();
  const currentCourseId = courseId ?? cid ?? "";
  const currentAssignmentId = assignmentId ?? aid ?? "";
  const navigate = useNavigate();
  const location = useLocation();
  const isFaculty = useIsFaculty();
  const dispatch = useDispatch();
  const { assignments } = useSelector((s: any) => s.assignmentsReducer);
  const item = assignments.find(
    (a: any) => a.course === currentCourseId && a._id === currentAssignmentId
  );
  const incomingType =
    ((location.state as any)?.assignType ??
      new URLSearchParams(location.search).get("type") ??
      "") as string;

  const clamp100 = (n: number) => Math.max(0, Math.min(100, n));
  const cap = (s?: string) =>
    (s ?? "Assignment").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
  const [title, setTitle] = useState<string>(item?.title ?? "Assignment");
  const [desc, setDesc] = useState<string>(item?.desc ?? "");
  const [points, setPoints] = useState<number>(
    typeof item?.points === "number" ? item.points : 100
  );

  const [grade, setGrade] = useState<string>(item?.grade ?? "Percentage");
  const [submissionType, setSubmissionType] = useState<string>(item?.submissionType ?? "Online");
  const [assignTo, setAssignTo] = useState<string>(item?.assignTo ?? "Everyone");
  const [startDate, setStartDate] = useState<string>(item?.startDate ?? "");
  const [dueDate, setDueDate] = useState<string>(item?.endDate ?? "");
  const [untilDate, setUntilDate] = useState<string>(item?.endDate ?? "");
  const [assignType, setAssignType] = useState<string>(
    item?.assignType ?? cap(incomingType || "Assignment")
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFaculty) return;
    const endDate = (dueDate && dueDate.trim()) ? dueDate : (untilDate?.trim() || "");
    const assignTypeFinal = cap(assignType);
    const base = {
      course: currentCourseId,
      title,
      desc,
      points: clamp100(Number(points) || 0),
      assignType: assignTypeFinal,
      grade,
      submissionType,
      assignTo,
      startDate,
      endDate,
    };
    const isNew = !item || currentAssignmentId === "" || currentAssignmentId === "new";
    if (isNew) {
      dispatch(addAssignment(base));
    } else {
      dispatch(updateAssignment({ _id: currentAssignmentId, ...base }));
    }
    navigate(`/Kambaz/Courses/${currentCourseId}/Assignments`);
  };

  const handleSaveClick = () => {
    const fakeEvt = { preventDefault() { } } as React.FormEvent<HTMLFormElement>;
    handleSubmit(fakeEvt);
  };

  return (
    <Container className="m-2">
      <Form onSubmit={handleSubmit}>
        <fieldset disabled={!isFaculty}>
          <Form.Group className="mb-3">
            <Form.Label className="h5 mb-2">Assignment Name</Form.Label>
            <FormControl
              defaultValue={item?.title ?? "Assignment"}
              size="lg"
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              defaultValue={item?.desc ?? ""}
              onChange={(e) => setDesc(e.currentTarget.value)}
            />
          </Form.Group>

          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Label>Points</Form.Label>
              <FormControl
                type="number"
                min={0}
                max={100}
                defaultValue={typeof item?.points === "number" ? item.points : 100}
                onChange={(e) => setPoints(clamp100(Number(e.currentTarget.value) || 0))}
              />
            </Col>
            <Col md={4}>
              <Form.Label>Assignment Group</Form.Label>
              <FormSelect
                value={assignType.toLowerCase()}
                onChange={(e) => setAssignType(cap(e.currentTarget.value))}
              >
                <option value="assignment">Assignments</option>
                <option value="quiz">Quizzes</option>
                <option value="exam">Exams</option>
                <option value="project">Projects</option>
              </FormSelect>
            </Col>
            <Col md={4}>
              <Form.Label>Display Grade as</Form.Label>
              <FormSelect
                defaultValue={item?.grade ?? "Percentage"}
                onChange={(e) => setGrade(e.currentTarget.value)}
              >
                <option value="Percentage">Percentage</option>
                <option value="Grade">Grade</option>
              </FormSelect>
            </Col>
          </Row>

          <Row className="g-4 mb-4">
            <Col md={6}>
              <Form.Label>Submission Type</Form.Label>
              <FormSelect
                defaultValue={item?.submissionType ?? "Online"}
                onChange={(e) => setSubmissionType(e.currentTarget.value)}
              >
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
                  <FormControl
                    defaultValue={item?.assignTo ?? "Everyone"}
                    className="mb-3"
                    onChange={(e) => setAssignTo(e.currentTarget.value)}
                  />
                  <Row className="g-3">
                    <Col xs={12}>
                      <Form.Label>Due</Form.Label>
                      <FormControl
                        type="datetime-local"
                        defaultValue={item?.endDate ?? ""}
                        onChange={(e) => setDueDate(e.currentTarget.value)}
                      />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Available from</Form.Label>
                      <FormControl
                        type="datetime-local"
                        defaultValue={item?.startDate ?? ""}
                        onChange={(e) => setStartDate(e.currentTarget.value)}
                      />
                    </Col>
                    <Col sm={6}>
                      <Form.Label>Until</Form.Label>
                      <FormControl
                        type="datetime-local"
                        defaultValue={item?.endDate ?? ""}
                        onChange={(e) => setUntilDate(e.currentTarget.value)}
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {isFaculty && (
            <div className="d-flex justify-content-end gap-2">
              <Link to={`/Kambaz/Courses/${currentCourseId}/Assignments`}>
                <Button variant="secondary" type="button">
                  Cancel
                </Button>
              </Link>
              <Link to={`/Kambaz/Courses/${currentCourseId}/Assignments`}>
                <Button variant="danger" type="submit" onClick={handleSaveClick}>
                  Save
                </Button>
              </Link>
            </div>
          )}
        </fieldset>
      </Form>
    </Container>
  );
}
