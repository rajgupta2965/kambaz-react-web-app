import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;
const API = `${REMOTE_SERVER}/api`;

export type Quiz = {
  _id?: string;
  course?: string;
  courseId?: string;
  title?: string;
  desc?: string;
  submissionType?: string;
  gradeType?: string;
  assignType?: string;
  quizType?: "Graded Quiz" | "Practice Quiz" | "Graded Survey" | "Ungraded Survey";
  points?: number;
  questions?: number;
  timeLimit?: number;
  showOneQuestion?: boolean;
  showAnswers?: boolean;
  showAnswersWhen?: "afterEach" | "atEnd";
  shuffleQuestions?: boolean;
  shuffleAnswers?: boolean;
  lockQuestionsAfterAnswering?: boolean;
  multipleAttempts?: boolean;
  noOfAttempts?: number;
  webcamRequired?: boolean;
  accessCode?: string;
  assignTo?: string;
  startDate?: string;
  dueDate?: string;
  endDate?: string;
  published?: boolean;
  _order?: number;
  questionBank?: QuestionBank
};

export type SortKey = "manual" | "name" | "available" | "due" | "points" | "questions";

export const fetchQuizzes = async (courseId: string, sortBy: SortKey, asc: boolean) => {
  const { data } = await axiosWithCredentials.get<Quiz[]>(
    `${API}/courses/${courseId}/quizzes`,
    { params: { sort: sortBy, asc } }
  );
  return data;
};

export const fetchQuizById = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get<Quiz>(`${API}/quizzes/${quizId}`);
  return data;
};

export const createQuiz = async (courseId: string, quiz: Quiz) => {
  const { data } = await axiosWithCredentials.post<Quiz>(`${API}/courses/${courseId}/quizzes`, quiz);
  return data;
};

export const updateQuiz = async (quizId: string, updates: Quiz) => {
  const { data } = await axiosWithCredentials.put<Quiz>(`${API}/quizzes/${quizId}`, updates);
  return data;
};

export const saveQuizAll = async (quizId: string, full: Quiz) => {
  return updateQuiz(quizId, full);
};

export const deleteQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.delete<{ deleted: boolean }>(`${API}/quizzes/${quizId}`);
  return data;
};

export const copyQuiz = async (quizId: string) => {
  const { data } = await axiosWithCredentials.post<Quiz>(`${API}/quizzes/${quizId}/copy`, {});
  return data;
};

export const deleteMany = async (ids: string[]) => {
  const { data } = await axiosWithCredentials.post<{ deleted: number }>(`${API}/quizzes/bulk-delete`, { ids });
  return data;
};

export const publishMany = async (ids: string[], published: boolean) => {
  const { data } = await axiosWithCredentials.post<{ modified: number }>(`${API}/quizzes/bulk-publish`, { ids, published });
  return data;
};

export const publishAll = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post<{ modified: number }>(`${API}/courses/${courseId}/quizzes/publish-all`, {});
  return data;
};

export const unpublishAll = async (courseId: string) => {
  const { data } = await axiosWithCredentials.post<{ modified: number }>(`${API}/courses/${courseId}/quizzes/unpublish-all`, {});
  return data;
};

export const reorderQuizzes = async (courseId: string, orderedIds: string[]) => {
  const { data } = await axiosWithCredentials.post<{ modified: number }>(`${API}/courses/${courseId}/quizzes/reorder`, { orderedIds });
  return data;
};

export type QuestionType = "MC" | "TF" | "FIB";
export type MCOption = { id?: string; text: string };

export type MCQuestion = {
  type: "MC";
  id?: string;
  questionText: string;
  points?: number;
  options: MCOption[];
  correct?: string;
};

export type TFQuestion = {
  type: "TF";
  id?: string;
  questionText: string;
  points?: number;
  answer: boolean;
};

export type FIBQuestion = {
  type: "FIB";
  id?: string;
  questionText: string;
  points?: number;
  acceptableAnswers: string[];
};

