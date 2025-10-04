import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, ListGroup, Form, Button } from "react-bootstrap";
import { selectQuizById } from "./reducer";
import { useQuizActions } from "./useQuizActions";
import useIsFaculty from "../../auth/useIsFaculty";

type MCOption = { id: string; text: string };
type MCQ = { id: string; questionText: string; points: number; options: MCOption[]; correct?: string };
type TFQ = { id: string; questionText: string; points: number; answer: boolean };
type FIBQ = { id: string; questionText: string; points: number; acceptableAnswers: string[] };
type Bank = { mc: MCQ[]; tf: TFQ[]; fib: FIBQ[] };

type FlatQ =
  | ({ kind: "MC" } & MCQ)
  | ({ kind: "TF" } & TFQ)
  | ({ kind: "FIB" } & FIBQ);
type AnsVal =
  | { type: "MC"; optionId?: string }
  | { type: "TF"; value?: boolean }
  | { type: "FIB"; text?: string };

type Props = {
  running: boolean;
  timeLeftSec: number;
  shouldAutoSubmit: boolean;
  onSubmitted: () => void;
  onCloseAfterSubmit: () => void;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const norm = (s: any) => (s ?? "").toString().trim().toLowerCase();
const fibIsCorrect = (acceptable: string[] = [], text?: string) => !!text && acceptable.some((a) => norm(a) === norm(text));

export default function QuizQuestions(props: Props) {
  const { running, timeLeftSec, shouldAutoSubmit, onSubmitted, onCloseAfterSubmit } = props;
  const { quizId, qid, courseId, cid } = useParams();
  const currentQuizId = quizId ?? qid ?? "";
  const currentCourseId = courseId ?? cid ?? "";
  const { loadQuestionBank, submitAttempt } = useQuizActions() as any;
  const maybeSubmit = submitAttempt as ((payload: any) => Promise<any>) | undefined;
  const item = useSelector((s: any) => selectQuizById(s, currentQuizId));
  const userId =
    useSelector((s: any) =>
      s?.accountReducer?.currentUser?._id ||
      s?.users?.current?._id ||
      s?.account?.currentUser?._id ||
      s?.auth?.user?._id
    ) || "";
  const isFaculty = useIsFaculty();
  const seededRef = useRef(false);
  const [bank, setBank] = useState<Bank>({ mc: [], tf: [], fib: [] });

  useEffect(() => {
    if (!currentQuizId) return;
    const qb = (item as any)?.questionBank;
    if (qb && !seededRef.current) {
      setBank({
        mc: (qb.mc || []).map((q: any) => ({
          id: q.id, questionText: q.questionText ?? "", points: q.points ?? 1,
          options: (q.options || []).map((op: any) => ({ id: op.id, text: op.text })), correct: q.correct
        })),
        tf: (qb.tf || []).map((q: any) => ({
          id: q.id, questionText: q.questionText ?? "", points: q.points ?? 1, answer: !!q.answer
        })),
        fib: (qb.fib || []).map((q: any) => ({
          id: q.id, questionText: q.questionText ?? "", points: q.points ?? 1,
          acceptableAnswers: Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers : []
        })),
      });
      seededRef.current = true;
      return;
    }
    if (!qb && !seededRef.current) {
      (async () => {
        const b = await loadQuestionBank(currentQuizId);
        const mc = (b?.mc || []).map((q: any) => ({
          id: q.id, questionText: q.questionText ?? "", points: q.points ?? 1,
          options: (q.options || []).map((op: any) => ({ id: op.id, text: op.text })), correct: q.correct
        })) as MCQ[];
        const tf = (b?.tf || []).map((q: any) => ({
          id: q.id, questionText: q.questionText ?? "", points: q.points ?? 1, answer: !!q.answer
        })) as TFQ[];
        const fib = (b?.fib || []).map((q: any) => ({
          id: q.id, questionText: q.questionText ?? "", points: q.points ?? 1,
          acceptableAnswers: Array.isArray(q.acceptableAnswers) ? q.acceptableAnswers : []
        })) as FIBQ[];
        setBank({ mc, tf, fib });
        seededRef.current = true;
      })();
    }
  }, [currentQuizId, item, loadQuestionBank]);

  const totalQs = (bank.mc?.length || 0) + (bank.tf?.length || 0) + (bank.fib?.length || 0);
  const flatBase = useMemo<FlatQ[]>(() => {
    const arr: FlatQ[] = [];
    (bank.mc ?? []).forEach(q => arr.push({ kind: "MC", id: q.id, questionText: q.questionText, points: q.points, options: q.options, correct: q.correct }));
    (bank.tf ?? []).forEach(q => arr.push({ kind: "TF", id: q.id, questionText: q.questionText, points: q.points, answer: q.answer }));
    (bank.fib ?? []).forEach(q => arr.push({ kind: "FIB", id: q.id, questionText: q.questionText, points: q.points, acceptableAnswers: q.acceptableAnswers ?? [] }));
    return (item as any)?.shuffleQuestions ? shuffle(arr) : arr;
  }, [bank, item]);
  const [mcOptionOrder, setMcOptionOrder] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (!flatBase.length) return;
    const map: Record<string, string[]> = {};
    flatBase.forEach(q => {
      if (q.kind === "MC") {
        const ids = q.options.map(o => o.id);
        map[q.id] = item?.shuffleAnswers ? shuffle(ids) : ids;
      }
    });
    setMcOptionOrder(map);
  }, [flatBase, item?.shuffleAnswers]);

  const [answers, setAnswers] = useState<Record<string, AnsVal>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reviewScore, setReviewScore] = useState<{ score: number; max: number } | null>(null);
  const [savedQs, setSavedQs] = useState<Record<string, boolean>>({});
  const [fibCommitted, setFibCommitted] = useState<Record<string, boolean>>({});
  const specialMode = !!item?.showAnswers && !!item?.showOneQuestion && (item?.showAnswersWhen === "afterEach");
  const oneAtATime = !!item?.showOneQuestion;
  const lockAfter = !!item?.lockQuestionsAfterAnswering;
  const showCorrect = !!item?.showAnswers;

  const answered = (qid: string) => !!answers[qid] && (
    (answers[qid].type === "MC" && !!(answers[qid] as any).optionId) ||
    (answers[qid].type === "TF" && typeof (answers[qid] as any).value === "boolean") ||
    (answers[qid].type === "FIB" && fibCommitted[qid] === true && ((answers[qid] as any).text ?? "").toString().trim().length > 0)
  );

  const disabledByLock = (qid: string) => submitted || (!isFaculty && !running) || (lockAfter && answered(qid)) || (specialMode && !!savedQs[qid]);
  const setMC = (qid: string, optionId: string) => setAnswers(prev => ({ ...prev, [qid]: { type: "MC", optionId } }));
  const setTF = (qid: string, value: boolean) => setAnswers(prev => ({ ...prev, [qid]: { type: "TF", value } }));
  const setFIB = (qid: string, text: string) => setAnswers(prev => ({ ...prev, [qid]: { type: "FIB", text } }));

  const calculateScore = () => {
    let score = 0;
    let max = 0;
    for (const q of flatBase) {
      const pts = typeof q.points === "number" ? q.points : 0;
      max += pts;
      const ans = answers[q.id];
      if (!ans) continue;
      if (q.kind === "MC") {
        if (ans.type === "MC" && q.correct && ans.optionId === q.correct) score += pts;
      } else if (q.kind === "TF") {
        if (ans.type === "TF" && typeof ans.value === "boolean" && ans.value === q.answer) score += pts;
      } else if (q.kind === "FIB") {
        const text = ans.type === "FIB" ? (ans.text ?? "") : "";
        if (fibIsCorrect(q.acceptableAnswers, text)) score += pts;
      }
    }
    return { score, max };
  };

  const buildSubmissionPayload = () => {
    const records = flatBase.map((q) => {
      const ans = answers[q.id];
      if (q.kind === "MC") {
        return {
          userId,
          courseId: currentCourseId,
          quizId: currentQuizId,
          questionType: "MC",
          questionId: q.id,
          selectedOptionId: ans?.type === "MC" ? ans.optionId ?? null : null,
          fibText: null,
        };
      }
      if (q.kind === "TF") {
        return {
          userId,
          courseId: currentCourseId,
          quizId: currentQuizId,
          questionType: "TF",
          questionId: q.id,
          selectedOptionId: (ans?.type === "TF" && typeof ans.value === "boolean")
            ? (ans.value ? "TRUE" : "FALSE")
            : null,
          fibText: null,
        };
      }
      return {
        userId,
        courseId: currentCourseId,
        quizId: currentQuizId,
        questionType: "FIB",
        questionId: q.id,
        selectedOptionId: null,
        fibText: ans?.type === "FIB" ? (ans.text ?? "") : "",
      };
    });
    return { userId, courseId: currentCourseId, quizId: currentQuizId, records };
  };

  const submitNow = async () => {
    if (submitted) return;
    setSubmitted(true);
    const local = calculateScore();
    setReviewScore(local);
    const payload = buildSubmissionPayload();
    try {
      console.groupCollapsed("[QuizQuestions] Submit Debug");
      console.log("userId =", payload.userId);
      console.log("courseId =", payload.courseId, "quizId =", payload.quizId);
      console.log("records count =", payload.records?.length ?? 0);
      if (!payload.userId) {
        console.warn("⚠️ userId is missing at submit time. The server will likely reject this.");
      }
      console.debug("payload (first 5 records):", {
        ...payload,
        records: Array.isArray(payload.records) ? payload.records.slice(0, 5) : payload.records,
      });
      console.groupEnd();
    } catch { }
    try {
      if (!isFaculty && maybeSubmit) {
        const resp = await maybeSubmit(payload);
        if (resp && typeof resp.score === "number") {
          setReviewScore({ score: resp.score, max: typeof resp.maxScore === "number" ? resp.maxScore : local.max });
        }
      } else {
        console.log("[QuizQuestions] (not persisted) submission:", {
          reason: isFaculty ? "user is faculty" : "no submit API available",
          payload,
          localScore: local,
        });
      }
    } catch (err) {
      console.error("Failed to submit attempt", err);
    } finally {
      onSubmitted();
    }
  };

  const handleSubmitForm: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await submitNow();
  };

  const handleClose = () => {
    setSubmitted(false);
    setAnswers({});
    setCurrentIdx(0);
    setMcOptionOrder({});
    setReviewScore(null);
    setSavedQs({});
    onCloseAfterSubmit();
  };

  useEffect(() => {
    if (shouldAutoSubmit && running && !submitted) {
      submitNow();
    }
  }, [shouldAutoSubmit, running, submitted]);

  const timerText = (() => {
    if (!running) return null;
    if (!Number.isFinite(timeLeftSec) || timeLeftSec <= 0) return "00:00";
    const m = Math.floor(timeLeftSec / 60);
    const s = timeLeftSec % 60;
    return `${pad2(m)}:${pad2(s)}`;
  })();

  if (submitted) {
    return (
      <>
        <Card className="mb-3">
          <Card.Body className="d-flex flex-column align-items-start">
            <div className="fw-semibold fs-5 mb-1">Your Quiz has been submitted successfully!</div>
            <div className="text-muted mb-3">Your responses have been recorded.</div>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Card.Body>
        </Card>

        {showCorrect && (
          <Card className="mb-3">
            <Card.Body>
              <div className="fw-semibold mb-2">Show Answers</div>
              <ListGroup variant="flush">
                {flatBase.map((q, idx) => {
                  const ans = answers[q.id];
                  const yourAnsMissing =
                    !ans ||
                    (ans.type === "MC" && !ans.optionId) ||
                    (ans.type === "TF" && typeof ans.value !== "boolean") ||
                    (ans.type === "FIB" && !(ans.text ?? "").toString().trim());

                  return (
                    <ListGroup.Item key={q.id} className="border-0 border-top py-3">
                      <div className="fw-semibold mb-2">
                        {idx + 1}. {q.questionText} <span className="text-muted">({q.points} pts)</span>
                      </div>

                      {q.kind === "MC" && (
                        <ListGroup>
                          {(q.options || []).map((opt, i) => {
                            const isYour = ans?.type === "MC" && ans.optionId === opt.id;
                            const isCorrect = q.correct && opt.id === q.correct;
                            const label = opt.text || `Option ${i + 1}`;
                            const note: string[] = [];
                            if (isYour) note.push("Your answer");
                            if (isCorrect) note.push("Correct");
                            const annotation = note.length ? ` (${note.join(", ")})` : "";
                            const labelClass =
                              isCorrect
                                ? "text-success fw-semibold"
                                : isYour && !isCorrect
                                  ? "text-danger fw-semibold"
                                  : "";
                            return (
                              <ListGroup.Item key={opt.id} className="border-0 px-0">
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
                            const isCorrect = q.answer === val;
                            const label = val ? "True" : "False";
                            const note: string[] = [];
                            if (isYour) note.push("Your answer");
                            if (isCorrect) note.push("Correct");
                            const annotation = note.length ? ` (${note.join(", ")})` : "";
                            const labelClass =
                              isCorrect
                                ? "text-success fw-semibold"
                                : isYour && !isCorrect
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
                              const correct = fibIsCorrect(q.acceptableAnswers, your);
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
                              {q.acceptableAnswers?.length ? q.acceptableAnswers.join(", ") : "—"}
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
        )}

        {reviewScore && (
          <Card className="mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div className="fw-semibold">Score: {reviewScore.score} / {reviewScore.max}</div>
            </Card.Body>
          </Card>
        )}
      </>
    );
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Body className="d-flex justify-content-between align-items-center">
          <div className="fw-semibold">Questions</div>
          <div className="d-flex align-items-center gap-2">
            {running && (
              <div className="badge fs-6 bg-warning text-dark" aria-label="quiz-timer">⏱ {timerText}</div>
            )}
            <div className="badge fs-6 bg-primary">{totalQs} total</div>
          </div>
        </Card.Body>
      </Card>

      <Form onSubmit={handleSubmitForm}>
        {(!flatBase.length) ? (
          <Card className="mb-3">
            <Card.Body><div className="text-muted">No questions available.</div></Card.Body>
          </Card>
        ) : (
          <>
            {oneAtATime ? (
              <Card className="mb-3">
                <Card.Body>
                  {(() => {
                    const q = flatBase[currentIdx];
                    const ans = answers[q.id];
                    const showAnsNow = specialMode && !!savedQs[q.id];

                    return (
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div className="fw-semibold">
                            {currentIdx + 1}. {q.questionText} <span className="text-muted">({q.points} pts)</span>
                          </div>

                          {specialMode && (
                            <Button
                              size="sm"
                              variant="outline-secondary"
                              type="button"
                              onClick={() => setSavedQs(prev => ({ ...prev, [q.id]: true }))}
                              disabled={!answered(q.id) || !!savedQs[q.id] || (!isFaculty && !running)}
                            >
                              {savedQs[q.id] ? "Saved" : "Save"}
                            </Button>
                          )}
                        </div>

                        {q.kind === "MC" && (
                          <ListGroup className="mb-2">
                            {(mcOptionOrder[q.id] || q.options.map(o => o.id)).map((oid, i) => {
                              const opt = q.options.find(o => o.id === oid)!;
                              const checked = ans?.type === "MC" && ans.optionId === oid;
                              return (
                                <ListGroup.Item key={oid} className="border-0 px-0">
                                  <Form.Check
                                    type="radio"
                                    name={`q-${q.id}`}
                                    id={`q-${q.id}-opt-${i}`}
                                    label={opt.text || `Option ${i + 1}`}
                                    checked={!!checked}
                                    disabled={disabledByLock(q.id)}
                                    onChange={() => setMC(q.id, oid)}
                                  />
                                </ListGroup.Item>
                              );
                            })}
                          </ListGroup>
                        )}

                        {q.kind === "TF" && (
                          <ListGroup className="mb-2">
                            <ListGroup.Item className="border-0 px-0">
                              <Form.Check
                                type="radio"
                                name={`q-${q.id}`}
                                id={`q-${q.id}-true`}
                                label="True"
                                checked={ans?.type === "TF" && ans.value === true}
                                disabled={disabledByLock(q.id)}
                                onChange={() => setTF(q.id, true)}
                              />
                            </ListGroup.Item>
                            <ListGroup.Item className="border-0 px-0">
                              <Form.Check
                                type="radio"
                                name={`q-${q.id}`}
                                id={`q-${q.id}-false`}
                                label="False"
                                checked={ans?.type === "TF" && ans.value === false}
                                disabled={disabledByLock(q.id)}
                                onChange={() => setTF(q.id, false)}
                              />
                            </ListGroup.Item>
                          </ListGroup>
                        )}

                        {q.kind === "FIB" && (
                          <>
                            <Form.Control
                              value={(ans?.type === "FIB" ? (ans.text ?? "") : "")}
                              onChange={(e) => setFIB(q.id, e.currentTarget.value)}
                              onBlur={() => {
                                const t = (answers[q.id]?.type === "FIB" ? (answers[q.id] as any).text : "") ?? "";
                                if (t.toString().trim().length > 0) {
                                  setFibCommitted(prev => ({ ...prev, [q.id]: true }));
                                }
                              }}
                              placeholder="Type your answer"
                              disabled={disabledByLock(q.id)}
                              className="mb-2"
                            />
                          </>
                        )}

                        {showAnsNow && (
                          <div className="mt-2 opacity-50">
                            {q.kind === "MC" && (
                              <div>
                                <span className="fw-semibold">Correct answer: </span>
                                <span className="fw-semibold text-success">
                                  {(() => {
                                    const oid = q.correct;
                                    const opt = q.options.find(o => o.id === oid);
                                    return opt?.text || "—";
                                  })()}
                                </span>
                              </div>
                            )}
                            {q.kind === "TF" && (
                              <div>
                                <span className="fw-semibold">Correct answer: </span>
                                <span className="fw-semibold text-success">
                                  {q.answer ? "True" : "False"}
                                </span>
                              </div>
                            )}
                            {q.kind === "FIB" && (
                              <div>
                                <span className="fw-semibold">Acceptable answers: </span>
                                <span className="fw-semibold text-success">
                                  {q.acceptableAnswers?.length ? q.acceptableAnswers.join(", ") : "—"}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="d-flex justify-content-between mt-3">
                          <Button variant="outline-secondary" type="button" disabled={currentIdx <= 0 || (!isFaculty && !running)}
                            onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}>
                            Previous
                          </Button>
                          <div className="d-flex gap-2">
                            {currentIdx < flatBase.length - 1 && (
                              <Button variant="outline-secondary" type="button" disabled={!isFaculty && !running}
                                onClick={() => setCurrentIdx(i => Math.min(flatBase.length - 1, i + 1))}>
                                Next
                              </Button>
                            )}
                            {currentIdx === flatBase.length - 1 && (
                              <Button variant="primary" type="submit" disabled={!isFaculty && !running}>Submit</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </Card.Body>
              </Card>
            ) : (
              <Card className="mb-3">
                <Card.Body>
                  <ListGroup variant="flush">
                    {flatBase.map((q, idx) => {
                      const ans = answers[q.id];
                      return (
                        <ListGroup.Item key={q.id} className="border-0 border-top py-3">
                          <div className="fw-semibold mb-2">
                            {idx + 1}. {q.questionText} <span className="text-muted">({q.points} pts)</span>
                          </div>

                          {q.kind === "MC" && (
                            <ListGroup>
                              {(mcOptionOrder[q.id] || q.options.map(o => o.id)).map((oid, i) => {
                                const opt = q.options.find(o => o.id === oid)!;
                                const checked = ans?.type === "MC" && ans.optionId === oid;
                                return (
                                  <ListGroup.Item key={oid} className="border-0 px-0">
                                    <Form.Check
                                      type="radio"
                                      name={`q-${q.id}`}
                                      id={`q-${q.id}-opt-${i}`}
                                      label={opt.text || `Option ${i + 1}`}
                                      checked={!!checked}
                                      disabled={disabledByLock(q.id)}
                                      onChange={() => setMC(q.id, oid)}
                                    />
                                  </ListGroup.Item>
                                );
                              })}
                            </ListGroup>
                          )}

                          {q.kind === "TF" && (
                            <ListGroup>
                              <ListGroup.Item className="border-0 px-0">
                                <Form.Check
                                  type="radio"
                                  name={`q-${q.id}`}
                                  id={`q-${q.id}-true`}
                                  label="True"
                                  checked={ans?.type === "TF" && ans.value === true}
                                  disabled={disabledByLock(q.id)}
                                  onChange={() => setTF(q.id, true)}
                                />
                              </ListGroup.Item>
                              <ListGroup.Item className="border-0 px-0">
                                <Form.Check
                                  type="radio"
                                  name={`q-${q.id}`}
                                  id={`q-${q.id}-false`}
                                  label="False"
                                  checked={ans?.type === "TF" && ans.value === false}
                                  disabled={disabledByLock(q.id)}
                                  onChange={() => setTF(q.id, false)}
                                />
                              </ListGroup.Item>
                            </ListGroup>
                          )}

                          {q.kind === "FIB" && (
                            <Form.Control
                              value={(ans?.type === "FIB" ? (ans.text ?? "") : "")}
                              onChange={(e) => setFIB(q.id, e.currentTarget.value)}
                              onBlur={() => {
                                const t = (answers[q.id]?.type === "FIB" ? (answers[q.id] as any).text : "") ?? "";
                                if (t.toString().trim().length > 0) {
                                  setFibCommitted(prev => ({ ...prev, [q.id]: true }));
                                }
                              }}
                              placeholder="Type your answer"
                              disabled={disabledByLock(q.id)}
                              className="mb-2"
                            />
                          )}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>

                  <div className="d-flex justify-content-end mt-3">
                    <Button variant="primary" type="submit" disabled={!isFaculty && !running}>Submit</Button>
                  </div>
                </Card.Body>
              </Card>
            )}
          </>
        )}
      </Form>
    </>
  );
}
