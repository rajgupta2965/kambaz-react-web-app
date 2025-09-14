import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Lesson = { _id: string; name: string; description?: string; module?: string };
type Module = {
  editing?: boolean;
  _id: string;
  name: string;
  description?: string;
  course: string;
  lessons?: Lesson[];
};

type ModulesState = {
  modules: Module[];
};

const initialState: ModulesState = {
  modules: [],
};

const findModuleIndex = (state: ModulesState, moduleId: string) =>
  state.modules.findIndex((m) => m._id === moduleId);

const findLessonIndex = (mod: Module, lessonId: string) =>
  (mod.lessons ?? []).findIndex((l) => l._id === lessonId);

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    setModules: (state, { payload }: PayloadAction<Module[]>) => {
      state.modules = payload ?? [];
    },
    addModule: (state, { payload }: PayloadAction<Module>) => {
      state.modules = [{ ...payload, lessons: payload.lessons ?? [] }, ...state.modules];
    },
    editModule: (state, { payload }: PayloadAction<string>) => {
      const i = findModuleIndex(state, payload);
      if (i >= 0) state.modules[i].editing = true;
    },
    updateModule: (state, { payload }: PayloadAction<Module>) => {
      const i = findModuleIndex(state, payload._id);
      if (i >= 0) state.modules[i] = { ...state.modules[i], ...payload };
    },
    deleteModule: (state, { payload }: PayloadAction<string>) => {
      state.modules = state.modules.filter((m) => m._id !== payload);
    },

    setLessonsForModule: (
      state,
      { payload }: PayloadAction<{ moduleId: string; lessons: Lesson[] }>
    ) => {
      const { moduleId, lessons } = payload;
      const i = findModuleIndex(state, moduleId);
      if (i >= 0) state.modules[i].lessons = lessons ?? [];
    },
    addLessonToModule: (
      state,
      { payload }: PayloadAction<{ moduleId: string; lesson: Lesson }>
    ) => {
      const { moduleId, lesson } = payload;
      const i = findModuleIndex(state, moduleId);
      if (i >= 0) {
        const list = state.modules[i].lessons ?? [];
        state.modules[i].lessons = [...list, lesson];
      }
    },
    updateLesson: (
      state,
      {
        payload,
      }: PayloadAction<{ moduleId: string; lessonId: string; name?: string; description?: string }>
    ) => {
      const { moduleId, lessonId, ...patch } = payload;
      const i = findModuleIndex(state, moduleId);
      if (i >= 0) {
        const j = findLessonIndex(state.modules[i], lessonId);
        if (j >= 0) {
          state.modules[i].lessons![j] = { ...state.modules[i].lessons![j], ...patch };
        }
      }
    },
    deleteLesson: (
      state,
      { payload }: PayloadAction<{ moduleId: string; lessonId: string }>
    ) => {
      const { moduleId, lessonId } = payload;
      const i = findModuleIndex(state, moduleId);
      if (i >= 0) {
        state.modules[i].lessons = (state.modules[i].lessons ?? []).filter(
          (l) => l._id !== lessonId
        );
      }
    },
  },
});

export const {
  setModules,
  addModule,
  editModule,
  updateModule,
  deleteModule,
  setLessonsForModule,
  addLessonToModule,
  updateLesson,
  deleteLesson,
} = modulesSlice.actions;

export default modulesSlice.reducer;
