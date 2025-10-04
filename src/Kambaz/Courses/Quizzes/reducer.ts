import { createSlice, type PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { Quiz, SortKey, QuestionBank } from "./client";
export type DraftQuiz = Required<Pick<Quiz, "_id">> & Quiz & {questionBank: QuestionBank;};

type QuizzesState = {
  byCourse: Record<string, Quiz[]>;
  selectedIds: string[];
  sortBy: SortKey;
  asc: boolean;
  drafts?: Record<string, DraftQuiz>;
};

const initialState: QuizzesState = {
  byCourse: {},
  selectedIds: [],
  sortBy: "manual",
  asc: true,
  drafts: {},
};

const computeTotals = (bank: QuestionBank) => {
  const mc = bank?.mc ?? [];
  const tf = bank?.tf ?? [];
  const fib = bank?.fib ?? [];
  const totalQuestions = mc.length + tf.length + fib.length;
  const sum = (arr: any[]) =>
    arr.reduce((s, q) => s + (typeof q?.points === "number" ? q.points : 0), 0);
  const totalPoints = sum(mc) + sum(tf) + sum(fib);
  return { totalQuestions, totalPoints };
};

const slice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes(state, action: PayloadAction<{ courseId: string; items: Quiz[] }>) {
      state.byCourse[action.payload.courseId] = action.payload.items ?? [];
      state.selectedIds = state.selectedIds.filter((id) =>
        state.byCourse[action.payload.courseId].some((q) => q._id === id)
      );
    },
    upsertQuiz(state, action: PayloadAction<{ courseId: string; item: Quiz }>) {
      const arr = state.byCourse[action.payload.courseId] ?? [];
      const idx = arr.findIndex((q) => q._id === action.payload.item._id);
      if (idx >= 0) arr[idx] = { ...arr[idx], ...action.payload.item };
      else arr.push(action.payload.item);
      state.byCourse[action.payload.courseId] = arr;

      const q = action.payload.item;
      if (q._id && state.drafts?.[q._id]) {
        const existing = state.drafts[q._id]!;
        state.drafts[q._id] = {
          ...existing,
          ...q,
          questionBank: existing.questionBank ?? (q.questionBank as QuestionBank) ?? existing.questionBank,
          _id: q._id,
        };
      }
    },
    removeQuiz(state, action: PayloadAction<{ courseId: string; id: string }>) {
      const arr = state.byCourse[action.payload.courseId] ?? [];
      state.byCourse[action.payload.courseId] = arr.filter((q) => q._id !== action.payload.id);
      state.selectedIds = state.selectedIds.filter((x) => x !== action.payload.id);

      if (state.drafts && state.drafts[action.payload.id]) {
        delete state.drafts[action.payload.id];
      }
    },
    removeMany(state, action: PayloadAction<{ courseId: string; ids: string[] }>) {
      const set = new Set(action.payload.ids);
      const arr = state.byCourse[action.payload.courseId] ?? [];
      state.byCourse[action.payload.courseId] = arr.filter((q) => !set.has(q._id!));
      state.selectedIds = state.selectedIds.filter((x) => !set.has(x));

      for (const id of set) {
        if (state.drafts && state.drafts[id]) delete state.drafts[id];
      }
    },
    setSort(state, action: PayloadAction<{ sortBy: SortKey; asc: boolean }>) {
      state.sortBy = action.payload.sortBy;
      state.asc = action.payload.asc;
    },
    toggleSelectOne(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.selectedIds.includes(id)) {
        state.selectedIds = state.selectedIds.filter((x) => x !== id);
      } else {
        state.selectedIds.push(id);
      }
    },
    clearSelection(state) {
      state.selectedIds = [];
    },
    setPublished(state, action: PayloadAction<{ courseId: string; id: string; published: boolean }>) {
      const arr = state.byCourse[action.payload.courseId] ?? [];
      const i = arr.findIndex((q) => q._id === action.payload.id);
      if (i >= 0) arr[i] = { ...arr[i], published: action.payload.published };
    },
    setManyPublished(
      state,
      action: PayloadAction<{ courseId: string; ids: string[]; published: boolean }>
    ) {
      const set = new Set(action.payload.ids);
      const arr = state.byCourse[action.payload.courseId] ?? [];
      arr.forEach((q) => {
        if (q._id && set.has(q._id)) q.published = action.payload.published;
      });
    },
    setAllPublished(state, action: PayloadAction<{ courseId: string; published: boolean }>) {
      const arr = state.byCourse[action.payload.courseId] ?? [];
      arr.forEach((q) => (q.published = action.payload.published));
    },
    applyLocalReorder(
      state,
      action: PayloadAction<{ courseId: string; from: number; to: number }>
    ) {
      const arr = state.byCourse[action.payload.courseId] ?? [];
      const copy = [...arr];
      const [moved] = copy.splice(action.payload.from, 1);
      copy.splice(action.payload.to, 0, moved);
      copy.forEach((q, idx) => (q._order = idx));
      state.byCourse[action.payload.courseId] = copy;
    },

    setQuestionBank(state, action: PayloadAction<{ quizId: string; bank: QuestionBank }>) {
      const { quizId, bank } = action.payload;
      for (const courseId of Object.keys(state.byCourse)) {
        const arr = state.byCourse[courseId] || [];
        const idx = arr.findIndex((q) => q._id === quizId);
        if (idx >= 0) {
          const { totalQuestions, totalPoints } = computeTotals(bank);
          arr[idx] = {
            ...arr[idx],
            questionBank: bank,
            questions: totalQuestions,
            points: totalPoints,
          };
          break;
        }
      }
      if (state.drafts && state.drafts[quizId]) {
        const { totalQuestions, totalPoints } = computeTotals(bank);
        state.drafts[quizId] = {
          ...state.drafts[quizId]!,
          questionBank: bank,
          _id: quizId,
          questions: totalQuestions,
          points: totalPoints,
        };
      }
    },

    startDraft(state, action: PayloadAction<{ quizId: string }>) {
      const { quizId } = action.payload;
      if (!state.drafts) state.drafts = {};
      let base: Quiz | undefined;
      for (const arr of Object.values(state.byCourse)) {
        const found = (arr as Quiz[]).find((q) => q._id === quizId);
        if (found) {
          base = found;
          break;
        }
      }
      if (!base) return;
      const bank: QuestionBank =
        (base.questionBank as QuestionBank) ??
        ({ mc: [], tf: [], fib: [] } as QuestionBank);
      state.drafts[quizId] = {
        ...(base as Quiz),
        _id: quizId,
        questionBank: JSON.parse(JSON.stringify(bank)),
      };
    },

    patchDraft(state, action: PayloadAction<{ quizId: string; patch: Partial<DraftQuiz> }>) {
      const { quizId, patch } = action.payload;
      if (!state.drafts?.[quizId]) return;
      state.drafts[quizId] = {
        ...state.drafts[quizId]!,
        ...patch,
        _id: quizId,
        questionBank: state.drafts[quizId]!.questionBank,
      };
    },

    setDraftBank(state, action: PayloadAction<{ quizId: string; bank: QuestionBank }>) {
      const { quizId, bank } = action.payload;
      if (!state.drafts?.[quizId]) return;
      state.drafts[quizId] = {
        ...state.drafts[quizId]!,
        questionBank: JSON.parse(JSON.stringify(bank)),
        _id: quizId,
      };
    },

    clearDraft(state, action: PayloadAction<{ quizId: string }>) {
      const { quizId } = action.payload;
      if (state.drafts && state.drafts[quizId]) delete state.drafts[quizId];
    },
  },
});

