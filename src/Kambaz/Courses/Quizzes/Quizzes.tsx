import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Badge, Button, Col, Container, Dropdown, ListGroup, Row } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { IoMdArrowDropdown } from "react-icons/io";
import QuizControls from "./QuizControls";
import QuizControlButtons from "./QuizControlButtons";
import { useSelector, useDispatch } from "react-redux";
import * as api from "./client";
import { upsertQuiz } from "./reducer"
import { selectQuizzesForCourse, selectQuizSort, selectSelectedIds } from "./reducer";
import { useQuizActions } from "./useQuizActions";
import { FaPlus, FaQuestionCircle } from "react-icons/fa";
import ShowIfFaculty from "../../auth/ShowIfFaculty";
import useIsFaculty from "../../auth/useIsFaculty";
import { IoEllipsisVertical } from "react-icons/io5";
import { BiSolidTrashAlt } from "react-icons/bi";

export default function Quizzes() {
  const { courseId, cid } = useParams();
  const currentCourseId = courseId ?? cid ?? "";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { load, reorder, handleDeleteMany, fetchAttempts } = useQuizActions();
  const isFaculty = useIsFaculty();
  const quizzesRaw = useSelector((s: any) => selectQuizzesForCourse(s, currentCourseId));
  const { sortBy, asc } = useSelector(selectQuizSort);
  const selectedIds = useSelector(selectSelectedIds);
  const userId: string = useSelector((s: any) => s?.accountReducer?.currentUser?._id || s?.users?.current?._id || s?.auth?.user?._id) || "";
  const [search, setSearch] = useState("");
  const [maxScores, setMaxScores] = useState<Record<string, number | null>>({});

  useEffect(() => { if (currentCourseId) load(); }, [currentCourseId, sortBy, asc]);

  useEffect(() => {
    let cancelled = false;
    const loadMaxScores = async () => {
      if (!userId) return;
      const ids: string[] = (quizzesRaw ?? []).map((q: any) => q._id);
      if (!ids.length) {
        setMaxScores({});
        return;
      }
      try {
        const entries = await Promise.all(
          ids.map(async (qid) => {
            try {
              const data = await fetchAttempts(qid, userId);
              const maxVal = Number(data?.maxScoreAcrossAttempts);
              return [qid, Number.isFinite(maxVal) ? maxVal : null] as const;
            } catch {
              return [qid, null] as const;
            }
          })
        );
        if (cancelled) return;
        setMaxScores((prev) => {
          const next = { ...prev };
          for (const [qid, val] of entries) next[qid] = val;
          return next;
        });
      } catch {
      }
    };
    loadMaxScores();
    return () => { cancelled = true; };
  }, [quizzesRaw, userId, fetchAttempts]);

  const quizzes = useMemo(() => {
    const arr = quizzesRaw ?? [];
    const q = search.trim().toLowerCase();
    const filteredByRole = isFaculty ? arr : arr.filter((it: any) => !!it?.published);
    if (!q) return filteredByRole;
    return filteredByRole.filter((it: any) =>
      (it?.title ?? "").toLowerCase().includes(q) ||
      (it?.desc ?? "").toLowerCase().includes(q)
    );
  }, [quizzesRaw, search, isFaculty]);

  const [showQuizzes, setShowQuizzes] = useState(true);

  const handleAdd = async () => {
    const count = (quizzesRaw?.length ?? 0) + 1;
    const newId = `${currentCourseId}_Q${count}`;
    const newTitle = `Q${count} - New Quiz`;
    const payload = {
      _id: newId,
      course: currentCourseId,
      title: newTitle,
      desc: "",
      points: 0,
      questions: 0,
      timeLimit: 20,
      published: false,
      questionBank: { mc: [], tf: [], fib: [] },
    } as any;
    const saved = await api.createQuiz(currentCourseId, payload);
    dispatch(upsertQuiz({ courseId: currentCourseId, item: saved }));
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${saved._id}/Details`);
  };

  const handleDeleteSelected = () => { if (selectedIds.length) handleDeleteMany(selectedIds); };

  const availabilityInfo = (q: any) => {
    const now = new Date();
    const start = q?.startDate ? new Date(q.startDate) : undefined;
    const end = q?.endDate ? new Date(q.endDate) : undefined;
    if (start && now < start) {
      return { label: "Not available until:", value: q.startDate ?? "", cls: "", status: "notyet" as const };
    }
    if (end && now > end) {
      return { label: "Closed", value: "", cls: "text-danger", status: "closed" as const };
    }
    return { label: "Available:", value: q.startDate ?? "", cls: "text-success", status: "open" as const };
  };

  return (
    <Container className="m-2">
      <div id="wd-assignments">
        <QuizControls search={search} onSearchChange={setSearch} /><br /><br />
        <ListGroup.Item className="wd-module p-0 mb-5 fs-5 border-gray">
          <div className="wd-title p-3 ps-2 bg-secondary">
            <IoMdArrowDropdown
              className="me-2 fs-3"
              style={{ transform: showQuizzes ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 150ms ease" }}
              onClick={() => setShowQuizzes(!showQuizzes)}
              role="button"
              aria-label="Toggle quizzes"
              tabIndex={0}
            />
            QUIZZES
            <ShowIfFaculty>
              <Dropdown align="end" className="float-end d-inline-block">
                <Dropdown.Toggle as="span" bsPrefix=" " className="d-inline-flex align-items-center justify-content-center cursor-pointer" aria-label="Quiz actions">
                  <IoEllipsisVertical className="fs-4 m-1" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="rb-no-active-blue">
                  <Dropdown.Item as="button" className="text-body" onClick={handleAdd}>
                    <FaPlus className="fs-6 m-1" /> Add Quiz
                  </Dropdown.Item>
                  <Dropdown.Item as="button" className="text-body" onClick={handleDeleteSelected}>
                    <BiSolidTrashAlt className="text-danger fs-4 mb-1" /> Delete Quiz
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </ShowIfFaculty>
            <Button variant="secondary" size="sm" className="me-2 float-end" active>
              10% of Total
            </Button>
          </div>

          {showQuizzes && (
            <ListGroup className="wd-lessons rounded-0">
              {quizzes.map((quiz: any, idx: number) => (
                <span
                  key={quiz._id}
                  draggable={search === ""}
                  onDragStart={(e: React.DragEvent) => { e.dataTransfer.setData("text/plain", String(idx)); }}
                  onDragOver={(e: React.DragEvent) => { if (search === "") e.preventDefault(); }}
                  onDrop={(e: React.DragEvent) => {
                    if (search !== "") return;
                    e.preventDefault();
                    const from = Number(e.dataTransfer.getData("text/plain"));
                    if (!Number.isNaN(from) && from !== idx) reorder(from, idx);
                  }}
                >
                  <ListGroup.Item className="wd-lesson p-3 ps-1">
                    <Row className="align-items-center text-nowrap gx-3">
                      <Col xs="auto" className="d-flex align-items-center">
                        <ShowIfFaculty><BsGripVertical className="fs-3" /></ShowIfFaculty>
                        <FaQuestionCircle className="text-success fs-3 m-2" />
                      </Col>
                      <Col className="text-start overflow-hidden" style={{ minWidth: 0 }}>
                        {(() => {
                          const a = availabilityInfo(quiz);
                          const canOpen = isFaculty || (quiz.published && a.status === "open");
                          return (
                            <>
                              {canOpen ? (
                                <Link
                                  to={`/Kambaz/Courses/${currentCourseId}/Quizzes/${quiz._id}/Details`}
                                  className="fw-semibold text-truncate d-block text-dark text-decoration-none"
                                >
                                  {quiz.title}
                                </Link>
                              ) : (
                                <span className="fw-semibold text-truncate d-block">
                                  {quiz.title}
                                </span>
                              )}
                              <p className="mb-0 text-truncate small">
                                <b className={a.cls}>{a.label}</b> {a.value} {" | "} <b>Due: </b> {quiz.dueDate} <br />
                                {(() => {
                                  const max = maxScores[quiz._id];
                                  return (
                                    <>
                                      Points: {quiz.points} pts | Questions: {quiz.questions}
                                      {!isFaculty && (
                                        <>
                                          {" | "}
                                          <Badge bg="success" className="ms-2">
                                            Max Score: {max != null ? max : "—"}
                                          </Badge>
                                        </>
                                      )}
                                    </>
                                  );
                                })()}
                              </p>
                            </>
                          );
                        })()}
                      </Col>
                      <Col xs="auto" className="d-flex justify-content-end align-items-center">
                        <QuizControlButtons
                          quizId={quiz._id}
                          initialTitle={quiz.title}
                          published={!!quiz.published}
                          selected={selectedIds.includes(quiz._id)}
                        />
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </span>
              ))}
            </ListGroup>
          )}
        </ListGroup.Item>
      </div>
    </Container>
  );
}
