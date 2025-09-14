import { createSlice } from "@reduxjs/toolkit";

export type Assignment = {
  _id: string;
  course: string;
  title: string;
  desc?: string;
  points?: number;
  assignType: "Assignment" | "Quiz" | "Exam" | "Project";
  grade?: string;
  submissionType?: string;
  assignTo?: string;
  startDate?: string;
  endDate?: string;
  editing?: boolean;
  [key: string]: any;
};

const cap = (s?: string) =>
  (s ?? "Assignment").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());

const initialState: { assignments: Assignment[] } = {
  assignments: [],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    setAssignments: (state, { payload }) => {
      state.assignments = payload ?? [];
    },
    addAssignment: (state, { payload }) => {
      state.assignments = [...state.assignments, payload];
    },
    updateAssignment: (state, { payload }) => {
      state.assignments = state.assignments.map((a) =>
        a._id === payload._id
          ? {
              ...a,
              ...payload,
              assignType: payload.assignType
                ? (cap(payload.assignType) as Assignment["assignType"])
                : a.assignType,
            }
          : a
      );
    },
    deleteAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.filter((a) => a._id !== assignmentId);
    },
    editAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignmentId ? { ...a, editing: true } : a
      );
    },
    cancelEditAssignment: (state, { payload: assignmentId }) => {
      state.assignments = state.assignments.map((a) =>
        a._id === assignmentId ? { ...a, editing: false } : a
      );
    },
  },
});

export const {
  setAssignments,
  addAssignment,
  updateAssignment,
  deleteAssignment,
  editAssignment,
  cancelEditAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
