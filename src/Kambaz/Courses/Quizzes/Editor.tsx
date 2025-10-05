import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectQuizzesForCourse } from "./reducer";
import { Container, Form, Row, Col, Card, Button, FormControl, FormSelect, ListGroup, ButtonGroup, Tabs, Tab, Dropdown, Modal, InputGroup } from "react-bootstrap";
import useIsFaculty from "../../auth/useIsFaculty";
import { useQuizActions } from "./useQuizActions";

const tmpId = () => `tmp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

type MCOption = { id?: string; text: string };
type MCQ = { type: "MC"; id: string; questionText: string; points: number; options: MCOption[]; correct?: string };
type TFQ = { type: "TF"; id: string; questionText: string; points: number; answer: boolean };
type FIBQ = { type: "FIB"; id: string; questionText: string; points: number; acceptableAnswers: string[] };
type LocalBank = { mc: MCQ[]; tf: TFQ[]; fib: FIBQ[] };

const toLocalBank = (bank: any | undefined): LocalBank => {
  const out: LocalBank = { mc: [], tf: [], fib: [] };
  if (!bank) return out;
  for (const q of bank.mc ?? []) {
    out.mc.push({
      type: "MC",
      id: q.id || tmpId(),
      questionText: q.questionText ?? "",
      points: typeof q.points === "number" ? q.points : 1,
      options: (q.options ?? []).map((op: any) => ({ id: op.id || tmpId(), text: op.text ?? "" })),
      correct: q.correct,
    });
  }
  for (const q of bank.tf ?? []) {
    out.tf.push({
      type: "TF",
      id: q.id || tmpId(),
      questionText: q.questionText ?? "",
      points: typeof q.points === "number" ? q.points : 1,
      answer: !!q.answer,
    });
  }
  for (const q of bank.fib ?? []) {
    out.fib.push({
      type: "FIB",
      id: q.id || tmpId(),
      questionText: q.questionText ?? "",
      points: typeof q.points === "number" ? q.points : 1,
      acceptableAnswers: Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers : [],
    });
  }
  return out;
};

const toApiBank = (bank: LocalBank) => ({
  mc: bank.mc.map(q => ({
    type: "MC",
    id: q.id,
    questionText: q.questionText,
    points: q.points,
    options: q.options.map(o => ({ id: o.id, text: o.text })),
    correct: q.correct,
  })),
  tf: bank.tf.map(q => ({
    type: "TF",
    id: q.id,
    questionText: q.questionText,
    points: q.points,
    answer: q.answer,
  })),
  fib: bank.fib.map(q => ({
    type: "FIB",
    id: q.id,
    questionText: q.questionText,
    points: q.points,
    acceptableAnswers: q.acceptableAnswers,
  })),
});

export default function QuizEditor() {
  const { courseId, cid, quizId, qid } = useParams();
  const currentCourseId = courseId ?? cid ?? "";
  const currentQuizId = quizId ?? qid ?? "";
  const navigate = useNavigate();
  const isFaculty = useIsFaculty();
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
  const { load, saveQuiz, loadQuestionBank } = useQuizActions();
  const quizzes = useSelector((s: any) => selectQuizzesForCourse(s, currentCourseId));
  const item = useMemo(() => quizzes.find((a: any) => a?._id === currentQuizId), [quizzes, currentQuizId]);

  useEffect(() => {
    if (!item && currentCourseId) {
      load().catch(() => { });
    }
  }, [item, currentCourseId, load]);

  const [title, setTitle] = useState<string>(item?.title ?? "New Quiz");
  const [desc, setDesc] = useState<string>(item?.desc ?? "");
  const [submissionType, setSubmissionType] = useState<string>(item?.submissionType ?? "Online");
  const [gradeType, setGradeType] = useState<string>(item?.gradeType ?? "Grade");
  const [assignType, setAssignType] = useState<string>(item?.assignType ?? "Quizzes");
  const [quizType, setQuizType] = useState<"Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey">(item?.quizType ?? "Graded Quiz");
  const [points, setPoints] = useState<number>(typeof item?.points === "number" ? item!.points : 100);
  const [questions, setQuestions] = useState<number>(typeof item?.questions === "number" ? item!.questions : 0);
  const [timeLimit, setTimeLimit] = useState<number>(typeof item?.timeLimit === "number" ? item!.timeLimit : 20);
  const [showOneQuestion, setShowOneQuestion] = useState<boolean>(item?.showOneQuestion ?? true);
  const [showAnswers, setShowAnswers] = useState<boolean>(item?.showAnswers ?? false);
  const [showAnswersWhen, setShowAnswersWhen] = useState<"afterEach" | "atEnd">(item?.showAnswersWhen ?? "atEnd");
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(item?.shuffleQuestions ?? false);
  const [shuffleAnswers, setShuffleAnswers] = useState<boolean>(item?.shuffleAnswers ?? true);
  const [lockQuestionsAfterAnswering, setLockQuestionsAfterAnswering] = useState<boolean>(item?.lockQuestionsAfterAnswering ?? false);
  const [multipleAttempts, setMultipleAttempts] = useState<boolean>(item?.multipleAttempts ?? false);
  const [noOfAttempts, setNoOfAttempts] = useState<number>(typeof item?.noOfAttempts === "number" ? item!.noOfAttempts : 1);
  const [webcamRequired, setWebcamRequired] = useState<boolean>(item?.webcamRequired ?? false);
  const [accessCode, setAccessCode] = useState<string>(item?.accessCode ?? "");
  const [assignTo, setAssignTo] = useState<string>(item?.assignTo ?? "Everyone");
  const [startDate, setStartDate] = useState<string>(item?.startDate ?? "");
  const [dueDate, setDueDate] = useState<string>(item?.dueDate ?? "");
  const [endDate, setEndDate] = useState<string>(item?.endDate ?? "");
  const seededMetaRef = useRef(false);

  useEffect(() => {
    if (!item || seededMetaRef.current) return;
    seededMetaRef.current = true;
    setTitle(item.title ?? "New Quiz");
    setDesc(item.desc ?? "");
    setSubmissionType(item.submissionType ?? "Online");
    setGradeType(item.gradeType ?? "Grade");
    setAssignType(item.assignType ?? "Quizzes");
    setQuizType((item.quizType as any) ?? "Graded Quiz");
    setPoints(typeof item.points === "number" ? item.points : 100);
    setQuestions(typeof item.questions === "number" ? item.questions : 0);
    setTimeLimit(typeof item.timeLimit === "number" ? item.timeLimit : 20);
    setShowOneQuestion(item.showOneQuestion ?? true);
    setShowAnswers(item.showAnswers ?? false);
    setShowAnswersWhen((item.showAnswersWhen as any) ?? "atEnd");
    setShuffleQuestions(item.shuffleQuestions ?? false);
    setShuffleAnswers(item.shuffleAnswers ?? true);
    setLockQuestionsAfterAnswering(item.lockQuestionsAfterAnswering ?? false);
    setMultipleAttempts(item.multipleAttempts ?? false);
    setNoOfAttempts(typeof item.noOfAttempts === "number" ? item.noOfAttempts : 1);
    setWebcamRequired(item.webcamRequired ?? false);
    setAccessCode(item.accessCode ?? "");
    setAssignTo(item.assignTo ?? "Everyone");
    setStartDate(item.startDate ?? "");
    setDueDate(item.dueDate ?? "");
    setEndDate(item.endDate ?? "");
  }, [item]);

  const [bank, setBank] = useState<LocalBank>({ mc: [], tf: [], fib: [] });
  const totals = useMemo(() => {
    const qCount = bank.mc.length + bank.tf.length + bank.fib.length;
    const sum = (arr: any[]) =>
      arr.reduce((s, q) => s + (typeof q.points === "number" ? q.points : 0), 0);
    const pSum = sum(bank.mc) + sum(bank.tf) + sum(bank.fib);
    return { questions: qCount, points: pSum };
  }, [bank]);
  const seededBankRef = useRef(false);

  useEffect(() => {
    if (!currentQuizId || seededBankRef.current) return;
    (async () => {
      const b = await loadQuestionBank(currentQuizId);
      setBank(toLocalBank(b));
      seededBankRef.current = true;
    })();
  }, [currentQuizId, loadQuestionBank]);

  useEffect(() => {
    setQuestions?.(totals.questions);
    setPoints?.(totals.points);
  }, [totals.questions, totals.points]);

  useEffect(() => {
    if (!multipleAttempts) setNoOfAttempts(1);
  }, [multipleAttempts]);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<{ type: "MC" | "TF" | "FIB"; index: number } | null>(null);
  const [questionType, setQuestionType] = useState<"MC" | "TF" | "FIB">("MC");
  const [qText, setQText] = useState("");
  const [qPoints, setQPoints] = useState(1);
  const [mcOptions, setMcOptions] = useState<MCOption[]>([{ id: tmpId(), text: "" }, { id: tmpId(), text: "" }]);
  const [mcCorrectId, setMcCorrectId] = useState<string | undefined>(undefined);
  const [tfAnswer, setTfAnswer] = useState<boolean>(true);
  const [fibAnswers, setFibAnswers] = useState<string[]>([""]);

  const resetModal = () => {
    setEditing(null);
    setQText("");
    setQPoints(1);
    setMcOptions([{ id: tmpId(), text: "" }, { id: tmpId(), text: "" }]);
    setMcCorrectId(undefined);
    setTfAnswer(true);
    setFibAnswers([""]);
  };

  const openNewQuestion = () => {
    resetModal();
    setShowModal(true);
  };

  const openEditQuestion = (type: "MC" | "TF" | "FIB", index: number) => {
    setEditing({ type, index });
    const q = type === "MC" ? bank.mc[index]
      : type === "TF" ? bank.tf[index]
        : bank.fib[index];
    setQText(q.questionText);
    setQPoints(q.points);
    if (type === "MC") {
      const mq = q as MCQ;
      setQuestionType("MC");
      setMcOptions((mq.options ?? []).map(o => ({ id: o.id || tmpId(), text: o.text })));
      setMcCorrectId(mq.correct);
    } else if (type === "TF") {
      setQuestionType("TF");
      setTfAnswer((q as TFQ).answer);
    } else {
      setQuestionType("FIB");
      setFibAnswers([...(q as FIBQ).acceptableAnswers]);
    }
    setShowModal(true);
  };

  const deleteQuestion = (type: "MC" | "TF" | "FIB", index: number) => {
    setBank(prev => {
      const next: LocalBank = { mc: [...prev.mc], tf: [...prev.tf], fib: [...prev.fib] };
      if (type === "MC") next.mc.splice(index, 1);
      else if (type === "TF") next.tf.splice(index, 1);
      else next.fib.splice(index, 1);
      return next;
    });
  };

  const saveQuestionFromModal = () => {
    if (!qText.trim()) return;
    setBank(prev => {
      const next: LocalBank = { mc: [...prev.mc], tf: [...prev.tf], fib: [...prev.fib] };
      if (questionType === "MC") {
        const payload: MCQ = {
          type: "MC",
          id: editing ? (next.mc[editing.index]?.id ?? tmpId()) : tmpId(),
          questionText: qText.trim(),
          points: qPoints || 1,
          options: mcOptions.map(o => ({ id: o.id || tmpId(), text: o.text })),
          correct: mcCorrectId && mcOptions.some(o => o.id === mcCorrectId) ? mcCorrectId : undefined,
        };
        if (editing && editing.type === "MC") next.mc[editing.index] = payload;
        else next.mc.push(payload);
      } else if (questionType === "TF") {
        const payload: TFQ = {
          type: "TF",
          id: editing ? (next.tf[editing.index]?.id ?? tmpId()) : tmpId(),
          questionText: qText.trim(),
          points: qPoints || 1,
          answer: !!tfAnswer,
        };
        if (editing && editing.type === "TF") next.tf[editing.index] = payload;
        else next.tf.push(payload);
      } else {
        const payload: FIBQ = {
          type: "FIB",
          id: editing ? (next.fib[editing.index]?.id ?? tmpId()) : tmpId(),
          questionText: qText.trim(),
          points: qPoints || 1,
          acceptableAnswers: fibAnswers.map(a => a.trim()).filter(Boolean),
        };
        if (editing && editing.type === "FIB") next.fib[editing.index] = payload;
        else next.fib.push(payload);
      }
      return next;
    });
    setShowModal(false);
    setEditing(null);
  };

  const buildSnapshot = () => ({
    meta: {
      title, desc, submissionType, gradeType, assignType, quizType, timeLimit,
      showOneQuestion, showAnswers, showAnswersWhen, shuffleQuestions, shuffleAnswers,
      lockQuestionsAfterAnswering, multipleAttempts, noOfAttempts,
      webcamRequired, accessCode, assignTo, startDate, dueDate, endDate,
    },
    bank,
  });
  const initialSnapshotRef = useRef<string | null>(null);
  const metaHydratedRef = useRef(false);

  useEffect(() => {
    if ((seededMetaRef.current || !!item) && !metaHydratedRef.current) {
      setTimeout(() => { metaHydratedRef.current = true; }, 0);
    }
    const metaReady = metaHydratedRef.current;
    const bankReady = seededBankRef.current;
    if (metaReady && bankReady && initialSnapshotRef.current === null) {
      initialSnapshotRef.current = JSON.stringify(buildSnapshot());
    }
  }, [item, bank]);

  const isDirty = useMemo(() => {
    if (!initialSnapshotRef.current) return false;
    return JSON.stringify(buildSnapshot()) !== initialSnapshotRef.current;
  }, [
    title, desc, submissionType, gradeType, assignType, quizType,
    timeLimit, showOneQuestion, showAnswers, showAnswersWhen, shuffleQuestions, shuffleAnswers, lockQuestionsAfterAnswering,
    multipleAttempts, noOfAttempts, webcamRequired, accessCode, assignTo, startDate, dueDate, endDate,
    bank
  ]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const [showUnsaved, setShowUnsaved] = useState(false);

  const onCancel = async () => {
    if (isDirty) {
      setShowUnsaved(true);
      return;
    }
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${currentQuizId}/Details`);
  };

  const onSave = async () => {
    if (!isFaculty) return;
    await saveQuiz({
      _id: item?._id,
      course: currentCourseId,
      title, desc, submissionType, gradeType, assignType, quizType,
      points, questions, timeLimit,
      showOneQuestion, showAnswers, showAnswersWhen, shuffleQuestions, shuffleAnswers,
      lockQuestionsAfterAnswering, multipleAttempts, noOfAttempts,
      webcamRequired, accessCode,
      assignTo, startDate, dueDate, endDate,
      questionBank: toApiBank(bank),
    } as any);
    initialSnapshotRef.current = JSON.stringify(buildSnapshot());
  };

  const confirmDiscard = () => {
    setShowUnsaved(false);
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${currentQuizId}/Details`);
  };

  const confirmSaveAndExit = async () => {
    await onSave();
    setShowUnsaved(false);
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${currentQuizId}/Details`);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await onSave();
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${currentQuizId}/Details`);
  };

  return (
    <Container className="m-2">
      <Card className="rounded-3 shadow border-1">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">{title}</h3>
            <ButtonGroup>
              <Button variant="outline-secondary" onClick={onCancel}>Preview</Button>
              <Button variant="secondary" active>Edit</Button>
            </ButtonGroup>
          </div>

          <Form onSubmit={onSubmit}>
            <fieldset disabled={!isFaculty}>
              <Tabs
                id="quiz-editor-tabs"
                className="mb-3"
                activeKey={activeTab}
                onSelect={(k) => { if (k) setActiveTab(k as "details" | "questions"); }}
              >
                <Tab eventKey="details" title="Details">
                  <Row className="mb-3 g-3">
                    <Col>
                      <Form.Label className="h5">Quiz Title</Form.Label>
                      <FormControl
                        value={title}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.currentTarget.value)}
                        size="lg"
                      />
                    </Col>
                  </Row>

                  <div className="mb-2">Instructions:</div>
                  <Card className="mb-4">
                    <Card.Body>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={desc}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDesc(e.currentTarget.value)}
                        placeholder="Describe this quiz…"
                      />
                    </Card.Body>
                  </Card>

                  <Row className="mb-4 g-3">
                    <Col md={4}>
                      <Card><Card.Body className="py-2">
                        <div>Submission Type</div>
                        <FormSelect value={submissionType} onChange={(e) => setSubmissionType(e.currentTarget.value)}>
                          <option value="Online">Online</option>
                          <option value="Offline">Offline</option>
                        </FormSelect>
                      </Card.Body></Card>
                    </Col>
                    <Col md={4}>
                      <Card><Card.Body className="py-2">
                        <div>Display Grade as</div>
                        <FormSelect value={gradeType} onChange={(e) => setGradeType(e.currentTarget.value)}>
                          <option value="Grade">Grade</option>
                          <option value="Percentage">Percentage</option>
                        </FormSelect>
                      </Card.Body></Card>
                    </Col>
                    <Col md={4}>
                      <Card><Card.Body className="py-2">
                        <div>Assignment Group</div>
                        <FormSelect value={assignType} onChange={(e) => setAssignType(e.currentTarget.value)}>
                          <option value="Assignments">Assignments</option>
                          <option value="Quizzes">Quizzes</option>
                          <option value="Exams">Exams</option>
                          <option value="Project">Project</option>
                        </FormSelect>
                      </Card.Body></Card>
                    </Col>
                    <Col md={4}>
                      <Card><Card.Body className="py-2">
                        <div>Quiz Type</div>
                        <FormSelect value={quizType} onChange={(e) => setQuizType(e.currentTarget.value as any)}>
                          <option value="Graded Quiz">Graded Quiz</option>
                          <option value="Practice Quiz">Practice Quiz</option>
                          <option value="Graded Survey">Graded Survey</option>
                          <option value="Ungraded Survey">Ungraded Survey</option>
                        </FormSelect>
                      </Card.Body></Card>
                    </Col>
                  </Row>

                  <Row className="mb-4 g-3">
                    <Col md={4}>
                      <Card>
                        <Card.Body className="text-center py-3">
                          <div>Points</div>
                          <FormControl
                            type="number"
                            className="text-center fs-4"
                            min={0}
                            value={totals.points}
                            readOnly
                            disabled
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card>
                        <Card.Body className="text-center py-3">
                          <div>Questions</div>
                          <FormControl
                            type="number"
                            className="text-center fs-4"
                            min={0}
                            value={totals.questions}
                            readOnly
                            disabled
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card>
                        <Card.Body className="text-center py-3">
                          <div>Time Limit</div>
                          <FormControl
                            type="number"
                            className="text-center fs-4"
                            min={0}
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.currentTarget.value) || 0)}
                          />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Row className="mb-4 g-3">
                    <Col md={4}>
                      <Card>
                        <ListGroup>
                          <ListGroup.Item className="border-0 border-bottom">
                            <Form.Check
                              type="switch"
                              id="one-q"
                              label="One question at a time"
                              checked={showOneQuestion}
                              onChange={(e) => setShowOneQuestion(e.currentTarget.checked)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <Form.Check
                              type="switch"
                              id="show-answers"
                              label="Show correct answers"
                              checked={showAnswers}
                              onChange={(e) => setShowAnswers(e.currentTarget.checked)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <div className="mb-1">When to show answers</div>
                            <FormSelect
                              value={showAnswersWhen}
                              onChange={(e) => setShowAnswersWhen(e.currentTarget.value as "afterEach" | "atEnd")}
                            >
                              <option value="afterEach">After each question</option>
                              <option value="atEnd">In the end</option>
                            </FormSelect>
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <Form.Check
                              type="switch"
                              id="shuffle-questions"
                              label="Shuffle Questions"
                              checked={shuffleQuestions}
                              onChange={(e) => setShuffleQuestions(e.currentTarget.checked)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <Form.Check
                              type="switch"
                              id="shuffle"
                              label="Shuffle Answers"
                              checked={shuffleAnswers}
                              onChange={(e) => setShuffleAnswers(e.currentTarget.checked)}
                            />
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card>
                        <ListGroup>
                          <ListGroup.Item className="border-0">
                            <Form.Check
                              type="switch"
                              id="lock-after"
                              label="Lock questions after answering"
                              checked={lockQuestionsAfterAnswering}
                              onChange={(e) => setLockQuestionsAfterAnswering(e.currentTarget.checked)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <Form.Check
                              type="switch"
                              id="multi-attempts"
                              label="Multiple attempts"
                              checked={multipleAttempts}
                              onChange={(e) => setMultipleAttempts(e.currentTarget.checked)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <div className="mb-1">No. of attempts</div>
                            <FormControl
                              type="number"
                              min={1}
                              value={noOfAttempts}
                              onChange={(e) => setNoOfAttempts(Number(e.currentTarget.value) || 1)}
                              disabled={!multipleAttempts}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <Form.Check
                              type="switch"
                              id="webcam"
                              label="Webcam required"
                              checked={webcamRequired}
                              onChange={(e) => setWebcamRequired(e.currentTarget.checked)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0">
                            <div className="mb-1">Access code</div>
                            <FormControl
                              value={accessCode}
                              onChange={(e) => setAccessCode(e.currentTarget.value)}
                            />
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card>
                        <ListGroup>
                          <ListGroup.Item className="border-0 border-bottom">
                            <div className="mb-1">For</div>
                            <FormControl
                              value={assignTo}
                              onChange={(e) => setAssignTo(e.currentTarget.value)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <div className="mb-1">Available from</div>
                            <FormControl
                              type="datetime-local"
                              value={startDate}
                              onChange={(e) => setStartDate(e.currentTarget.value)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0 border-bottom">
                            <div className="mb-1">Due</div>
                            <FormControl
                              type="datetime-local"
                              value={dueDate}
                              onChange={(e) => setDueDate(e.currentTarget.value)}
                            />
                          </ListGroup.Item>
                          <ListGroup.Item className="border-0">
                            <div className="mb-1">Available until</div>
                            <FormControl
                              type="datetime-local"
                              value={endDate}
                              onChange={(e) => setEndDate(e.currentTarget.value)}
                            />
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    </Col>
                  </Row>
                </Tab>

                <Tab eventKey="questions" title="Questions">
                  <Card className="mb-3">
                    <Card.Body className="d-flex gap-3 align-items-end flex-wrap">
                      <div>
                        <div className="mb-2">Question Type</div>
                        <Dropdown>
                          <Dropdown.Toggle variant="light" className="border">
                            {questionType === "MC"
                              ? "Multiple Choice Question"
                              : questionType === "TF"
                                ? "True/False Question"
                                : "Fill in the Blanks Question"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => setQuestionType("MC")}>Multiple Choice Question</Dropdown.Item>
                            <Dropdown.Item onClick={() => setQuestionType("TF")}>True/False Question</Dropdown.Item>
                            <Dropdown.Item onClick={() => setQuestionType("FIB")}>Fill in the Blanks Question</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                      <div className="ms-auto">
                        <Button variant="primary" onClick={openNewQuestion}>+ New Question</Button>
                      </div>
                    </Card.Body>
                  </Card>
                  <Card className="mb-3 shadow-sm">
                    <Card.Header className="bg-light fw-semibold">
                      Multiple Choice Questions
                    </Card.Header>
                    <Card.Body className="p-0">
                      {bank.mc.length ? (
                        <ListGroup variant="flush" className="mb-0">
                          {bank.mc.map((q, idx) => (
                            <ListGroup.Item key={q.id} className="py-3 border-0">
                              <Row className="align-items-start">
                                <Col>
                                  <div className="fw-semibold mb-1">
                                    Q{idx + 1}. {q.questionText} <span>({q.points} pts)</span>
                                  </div>
                                  <ListGroup className="mb-0">
                                    {q.options.map((opt, i) => (
                                      <ListGroup.Item key={opt.id ?? i} className="border-0 px-0">
                                        <Form.Check
                                          type="radio"
                                          name={`q-${q.id}`}
                                          id={`q-${q.id}-opt-${i}`}
                                          checked={q.correct === opt.id}
                                          label={opt.text || <span>Option {i + 1}</span>}
                                          readOnly
                                        />
                                      </ListGroup.Item>
                                    ))}
                                  </ListGroup>
                                </Col>
                                <Col xs="auto" className="d-flex gap-2">
                                  <Button variant="outline-secondary" onClick={() => openEditQuestion("MC", idx)}>Edit</Button>
                                  <Button variant="outline-danger" onClick={() => deleteQuestion("MC", idx)}>Delete</Button>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <div className="p-3 text-muted">No MC questions available.</div>
                      )}
                    </Card.Body>
                  </Card>
                  <Card className="mb-3 shadow-sm">
                    <Card.Header className="bg-light fw-semibold">
                      True / False Questions
                    </Card.Header>
                    <Card.Body className="p-0">
                      {bank.tf.length ? (
                        <ListGroup variant="flush" className="mb-0">
                          {bank.tf.map((q, idx) => (
                            <ListGroup.Item key={q.id} className="py-3 border-0">
                              <Row className="align-items-start">
                                <Col>
                                  <div className="fw-semibold mb-1">
                                    Q{idx + 1}. {q.questionText} <span>({q.points} pts)</span>
                                  </div>
                                  <ListGroup className="mb-0">
                                    <ListGroup.Item className="border-0 px-0">
                                      <Form.Check type="radio" checked={q.answer === true} label="True" readOnly />
                                    </ListGroup.Item>
                                    <ListGroup.Item className="border-0 px-0">
                                      <Form.Check type="radio" checked={q.answer === false} label="False" readOnly />
                                    </ListGroup.Item>
                                  </ListGroup>
                                </Col>
                                <Col xs="auto" className="d-flex gap-2">
                                  <Button variant="outline-secondary" onClick={() => openEditQuestion("TF", idx)}>Edit</Button>
                                  <Button variant="outline-danger" onClick={() => deleteQuestion("TF", idx)}>Delete</Button>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <div className="p-3 text-muted">No TF questions available.</div>
                      )}
                    </Card.Body>
                  </Card>
                  <Card className="mb-3 shadow-sm">
                    <Card.Header className="bg-light fw-semibold">
                      Fill in the Blanks Questions
                    </Card.Header>
                    <Card.Body className="p-0">
                      {bank.fib.length ? (
                        <ListGroup variant="flush" className="mb-0">
                          {bank.fib.map((q, idx) => (
                            <ListGroup.Item key={q.id} className="py-3 border-0">
                              <Row className="align-items-start">
                                <Col>
                                  <div className="fw-semibold mb-1">
                                    Q{idx + 1}. {q.questionText} <span>({q.points} pts)</span>
                                  </div>
                                  <div className="mb-0">
                                    <span className="text-primary fw-semibold">Acceptable answers:</span> {q.acceptableAnswers.length ? q.acceptableAnswers.join(", ") : "—"}
                                  </div>

                                </Col>
                                <Col xs="auto" className="d-flex gap-2">
                                  <Button variant="outline-secondary" onClick={() => openEditQuestion("FIB", idx)}>Edit</Button>
                                  <Button variant="outline-danger" onClick={() => deleteQuestion("FIB", idx)}>Delete</Button>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <div className="p-3 text-muted">No FIB questions available.</div>
                      )}
                    </Card.Body>
                  </Card>
                </Tab>
              </Tabs>

              <div className="d-flex gap-2 float-end mt-4">
                <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
                <Button variant="danger" type="submit">Save</Button>
              </div>
            </fieldset>
          </Form>

          <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
            <Modal.Header closeButton>
              <Modal.Title>
                {editing ? "Edit Question" : "New Question"} ·{" "}
                {questionType === "MC" ? "Multiple Choice" : questionType === "TF" ? "True / False" : "Fill in the Blanks"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row className="g-3">
                <Col md={10}>
                  <Form.Label>Question</Form.Label>
                  <FormControl
                    as="textarea"
                    rows={4}
                    value={qText}
                    onChange={(e) => setQText(e.currentTarget.value)}
                  />
                </Col>
                <Col md={2}>
                  <Form.Label>Points</Form.Label>
                  <FormControl
                    type="number"
                    min={0}
                    value={qPoints}
                    onChange={(e) => setQPoints(Number(e.currentTarget.value) || 0)}
                  />
                </Col>
              </Row>

              {questionType === "MC" && (
                <div className="mt-3">
                  <Form.Label className="mb-2">Options (mark the correct one)</Form.Label>
                  <ListGroup>
                    {mcOptions.map((op, i) => (
                      <ListGroup.Item key={op.id ?? i} className="border-0 px-0">
                        <InputGroup>
                          <InputGroup.Checkbox
                            checked={mcCorrectId === op.id}
                            onChange={() => setMcCorrectId(op.id)}
                            aria-label="Mark correct"
                          />
                          <FormControl
                            value={op.text}
                            onChange={(e) => {
                              const next = [...mcOptions];
                              next[i] = { ...op, text: e.currentTarget.value };
                              setMcOptions(next);
                            }}
                            placeholder={`Option ${i + 1}`}
                          />
                          <Button
                            variant="outline-danger"
                            onClick={() => setMcOptions(mcOptions.filter((_, idx) => idx !== i))}
                            disabled={mcOptions.length <= 2}
                          >
                            Delete
                          </Button>
                        </InputGroup>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Button
                    variant="outline-primary"
                    className="mt-2"
                    onClick={() => setMcOptions([...mcOptions, { id: tmpId(), text: "" }])}
                  >
                    + Add Option
                  </Button>
                </div>
              )}

              {questionType === "TF" && (
                <div className="mt-3">
                  <Form.Label>Answer</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check type="radio" id="tf-true" name="tf" label="True" checked={tfAnswer === true} onChange={() => setTfAnswer(true)} />
                    <Form.Check type="radio" id="tf-false" name="tf" label="False" checked={tfAnswer === false} onChange={() => setTfAnswer(false)} />
                  </div>
                </div>
              )}

              {questionType === "FIB" && (
                <div className="mt-3">
                  <Form.Text className="d-block mb-2">
                    Use <code>___</code> in the question text to indicate blanks. Add acceptable answers below.
                  </Form.Text>
                  <ListGroup>
                    {fibAnswers.map((a, i) => (
                      <ListGroup.Item key={i} className="border-0 px-0">
                        <InputGroup>
                          <FormControl
                            value={a}
                            onChange={(e) => {
                              const next = [...fibAnswers];
                              next[i] = e.currentTarget.value;
                              setFibAnswers(next);
                            }}
                            placeholder={`Answer ${i + 1}`}
                          />
                          <Button
                            variant="outline-danger"
                            onClick={() => setFibAnswers(fibAnswers.filter((_, idx) => idx !== i))}
                            disabled={fibAnswers.length <= 1}
                          >
                            Delete
                          </Button>
                        </InputGroup>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                  <Button variant="outline-primary" className="mt-2" onClick={() => setFibAnswers([...fibAnswers, ""])}>+ Add Acceptable Answer</Button>
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="success" onClick={saveQuestionFromModal}>Save</Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showUnsaved} onHide={() => setShowUnsaved(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Unsaved changes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="mb-2">You have unsaved changes on this quiz.</p>
              <p className="mb-0 text-muted">Choose an option below to continue.</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setShowUnsaved(false)}>Keep Editing</Button>
              <Button variant="outline-danger" onClick={confirmDiscard}>Discard Changes</Button>
              <Button variant="primary" onClick={confirmSaveAndExit}>Save Changes</Button>
            </Modal.Footer>
          </Modal>
        </Card.Body>
      </Card>
    </Container>
  );
}
