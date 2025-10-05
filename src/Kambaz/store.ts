import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./Account/reducer";
import coursesReducer from "./Courses/reducer";
import modulesReducer from "./Courses/Modules/reducer";
import assignmentsReducer from "./Courses/Assignments/reducer";
import quizzesReducer from "./Courses/Quizzes/reducer";

const store = configureStore({
  reducer: {
    modulesReducer,
    accountReducer,
    assignmentsReducer,
    quizzesReducer,
    coursesReducer,
  },
});
export default store;