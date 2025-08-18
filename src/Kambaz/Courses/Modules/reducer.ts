import { createSlice } from "@reduxjs/toolkit";
import { modules } from "../../Database";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  modules: modules,
};

const modulesSlice = createSlice({
  name: "modules",
  initialState,
  reducers: {
    addModule: (state, { payload: module }) => {
      const newModule: any = {
        _id: uuidv4(),
        lessons: [],
        name: module.name,
        course: module.course,
      };
      state.modules = [...state.modules, newModule] as any;
    },
    deleteModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.filter(
        (m: any) => m._id !== moduleId
      );
    },
    updateModule: (state, { payload: module }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === module._id ? module : m
      ) as any;
    },
    editModule: (state, { payload: moduleId }) => {
      state.modules = state.modules.map((m: any) =>
        m._id === moduleId ? { ...m, editing: true } : m
      ) as any;
    },
    addLessonToModule: (state, { payload }) => {
      const { moduleId, name } = payload as { moduleId: string; name?: string };
      const mod: any = state.modules.find((m: any) => m._id === moduleId);
      if (!mod) return;
      const newLesson = {
        _id: uuidv4(),
        name: (name && name.trim()) || "New Lesson",
        description: "",
        module: moduleId,
      };
      if (!Array.isArray(mod.lessons)) mod.lessons = [];
      mod.lessons.push(newLesson);
    },
    updateLesson: (state, { payload }: { payload: { moduleId: string; lessonId: string; name?: string; description?: string } }) => {
      const { moduleId, lessonId, name, description } = payload;
      const mod: any = state.modules.find((m: any) => m._id === moduleId);
      if (!mod || !Array.isArray(mod.lessons)) return;
      mod.lessons = mod.lessons.map((l: any) =>
        l._id === lessonId ? { ...l, ...(name != null ? { name } : {}), ...(description != null ? { description } : {}) } : l
      );
    },
    deleteLesson: (state, { payload }: { payload: { moduleId: string; lessonId: string } }) => {
      const { moduleId, lessonId } = payload;
      const mod: any = state.modules.find((m: any) => m._id === moduleId);
      if (!mod || !Array.isArray(mod.lessons)) return;
      mod.lessons = mod.lessons.filter((l: any) => l._id !== lessonId);
    },
  },
});

export const {
  addModule,
  deleteModule,
  updateModule,
  editModule,
  addLessonToModule,
  updateLesson,
  deleteLesson,  
} = modulesSlice.actions;

export default modulesSlice.reducer;