export const {
  setQuizzes,
  upsertQuiz,
  removeQuiz,
  removeMany,
  setSort,
  toggleSelectOne,
  clearSelection,
  setPublished,
  setManyPublished,
  setAllPublished,
  applyLocalReorder,
  setQuestionBank,
  startDraft,
  patchDraft,
  setDraftBank,
  clearDraft,
} = slice.actions;

export default slice.reducer;

const fallbackSlice: QuizzesState = initialState;
export const selectSlice = (s: any): QuizzesState => {
  const q = s?.quizzes;
  if (q && q.byCourse && q.selectedIds) return q as QuizzesState;
  for (const v of Object.values(s || {})) {
    if (v && (v as any).byCourse && (v as any).selectedIds && (v as any).sortBy !== undefined) {
      return v as QuizzesState;
    }
  }
  return fallbackSlice;
};

export const selectQuizSort = (s: any) => {
  const sl = selectSlice(s);
  return { sortBy: (sl.sortBy ?? "manual") as SortKey, asc: !!sl.asc };
};

export const selectSelectedIds = (s: any) => selectSlice(s).selectedIds ?? [];

export const selectQuizzesForCourse = createSelector(
  [(s: any, courseId: string) => selectSlice(s).byCourse?.[courseId] ?? []],
  (arr) => arr
);

export const selectQuizById = (s: any, quizId: string): Quiz | undefined => {
  const sl = selectSlice(s);
  for (const arr of Object.values(sl.byCourse)) {
    const list = arr as Quiz[];
    const found = list.find((q) => q._id === quizId);
    if (found) return found;
  }
  return undefined;
};

export const selectQuestionBank = (s: any, quizId: string): QuestionBank | undefined =>
  selectQuizById(s, quizId)?.questionBank as QuestionBank | undefined;

export const selectDraftByQuizId = (s: any, quizId: string): DraftQuiz | undefined =>
  selectSlice(s).drafts?.[quizId];

export const selectDraftBank = (s: any, quizId: string): QuestionBank | undefined =>
  selectSlice(s).drafts?.[quizId]?.questionBank;