export type QuestionBank = {
  mc: MCQuestion[];
  tf: TFQuestion[];
  fib: FIBQuestion[];
};

export const fetchQuestionBank = async (quizId: string) => {
  const { data } = await axiosWithCredentials.get<QuestionBank>(`${API}/quizzes/${quizId}/questions`);
  return data;
};

export const createQuestion = async (quizId: string, question: MCQuestion | TFQuestion | FIBQuestion) => {
  const { data } = await axiosWithCredentials.post<Quiz>(`${API}/quizzes/${quizId}/questions`, question);
  return data;
};

export const updateQuestion = async (
  quizId: string,
  type: QuestionType,
  questionId: string,
  updates: Partial<MCQuestion | TFQuestion | FIBQuestion>
) => {
  const { data } = await axiosWithCredentials.put<Quiz>(`${API}/quizzes/${quizId}/questions/${type}/${questionId}`, updates);
  return data;
};

export const deleteQuestionById = async (quizId: string, type: QuestionType, questionId: string) => {
  const { data } = await axiosWithCredentials.delete<Quiz>(`${API}/quizzes/${quizId}/questions/${type}/${questionId}`);
  return data;
};

export const addMcOption = async (quizId: string, questionId: string, option: { text: string; id?: string }) => {
  const { data } = await axiosWithCredentials.post<Quiz>(`${API}/quizzes/${quizId}/questions/MC/${questionId}/options`, option);
  return data;
};

export const updateMcOption = async (quizId: string, questionId: string, optionId: string, updates: { text?: string }) => {
  const { data } = await axiosWithCredentials.put<Quiz>(`${API}/quizzes/${quizId}/questions/MC/${questionId}/options/${optionId}`, updates);
  return data;
};

export const deleteMcOption = async (quizId: string, questionId: string, optionId: string) => {
  const { data } = await axiosWithCredentials.delete<Quiz>(`${API}/quizzes/${quizId}/questions/MC/${questionId}/options/${optionId}`);
  return data;
};

export type AttemptRecord =
  | { questionType: "MC"; questionId: string; selectedOptionId: string | null; fibText?: null }
  | { questionType: "TF"; questionId: string; selectedOptionId: "TRUE" | "FALSE" | null; fibText?: null }
  | { questionType: "FIB"; questionId: string; selectedOptionId?: null; fibText: string | null };

export type AttemptSubmitRequest = {
  userId: string;
  courseId: string;
  quizId: string;
  quizType?: Quiz["quizType"];
  records: AttemptRecord[];
};

export type AttemptSubmitResponse = {
  attemptId: string;
  score: number;
  maxScore: number;
  totalAttempts: number;
  maxScoreAcrossAttempts: number;
};

export const submitAttempt = async (quizId: string, payload: AttemptSubmitRequest) => {
  if (!payload?.userId) {
    console.warn("[client.submitAttempt] userId is missing; server will return 400", { payload });
  }
  const { data } = await axiosWithCredentials.post<AttemptSubmitResponse>(
    `${API}/quizzes/${quizId}/attempts`,
    payload
  );
  return data;
};

export type GetAttemptsResponse = {
  attempts: Array<{
    attemptId: string;
    submittedAt: string;
    score: number;
    records: any[];
  }>;
  totalAttempts: number;
  maxScoreAcrossAttempts: number;
  lastAttempt: {
    attemptId: string;
    submittedAt: string;
    score: number;
    records: any[];
  } | null;
  lastScore: number;
  meta: {
    quizId: string;
    courseId: string;
    quizType: Quiz["quizType"];
    totalQuestions: number;
    totalPoints: number;
  } | null;
};

export const fetchAttempts = async (quizId: string, userId: string) => {
  const { data } = await axiosWithCredentials.get<GetAttemptsResponse>(
    `${API}/quizzes/${quizId}/attempts`,
    { params: { userId } }
  );
  return data;
};
