import Exams from "./Exams";
import Projects from "./Projects";
import Quizzes from "./Quizzes";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments"
        id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>

      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button> </h3>

      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <a href="#/Kambaz/Courses/1234/Assignments/123"
            className="wd-assignment-link" >
            A1 - ENV + HTML
          </a><br />
          <span className="wd-assignment-list-item">
            Multiple Modules | <b>Not available until</b> May 6 at 12:00am | <br />
            <b> Due</b> May 13 at 11:59pm | 100 pts
          </span>
        </li>
        <li className="wd-assignment-list-item">
          <a href="#/Kambaz/Courses/1234/Assignments/123"
            className="wd-assignment-link" >
            A2 - CSS + BOOTSTRAP
          </a><br />
          <span className="wd-assignment-list-item">
            Multiple Modules | <b>Not available until</b> May 13 at 12:00am | <br />
            <b> Due</b> May 20 at 11:59pm | 100 pts
          </span>
        </li>
        <li className="wd-assignment-list-item">
          <a href="#/Kambaz/Courses/1234/Assignments/123"
            className="wd-assignment-link" >
            A3 - JAVASCRIPT + REACT
          </a><br />
          <span className="wd-assignment-list-item">
            Multiple Modules | <b>Not available until</b> May 20 at 12:00am | <br />
            <b> Due</b> May 27 at 11:59pm | 100 pts
          </span>
        </li>
      </ul>

      <div><Quizzes /></div>
      <div><Exams /></div>
      <div><Projects /></div>
      
    </div>
  );
}