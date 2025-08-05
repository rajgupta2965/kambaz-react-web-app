export default function Exams() {
  return (
    <div id="wd-assignments">
      <h3 id="wd-assignments-title">
        EXAMS 20% of Total <button>+</button> </h3>

      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <a href="#/Kambaz/Courses/1234/Assignments/123"
            className="wd-assignment-link" >
            X1 - MIDTERM
          </a><br />
          <span className="wd-assignment-list-item">
            Modules 1-3 | Date: May 15 at 2:00pm | 100pts <br />
          </span>
        </li>
        <li className="wd-assignment-list-item">
          <a href="#/Kambaz/Courses/1234/Assignments/123"
            className="wd-assignment-link" >
            X1 - FINAL
          </a><br />
          <span className="wd-assignment-list-item">
            Modules 4-6 | Date: May 25 at 2:00pm | 100pts <br />
          </span>
        </li>
      </ul>
      
    </div>
  );
}
