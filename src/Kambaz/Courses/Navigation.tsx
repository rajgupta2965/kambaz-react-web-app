import { Link, useLocation, useParams } from "react-router-dom";

export default function CourseNavigation() {
  const { cid } = useParams<{ cid: string }>();
  const { pathname } = useLocation();
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People",];
  const base = `/Kambaz/Courses/${encodeURIComponent(cid ?? "")}`;

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((label) => {
        const to = `${base}/${encodeURIComponent(label)}`;
        const active = pathname === to || pathname.startsWith(`${to}/`);
        return (
          <Link key={label} to={to} id={`wd-course-${label.toLowerCase()}-link`}
            className={`list-group-item border border-0 ${active ? "active" : "text-danger"}`}
            aria-current={active ? "page" : undefined}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}
