import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { courses as dbCourses, enrollments as dbEnrollments } from "../Database";

export type Course = {
  _id: string;
  name: string;
  number?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  image?: string;
  [key: string]: any;
};

type Enrollment = { _id: string; user: string; course: string };

type CoursesState = {
  courses: Course[];
  enrollments: Enrollment[];
};

const initialState: CoursesState = {
  courses: (dbCourses as Course[]) ?? [],
  enrollments: (dbEnrollments as Enrollment[]) ?? [],
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    addCourse: (state, { payload }: PayloadAction<Partial<Course>>) => {
      const _id = payload._id && payload._id !== "new" ? payload._id : uuidv4();
      const newCourse: Course = {
        ...payload,
        _id,
        name: payload.name ?? "New Course",
        number: payload.number ?? "New Number",
        startDate: payload.startDate ?? "",
        endDate: payload.endDate ?? "",
        description: payload.description ?? "",
        image: payload.image === "" ? "" : (payload.image ?? "reactjs.jpg"),
      };
      state.courses = [...state.courses, newCourse];
    },

    updateCourse: (state, { payload }: PayloadAction<Course>) => {
      if (!payload?._id) return;
      state.courses = state.courses.map((c) =>
        c._id === payload._id ? { ...c, ...payload } : c
      );
    },

    deleteCourse: (state, { payload: courseId }: PayloadAction<string>) => {
      state.courses = state.courses.filter((c) => c._id !== courseId);
      state.enrollments = state.enrollments.filter((e) => e.course !== courseId);
    },

    enroll: (
      state, { payload }: PayloadAction<{ userId: string; courseId: string }>) => {
      const { userId, courseId } = payload;
      const exists = state.enrollments.some(
        (e) => e.user === userId && e.course === courseId
      );
      if (!exists) {
        state.enrollments = [
          ...state.enrollments,
          { _id: uuidv4(), user: userId, course: courseId },
        ];
      }
    },

    unenroll: (
      state, { payload }: PayloadAction<{ userId: string; courseId: string }>) => {
      const { userId, courseId } = payload;
      state.enrollments = state.enrollments.filter(
        (e) => !(e.user === userId && e.course === courseId)
      );
    },
  },
});

export const { addCourse, updateCourse, deleteCourse, enroll, unenroll } = coursesSlice.actions;
export default coursesSlice.reducer;
