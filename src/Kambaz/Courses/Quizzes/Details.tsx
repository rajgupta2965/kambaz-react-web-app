import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Button, Card, Row, Col, ListGroup, ButtonGroup, Tabs, Tab, Modal, Form, Badge } from "react-bootstrap";
import { selectQuizById } from "./reducer";
import { useQuizActions } from "./useQuizActions";
import QuizQuestions from "./Questions";
import useIsFaculty from "../../auth/useIsFaculty";

const yesNo = (v: any) => (v ? "Yes" : "No");
type MCOption = { id?: string; text?: string };
type MCQ = { id?: string; questionText?: string; points?: number; options?: MCOption[]; correct?: string };
type TFQ = { id?: string; questionText?: string; points?: number; answer?: boolean };
type FIBQ = { id?: string; questionText?: string; points?: number; acceptableAnswers?: string[] };
type Bank = { mc?: MCQ[]; tf?: TFQ[]; fib?: FIBQ[] };
const norm = (s: any) => (s ?? "").toString().trim().toLowerCase();
const fibIsCorrect = (acceptable: string[] = [], text?: string) => !!text && acceptable.some((a) => norm(a) === norm(text));

export default function QuizDetails() {
  const { courseId, cid, quizId, qid } = useParams();
  const currentCourseId = courseId ?? cid ?? "";
  const currentQuizId = quizId ?? qid ?? "";
  const navigate = useNavigate();
  const { handlePublishToggle, load, fetchAttempts, loadQuestionBank } = useQuizActions() as any;
  const item = useSelector((s: any) => selectQuizById(s, currentQuizId));
  const isFaculty = useIsFaculty();
  const userId = useSelector((s: any) => s?.accountReducer?.currentUser?._id || s?.users?.current?._id || s?.auth?.user?._id) || "";
  const startedKey = `quizStarted:${currentQuizId}:${userId}`;
  const [activeTab, setActiveTab] = useState<"details" | "questions">("details");
  const [attempts, setAttempts] = useState<number>(0);
  const [attemptsLoaded, setAttemptsLoaded] = useState(false);
  const noOfAttemptsRaw = Number(item?.noOfAttempts ?? 0);
  const multipleAttempts = !!item?.multipleAttempts;
  const maxAttempts = multipleAttempts ? (Number.isFinite(noOfAttemptsRaw) && noOfAttemptsRaw > 0 ? noOfAttemptsRaw : Infinity) : 1;
  const attemptsExceeded = attempts >= maxAttempts;
  const [hasStarted, setHasStarted] = useState<boolean>(() => { try { return sessionStorage.getItem(startedKey) === "1"; } catch { return false; } });
  const [sessionId, setSessionId] = useState<number>(0);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const startSeconds = useMemo(() => {
    const tl = Number(item?.timeLimit ?? 0);
    return Number.isFinite(tl) && tl > 0 ? tl * 60 : 0;
  }, [item?.timeLimit]);
  const [timeLeftSec, setTimeLeftSec] = useState<number>(startSeconds);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [showLastAttemptModal, setShowLastAttemptModal] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<any | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [serverMaxPoints, setServerMaxPoints] = useState<number | null>(null);
  const [bank, setBank] = useState<Bank | null>(null);
  const fetchAttemptsFromServer = useCallback(async () => {
    if (!currentQuizId || !userId) {
      setAttemptsLoaded(true);
      return;
    }
    setAttemptsLoaded(false);
    try {
      const data = await fetchAttempts(currentQuizId, userId);
      setAttempts(Number(data?.totalAttempts || 0));
    } catch (e) {
      console.error("[QuizDetails] attempts fetch error:", e);
    } finally {
      setAttemptsLoaded(true);
    }
  }, [currentQuizId, userId, fetchAttempts]);

  const openLastAttemptModal = useCallback(async () => {
    try {
      const [attemptData, qb] = await Promise.all([
        fetchAttempts(currentQuizId, userId),
        loadQuestionBank(currentQuizId),
      ]);
      const attemptsArr: any[] = Array.isArray(attemptData?.attempts)
        ? attemptData.attempts
        : [];
      const last = attemptsArr.length > 0
        ? attemptsArr[attemptsArr.length - 1]
        : (attemptData?.lastAttempt ?? null);
      setLastAttempt(last || null);
      const best =
        Number.isFinite(Number(attemptData?.maxScoreAcrossAttempts))
          ? Number(attemptData.maxScoreAcrossAttempts)
          : (attemptsArr.length
            ? Math.max(...attemptsArr.map(a => Number(a?.score ?? 0)))
            : null);
      setBestScore(Number.isFinite(best as number) ? (best as number) : null);
      const metaPoints =
        Number.isFinite(Number(last?.maxScore)) ? Number(last.maxScore) :
          Number.isFinite(Number(last?.maxPossible)) ? Number(last.maxPossible) :
            (attemptData?.meta && Number.isFinite(Number(attemptData.meta.totalPoints))
              ? Number(attemptData.meta.totalPoints)
              : null);
      setServerMaxPoints(metaPoints);
      setBank(qb || null);
      setShowLastAttemptModal(true);
    } catch (e) {
      console.error("[QuizDetails] failed to load last attempt:", e);
      setShowLastAttemptModal(true);
    }
  }, [currentQuizId, userId, fetchAttempts, loadQuestionBank]);

  useEffect(() => {
    if (currentCourseId) load();
  }, [currentCourseId, load]);

  useEffect(() => {
    setAttemptsLoaded(false);
    fetchAttemptsFromServer();
  }, [fetchAttemptsFromServer]);

  useEffect(() => {
    if (hasStarted) {
      try { sessionStorage.setItem(startedKey, "1"); } catch { }
    } else {
      try { sessionStorage.removeItem(startedKey); } catch { }
    }
  }, [hasStarted, startedKey]);

  useEffect(() => {
    if (attemptsExceeded) {
      setHasStarted(false);
      setShouldAutoSubmit(false);
      try { sessionStorage.removeItem(startedKey); } catch { }
      setShowAccessModal(false);
    }
  }, [attemptsExceeded, startedKey]);

  useEffect(() => {
    if (!hasStarted && !justSubmitted) {
      setTimeLeftSec(startSeconds);
      setShouldAutoSubmit(false);
    }
  }, [startSeconds, hasStarted, justSubmitted]);

  useEffect(() => {
    if (!hasStarted || justSubmitted) return;
    if (startSeconds <= 0) return;
    if (timeLeftSec <= 0) {
      setShouldAutoSubmit(true);
      return;
    }
    const t = setInterval(() => {
      setTimeLeftSec((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [hasStarted, justSubmitted, startSeconds, timeLeftSec]);

  if (!item) return <Container className="m-2">Loading…</Container>;

  const onCancel = () => {
    setHasStarted(false);
    setShouldAutoSubmit(false);
    setJustSubmitted(false);
    try { sessionStorage.removeItem(startedKey); } catch { }
    setTimeLeftSec(startSeconds);
    setActiveTab("details");
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes`);
  };

  const onSaveAndPublish = async () => {
    if (!currentQuizId) return;
    await handlePublishToggle(currentQuizId, true);
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes`);
  };

  const goEdit = () => navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${currentQuizId}/Editor`);

  const handleSelect = (k: string | null) => {
    if (!k) return;
    const next = k as "details" | "questions";
    if (isFaculty) {
      setActiveTab(next);
      return;
    }
    if (next === "questions") {
      if (hasStarted || justSubmitted) setActiveTab("questions");
      else {
        setShowAccessModal(true);
      }
    } else {
      setActiveTab("details");
    }
  };

  const onStartQuizClick = () => {
    console.debug("[QuizDetails] start click — userId:", userId, "courseId:", currentCourseId, "quizId:", currentQuizId);
    if (!attemptsLoaded) return;
    if (attemptsExceeded) return;
    if (hasStarted) {
      setActiveTab("questions");
      return;
    }
    setJustSubmitted(false);
    if (!item?.accessCode) {
      setHasStarted(true);
      setTimeLeftSec(startSeconds);
      setShouldAutoSubmit(false);
      setSessionId((id) => id + 1);
      setActiveTab("questions");
      return;
    }
    setShowAccessModal(true);
  };

  const onVerifyAccessCode = () => {
    if (attemptsExceeded) return;
    const expected = item?.accessCode ?? "";
    const ok = accessCodeInput.trim() === expected;
    if (ok) {
      setHasStarted(true);
      setJustSubmitted(false);
      setTimeLeftSec(startSeconds);
      setShouldAutoSubmit(false);
      setSessionId((id) => id + 1);
      setShowAccessModal(false);
      setAccessCodeInput("");
      setActiveTab("questions");
    }
  };

  const accessError = !!accessCodeInput && item?.accessCode && accessCodeInput.trim() !== item.accessCode;
  const questionsDisabled = !isFaculty && !(hasStarted || justSubmitted);

  const handleChildSubmitted = async () => {
    setHasStarted(false);
    setShouldAutoSubmit(false);
    setJustSubmitted(true);
    await fetchAttemptsFromServer();
  };

  const handleAfterSubmitClose = () => {
    setActiveTab("details");
    setJustSubmitted(false);
    setTimeLeftSec(startSeconds);
    setShouldAutoSubmit(false);
  };

  const renderFlattenedSubmission = () => {
    if (!lastAttempt) {
      return <div className="text-muted">No previous attempt found for this quiz.</div>;
    }
    const score = Number(lastAttempt.score ?? 0);
    const submittedAt = lastAttempt.submittedAt ? new Date(lastAttempt.submittedAt) : null;
    const flatQs: Array<
      ({ kind: "MC" } & MCQ) | ({ kind: "TF" } & TFQ) | ({ kind: "FIB" } & FIBQ)
    > = [];
    if (bank?.mc) bank.mc.forEach((q) => flatQs.push({ kind: "MC", ...q }));
    if (bank?.tf) bank.tf.forEach((q) => flatQs.push({ kind: "TF", ...q }));
    if (bank?.fib) bank.fib.forEach((q) => flatQs.push({ kind: "FIB", ...q }));
    const recs: any[] = Array.isArray(lastAttempt.records) ? lastAttempt.records : [];
    const ansMap: Record<string, any> = {};
    recs.forEach((r) => {
      const qid = r.questionId ?? r.id;
      if (!qid) return;
      if (r.questionType === "MC") {
        ansMap[qid] = {
          type: "MC",
          optionId: r.userOptionId ?? undefined,
          correctOptionId: r.correctOptionId ?? undefined,
        };
      } else if (r.questionType === "TF") {
        const userVal =
          r.userOptionId === "TRUE" ? true :
            r.userOptionId === "FALSE" ? false :
              undefined;
        const correctVal =
          r.correctOptionId === "TRUE" ? true :
            r.correctOptionId === "FALSE" ? false :
              undefined;
        ansMap[qid] = { type: "TF", value: userVal, correct: correctVal };
      } else if (r.questionType === "FIB") {
        ansMap[qid] = {
          type: "FIB",
          text: r.userText ?? "",
          acceptable: Array.isArray(r.acceptableAnswers) ? r.acceptableAnswers : undefined,
        };
      }
    });

    return (
      <>
        <Card className="mb-3">
          <Card.Body className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="fw-semibold fs-5">Last Attempt</div>
            <div className="d-flex align-items-center gap-2">
              <Badge bg="primary">
                Score: {score}{serverMaxPoints != null ? ` / ${serverMaxPoints}` : ""}
              </Badge>
              <Badge bg="success">
                Max so far: {bestScore != null ? `${bestScore}${serverMaxPoints != null ? ` / ${serverMaxPoints}` : ""}` : "—"}
              </Badge>
              {submittedAt && (
                <span className="small">Submitted: {submittedAt.toLocaleString()}</span>
              )}
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-3">
          <Card.Body>
            <div className="fw-semibold mb-2">Show Answers</div>
            <ListGroup variant="flush">
              {flatQs.map((q, idx) => {
                const ans = q.id ? ansMap[q.id] : undefined;
                const yourAnsMissing =
                  !ans ||
                  (ans.type === "MC" && !ans.optionId) ||
                  (ans.type === "TF" && typeof ans.value !== "boolean") ||
                  (ans.type === "FIB" && !(ans.text ?? "").toString().trim());

                return (
                  <ListGroup.Item key={q.id ?? idx} className="border-0 border-top py-3">
                    <div className="fw-semibold mb-2">
                      {idx + 1}. {q.questionText}{" "}
                      <span className="text-muted">
                        ({typeof q.points === "number" ? q.points : 0} pts)
                      </span>
                    </div>

                    {q.kind === "MC" && (
                      <ListGroup>
                        {(q.options ?? []).map((opt, i) => {
                          const isYour = ans?.type === "MC" && ans.optionId === opt.id;
                          const isCorrect =
                            (ans?.type === "MC" && ans.correctOptionId
                              ? opt.id === ans.correctOptionId
                              : q.correct && opt.id === q.correct);

                          const label = opt.text || `Option ${i + 1}`;
                          const note: string[] = [];
                          if (isYour) note.push("Your answer");
                          if (isCorrect) note.push("Correct");
                          const annotation = note.length ? ` (${note.join(", ")})` : "";
                          const labelClass =
                            isCorrect
                              ? "text-success fw-semibold"
                              : isYour
                                ? "text-danger fw-semibold"
                                : "";

                          return (
                            <ListGroup.Item key={opt.id ?? i} className="border-0 px-0">
                              <div className={labelClass}>
                                <Form.Check
                                  type="radio"
                                  name={`review-q-${q.id}`}
                                  id={`review-q-${q.id}-opt-${i}`}
                                  label={label + annotation}
                                  checked={!!isYour}
                                  disabled
                                  onChange={() => { }}
                                />
                              </div>
                            </ListGroup.Item>
                          );
                        })}
                        {yourAnsMissing && (
                          <div className="text-muted ms-1 mt-1">No answer selected.</div>
                        )}
                      </ListGroup>
                    )}

                    {q.kind === "TF" && (
                      <ListGroup>
                        {([true, false] as const).map((val) => {
                          const isYour = ans?.type === "TF" && ans.value === val;
                          const correctVal =
                            typeof ans?.correct === "boolean" ? ans.correct : q.answer;
                          const isCorrect = correctVal === val;
                          const label = val ? "True" : "False";
                          const note: string[] = [];
                          if (isYour) note.push("Your answer");
                          if (isCorrect) note.push("Correct");
                          const annotation = note.length ? ` (${note.join(", ")})` : "";
                          const labelClass =
                            isCorrect
                              ? "text-success fw-semibold"
                              : isYour
                                ? "text-danger fw-semibold"
                                : "";

                          return (
                            <ListGroup.Item key={String(val)} className="border-0 px-0">
                              <div className={labelClass}>
                                <Form.Check
                                  type="radio"
                                  name={`review-q-${q.id}`}
                                  id={`review-q-${q.id}-${val ? "true" : "false"}`}
                                  label={label + annotation}
                                  checked={!!isYour}
                                  disabled
                                  onChange={() => { }}
                                />
                              </div>
                            </ListGroup.Item>
                          );
                        })}
                        {yourAnsMissing && (
                          <div className="text-muted ms-1 mt-1">No answer selected.</div>
                        )}
                      </ListGroup>
                    )}

                    {q.kind === "FIB" && (
                      <>
                        <div className="mb-2 opacity-50">
                          {(() => {
                            const your = ans?.type === "FIB" ? (ans.text ?? "") : "";
                            const acceptable =
                              (ans?.type === "FIB" && Array.isArray(ans.acceptable) && ans.acceptable.length)
                                ? ans.acceptable
                                : (q.acceptableAnswers ?? []);
                            const correct = fibIsCorrect(acceptable, your);
                            if (!your || !your.toString().trim()) {
                              return <span>No answer provided.</span>;
                            }
                            return (
                              <div>
                                <span className="fw-semibold">Your answer: </span>
                                <span className={correct ? "text-success fw-semibold" : "text-danger fw-semibold"}>
                                  {your}{correct ? " (Correct)" : " (Incorrect)"}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                        <div className="opacity-50">
                          <span className="fw-semibold">Acceptable answers: </span>
                          <span className="text-success fw-semibold">
                            {(ans?.type === "FIB" && Array.isArray(ans.acceptable) && ans.acceptable.length
                              ? ans.acceptable.join(", ")
                              : (q.acceptableAnswers?.length ? q.acceptableAnswers.join(", ") : "—"))}
                          </span>
                        </div>
                      </>
                    )}
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card.Body>
        </Card>
      </>
    );
  };

  return (
    <Container className="m-2">
      <Card className="rounded-3 shadow border-1">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">{item.title}</h3>
            {isFaculty && (
              <ButtonGroup>
                <Button variant="secondary" active>Preview</Button>
                <Button variant="outline-secondary" onClick={goEdit}>Edit</Button>
              </ButtonGroup>
            )}
          </div>

          <Tabs id="quiz-preview-tabs" className="mb-3" activeKey={activeTab} onSelect={handleSelect}>
            <Tab eventKey="details" title="Details">
              <Row className="mb-3">
                <Col md={4}>
                  <Card><Card.Body className="py-2">
                    <div>Course ID</div>
                    <div className="fw-semibold">{item.course}</div>
                  </Card.Body></Card>
                </Col>
                <Col md={4}>
                  <Card><Card.Body className="py-2">
                    <div>Assignment Group</div>
                    <div className="fw-semibold">{item.assignType}</div>
                  </Card.Body></Card>
                </Col>
                <Col md={4}>
                  <Card><Card.Body className="py-2">
                    <div>Quiz Type</div>
                    <div className="fw-semibold">{item.quizType}</div>
                  </Card.Body></Card>
                </Col>
              </Row>

              <div className="mb-2">Instructions:</div>
              <Card className="mb-4">
                <Card.Body>{item.desc || "No description"}</Card.Body>
              </Card>

              <Row className="mb-4">
                <Col md={4}>
                  <Card><Card.Body className="text-center">
                    <div>Points</div>
                    <div className="display-6">{item.points}</div>
                  </Card.Body></Card>
                </Col>
                <Col md={4}>
                  <Card><Card.Body className="text-center">
                    <div>Questions</div>
                    <div className="display-6">{item.questions}</div>
                  </Card.Body></Card>
                </Col>
                <Col md={4}>
                  <Card><Card.Body className="text-center">
                    <div>Time Limit</div>
                    <div className="display-6">{item.timeLimit}</div>
                  </Card.Body></Card>
                </Col>
              </Row>

              <Row>
                <Col md={4}>
                  <Card>
                    <ListGroup>
                      <ListGroup.Item className="border-0 border-bottom">One question at a time: <b>{yesNo(item.showOneQuestion)}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">Show correct answers: <b>{yesNo(item.showAnswers)}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">When to show answers: <b>{item.showAnswersWhen}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">Shuffle Questions: <b>{yesNo((item as any).shuffleQuestions)}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0">Shuffle Answers: <b>{yesNo(item.shuffleAnswers)}</b></ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <ListGroup>
                      <ListGroup.Item className="border-0 border-bottom">Lock answers: <b>{yesNo(item.lockQuestionsAfterAnswering)}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">Multiple attempts: <b>{yesNo(item.multipleAttempts)}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">No. of attempts: <b>{item.noOfAttempts}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">Webcam required: <b>{yesNo(item.webcamRequired)}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0">Access code: <b>{item.accessCode || "-"}</b></ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <ListGroup>
                      <ListGroup.Item className="border-0 border-bottom">For: <b>{item.assignTo}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">Available from: <b>{item.startDate}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0 border-bottom">Due: <b>{item.dueDate}</b></ListGroup.Item>
                      <ListGroup.Item className="border-0">Available until: <b>{item.endDate}</b></ListGroup.Item>
                    </ListGroup>
                  </Card>
                </Col>
              </Row>
              <div className="d-flex gap-2 float-end mt-4">
                {!isFaculty && attemptsExceeded && (
                  <Button
                    variant="outline-primary"
                    onClick={openLastAttemptModal}
                  >
                    Last Attempt
                  </Button>
                )}
                <Button variant="secondary" onClick={onCancel}>Close</Button>
                {isFaculty ? (
                  <Button variant="success" onClick={onSaveAndPublish}>Save and Publish</Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={onStartQuizClick}
                    disabled={!attemptsLoaded || attemptsExceeded}
                  >
                    {hasStarted
                      ? "Continue Quiz"
                      : attemptsExceeded
                        ? "Attempts exceeded"
                        : "Start Quiz"}
                  </Button>
                )}
              </div>
            </Tab>

            <Tab eventKey="questions" title="Questions" disabled={questionsDisabled}>
              <QuizQuestions
                key={sessionId}
                running={!isFaculty && hasStarted}
                timeLeftSec={timeLeftSec}
                shouldAutoSubmit={shouldAutoSubmit}
                onSubmitted={handleChildSubmitted}
                onCloseAfterSubmit={handleAfterSubmitClose}
              />
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Modal show={showAccessModal} onHide={() => setShowAccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Access Code</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {attemptsExceeded ? (
            <div className="text-danger">No. of attempts exceeded.</div>
          ) : item?.accessCode ? (
            <>
              <Form.Label className="mb-2">Access Code</Form.Label>
              <Form.Control
                value={accessCodeInput}
                onChange={(e) => setAccessCodeInput(e.currentTarget.value)}
                placeholder="Access code"
              />
              {accessError && (
                <div className="text-danger small mt-2">Incorrect code.</div>
              )}
            </>
          ) : (
            <div className="text-muted">No access code required.</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowAccessModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (attemptsExceeded) return;
              if (item?.accessCode) {
                onVerifyAccessCode();
              } else {
                setHasStarted(true);
                setJustSubmitted(false);
                setTimeLeftSec(startSeconds);
                setShouldAutoSubmit(false);
                setSessionId((id) => id + 1);
                setShowAccessModal(false);
                setActiveTab("questions");
              }
            }}
            disabled={
              attemptsExceeded ||
              (!!item?.accessCode && accessCodeInput.trim().length === 0)
            }
          >
            Unlock & Start
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showLastAttemptModal} onHide={() => setShowLastAttemptModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Last Attempt</Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderFlattenedSubmission()}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLastAttemptModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
