import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;
const LESSONS_API = `${REMOTE_SERVER}/api/lessons`;

export const deleteModule = async (moduleId: string) => {
  const response = await axios.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};

export const updateModule = async (module: any) => {
  const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

//LESSONS
export const findLessonsForModule = async (moduleId: string) => {
  const { data } = await axios.get(`${MODULES_API}/${moduleId}/lessons`);
  return data;
};

export const createLessonForModule = async (
  moduleId: string,
  lesson: { name: string; description?: string }
) => {
  const { data } = await axios.post(`${MODULES_API}/${moduleId}/lessons`, lesson);
  return data;
};

export const updateLessonById = async (
  lessonId: string,
  updates: { name?: string; description?: string }
) => {
  const { data } = await axios.put(`${LESSONS_API}/${lessonId}`, updates);
  return data;
};

export const deleteLessonById = async (lessonId: string) => {
  const { data } = await axios.delete(`${LESSONS_API}/${lessonId}`);
  return data;
};