import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const MODULES_API = `${REMOTE_SERVER}/api/modules`;

export const updateModule = async (module: any) => {
  const { data } = await axiosWithCredentials.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

export const deleteModule = async (moduleId: string) => {
  const { data } = await axiosWithCredentials.delete(`${MODULES_API}/${moduleId}`);
  return data;
};

export const createLessonForModule = async (moduleId: string, lesson: any) => {
  const { data } = await axiosWithCredentials.post(`${MODULES_API}/${moduleId}/lessons`, lesson);
  return data;
};

export const updateLesson = async (
  moduleId: string,
  lessonId: string,
  updates: any
) => {
  const { data } = await axiosWithCredentials.put(
    `${MODULES_API}/${moduleId}/lessons/${lessonId}`,
    updates
  );
  return data;
};

export const deleteLesson = async (moduleId: string, lessonId: string) => {
  const { data } = await axiosWithCredentials.delete(
    `${MODULES_API}/${moduleId}/lessons/${lessonId}`
  );
  return data;
};