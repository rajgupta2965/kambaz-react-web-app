import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "./client";
import {
  setQuizzes, upsertQuiz, removeQuiz, removeMany, setSort, toggleSelectOne as toggleSelectOneAction, clearSelection,
  setPublished, setManyPublished, setAllPublished, applyLocalReorder, setQuestionBank, startDraft, patchDraft,
  setDraftBank, clearDraft, selectQuizSort, selectQuizzesForCourse, selectDraftByQuizId, selectDraftBank,
} from "./reducer";

export function useQuizActions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId, cid } = useParams();
  const currentCourseId = courseId ?? cid ?? "";
  const { sortBy, asc } = useSelector(selectQuizSort);
  const currentQuizzes = useSelector((s: any) => selectQuizzesForCourse(s, currentCourseId)) || [];
  const currentUserId =
    useSelector((s: any) =>
      s?.accountReducer?.currentUser?._id ||
      s?.users?.current?._id ||
      s?.account?.currentUser?._id ||
      s?.auth?.user?._id
    ) || "";
  const sortStorageKey = `quizzes:sort:${currentCourseId}`;

  const loadSavedSort = () => {
    try { return JSON.parse(localStorage.getItem(sortStorageKey) || "null"); } catch { return null; }
  };

  const saveSort = (v: { sortBy: any; asc: boolean }) => {
    try { localStorage.setItem(sortStorageKey, JSON.stringify(v)); } catch { }
  };

  const load = useCallback(async () => {
    if (!currentCourseId) return;
    const saved = loadSavedSort() as { sortBy?: any; asc?: boolean } | null;
    const effSortBy = saved?.sortBy ?? sortBy;
    const effAsc = typeof saved?.asc === "boolean" ? saved!.asc : asc;
    if (saved && (saved.sortBy !== sortBy || saved.asc !== asc)) {
      dispatch(setSort({ sortBy: effSortBy, asc: effAsc }));
    }
    const items = await api.fetchQuizzes(currentCourseId, effSortBy, effAsc);
    dispatch(setQuizzes({ courseId: currentCourseId, items }));
  }, [currentCourseId, sortBy, asc, dispatch]);

  const saveQuiz = useCallback(async (q: api.Quiz) => {
    if (!currentCourseId) return;
    const saved = q._id ? await api.updateQuiz(q._id, q) : await api.createQuiz(currentCourseId, q);
    dispatch(upsertQuiz({ courseId: currentCourseId, item: saved }));
    return saved;
  }, [currentCourseId, dispatch]);

  const handleEdit = useCallback((quizId: string) => {
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${quizId}/Editor`);
  }, [navigate, currentCourseId]);

  const handleDelete = useCallback(async (quizId: string) => {
    await api.deleteQuiz(quizId);
    dispatch(removeQuiz({ courseId: currentCourseId, id: quizId }));
  }, [dispatch, currentCourseId]);

  const handleDeleteMany = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
    await api.deleteMany(ids);
    dispatch(removeMany({ courseId: currentCourseId, ids }));
  }, [dispatch, currentCourseId]);

  const handleCopy = useCallback(async (quizId: string) => {
    const copy = await api.copyQuiz(quizId);
    dispatch(upsertQuiz({ courseId: currentCourseId, item: copy }));
  }, [dispatch, currentCourseId]);

  const handlePublishToggle = useCallback(async (quizId: string, published: boolean) => {
    const saved = await api.updateQuiz(quizId, { published });
    dispatch(setPublished({ courseId: currentCourseId, id: quizId, published: !!saved.published }));
  }, [dispatch, currentCourseId]);

  const handlePublishMany = useCallback(async (ids: string[], published: boolean) => {
    if (!ids.length) return;
    await api.publishMany(ids, published);
    dispatch(setManyPublished({ courseId: currentCourseId, ids, published }));
  }, [dispatch, currentCourseId]);

  const handlePublishAll = useCallback(async () => {
    await api.publishAll(currentCourseId);
    dispatch(setAllPublished({ courseId: currentCourseId, published: true }));
  }, [dispatch, currentCourseId]);

  const handleUnpublishAll = useCallback(async () => {
    await api.unpublishAll(currentCourseId);
    dispatch(setAllPublished({ courseId: currentCourseId, published: false }));
  }, [dispatch, currentCourseId]);

  const reorder = useCallback(async (fromIdx: number, toIdx: number) => {
    dispatch(applyLocalReorder({ courseId: currentCourseId, from: fromIdx, to: toIdx }));
    const arr = [...currentQuizzes];
    const [moved] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, moved);
    const orderedIds = arr.map(q => q._id!).filter(Boolean);
    await api.reorderQuizzes(currentCourseId, orderedIds);
    saveSort({ sortBy: "manual", asc: true });
    dispatch(setSort({ sortBy: "manual", asc: true }));
    const fresh = await api.fetchQuizzes(currentCourseId, "manual", true);
    dispatch(setQuizzes({ courseId: currentCourseId, items: fresh }));
  }, [dispatch, currentCourseId, currentQuizzes]);

  const setSortKey = (key: any, defaultAsc: boolean) => {
    const nextAsc = sortBy === key ? !asc : defaultAsc;
    saveSort({ sortBy: key, asc: nextAsc });
    dispatch(setSort({ sortBy: key, asc: nextAsc }));
  };

  const sortByName = () => setSortKey("name", true);
  const sortByAvailable = () => setSortKey("available", true);
  const sortByDue = () => setSortKey("due", true);
  const sortByPoints = () => setSortKey("points", false);
  const sortByQuestions = () => setSortKey("questions", false);
  const toggleSelectOne = (id: string) => dispatch(toggleSelectOneAction(id));
  const clearSelected = () => dispatch(clearSelection());
  const loadQuestionBank = useCallback(async (quizId: string) => {
    const bank = await api.fetchQuestionBank(quizId);
    dispatch(setQuestionBank({ quizId, bank }));
    return bank;
  }, [dispatch]);

  const createQuestion = useCallback(async (quizId: string, question: api.MCQuestion | api.TFQuestion | api.FIBQuestion) => {
    const updated = await api.createQuestion(quizId, question);
    const course = updated.courseId || updated.course || currentCourseId;
    dispatch(upsertQuiz({ courseId: course, item: updated }));
    if (updated._id && updated.questionBank) {
      dispatch(setQuestionBank({ quizId: updated._id, bank: updated.questionBank as any }));
    }
    return updated;
  }, [dispatch, currentCourseId]);

  const updateQuestion = useCallback(async (quizId: string, type: api.QuestionType, questionId: string, updates: Partial<api.MCQuestion | api.TFQuestion | api.FIBQuestion>) => {
    const updated = await api.updateQuestion(quizId, type, questionId, updates);
    const course = updated.courseId || updated.course || currentCourseId;
    dispatch(upsertQuiz({ courseId: course, item: updated }));
    if (updated._id && updated.questionBank) {
      dispatch(setQuestionBank({ quizId: updated._id, bank: updated.questionBank as any }));
    }
    return updated;
  }, [dispatch, currentCourseId]);

  const deleteQuestionById = useCallback(async (quizId: string, type: api.QuestionType, questionId: string) => {
    const updated = await api.deleteQuestionById(quizId, type, questionId);
    const course = updated.courseId || updated.course || currentCourseId;
    dispatch(upsertQuiz({ courseId: course, item: updated }));
    if (updated._id && updated.questionBank) {
      dispatch(setQuestionBank({ quizId: updated._id, bank: updated.questionBank as any }));
    }
    return updated;
  }, [dispatch, currentCourseId]);

  const addMcOption = useCallback(async (quizId: string, questionId: string, opt: { text: string; id?: string }) => {
    const updated = await api.addMcOption(quizId, questionId, opt);
    const course = updated.courseId || updated.course || currentCourseId;
    dispatch(upsertQuiz({ courseId: course, item: updated }));
    if (updated._id && updated.questionBank) {
      dispatch(setQuestionBank({ quizId: updated._id, bank: updated.questionBank as any }));
    }
    return updated;
  }, [dispatch, currentCourseId]);

  const updateMcOption = useCallback(async (quizId: string, questionId: string, optionId: string, updates: { text?: string }) => {
    const updated = await api.updateMcOption(quizId, questionId, optionId, updates);
    const course = updated.courseId || updated.course || currentCourseId;
    dispatch(upsertQuiz({ courseId: course, item: updated }));
    if (updated._id && updated.questionBank) {
      dispatch(setQuestionBank({ quizId: updated._id, bank: updated.questionBank as any }));
    }
    return updated;
  }, [dispatch, currentCourseId]);

  const deleteMcOption = useCallback(async (quizId: string, questionId: string, optionId: string) => {
    const updated = await api.deleteMcOption(quizId, questionId, optionId);
    const course = updated.courseId || updated.course || currentCourseId;
    dispatch(upsertQuiz({ courseId: course, item: updated }));
    if (updated._id && updated.questionBank) {
      dispatch(setQuestionBank({ quizId: updated._id, bank: updated.questionBank as any }));
    }
    return updated;
  }, [dispatch, currentCourseId]);

  const beginDraft = useCallback(async (quizId: string) => {
    try { await loadQuestionBank(quizId); } catch { }
    dispatch(startDraft({ quizId }));
  }, [dispatch, loadQuestionBank]);

  const updateDraftMeta = useCallback((quizId: string, patch: Partial<api.Quiz>) => {
    dispatch(patchDraft({ quizId, patch } as any));
  }, [dispatch]);

  const replaceDraftBank = useCallback((quizId: string, bank: api.QuestionBank) => {
    dispatch(setDraftBank({ quizId, bank }));
  }, [dispatch]);

  const saveDraft = useCallback(async (quizId: string, full: api.Quiz) => {
    const saved = await api.saveQuizAll(quizId, full);
    const course = saved.courseId || saved.course || currentCourseId;
    dispatch(upsertQuiz({ courseId: course, item: saved }));
    if (saved._id && saved.questionBank) {
      dispatch(setQuestionBank({ quizId: saved._id, bank: saved.questionBank as any }));
    }
    dispatch(clearDraft({ quizId }));
    return saved;
  }, [dispatch, currentCourseId]);

  const submitAttempt = useCallback(async (payload: api.AttemptSubmitRequest) => {
    let quizType = payload.quizType;
    if (!quizType) {
      const local = currentQuizzes.find((q) => q._id === payload.quizId)?.quizType;
      if (local) {
        quizType = local;
      } else {
        try {
          const q = await api.fetchQuizById(payload.quizId);
          quizType = q.quizType;
        } catch {
        }
      }
    }
    const withUser = payload.userId ? payload : { ...payload, userId: currentUserId };
    if (!withUser.userId) {
      console.warn("[useQuizActions.submitAttempt] Missing userId; request will fail", { payload });
    }
    return api.submitAttempt(withUser.quizId, { ...withUser, quizType });
  }, [currentQuizzes]);

  const fetchAttempts = useCallback(async (quizId: string, userId: string) => {
    return api.fetchAttempts(quizId, userId);
  }, []);

  return {
    load,
    saveQuiz,
    handleEdit,
    handleDelete,
    handleDeleteMany,
    handleCopy,
    handlePublishToggle,
    handlePublishMany,
    handlePublishAll,
    handleUnpublishAll,
    reorder,
    sortByName,
    sortByAvailable,
    sortByDue,
    sortByPoints,
    sortByQuestions,
    toggleSelectOne,
    clearSelected,
    loadQuestionBank,
    createQuestion,
    updateQuestion,
    deleteQuestionById,
    addMcOption,
    updateMcOption,
    deleteMcOption,
    beginDraft,
    updateDraftMeta,
    replaceDraftBank,
    saveDraft,
    selectDraftByQuizId,
    selectDraftBank,
    submitAttempt,
    fetchAttempts,
  };
}
