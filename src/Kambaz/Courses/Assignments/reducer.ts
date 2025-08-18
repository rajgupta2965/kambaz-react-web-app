import { createSlice } from "@reduxjs/toolkit";
import { assignments as dbAssignments } from "../../Database";
import { v4 as uuidv4 } from "uuid";

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
  assignments: dbAssignments as Assignment[],
};

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    addAssignment: (state, { payload }) => {
      const newAssignment: Assignment = {
        _id: uuidv4(),
        course: payload.course,
        title: payload.title ?? "New Assignment",
        desc: payload.desc ?? "",
        points: typeof payload.points === "number" ? payload.points : 100,
        assignType: cap(payload.assignType) as Assignment["assignType"],
        grade: payload.grade ?? "Grade",
        submissionType: payload.submissionType ?? "Online",
        assignTo: payload.assignTo ?? "Everyone",
        startDate: payload.startDate ?? "",
        endDate: payload.endDate ?? "",
      };
      state.assignments = [...state.assignments, newAssignment];
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
  addAssignment,
  updateAssignment,
  deleteAssignment,
  editAssignment,
  cancelEditAssignment,
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
