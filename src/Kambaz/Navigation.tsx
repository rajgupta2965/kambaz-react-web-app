import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup } from "react-bootstrap";
import { NavLink } from "react-router";

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  `list-group-item text-center border-0 ${isActive ? "bg-white text-danger" : "bg-black text-white"
  }`;

export default function KambazNavigation() {
  return (
    <ListGroup
      id="wd-kambaz-navigation"
      style={{ width: 120 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">

      <div className="list-group-item bg-black border-0 text-center">
        <a id="wd-neu-link" href="https://www.northeastern.edu/"
          target="_blank" rel="noreferrer">
          <img src="/images/neu1.png" width="75px" />
        </a>
      </div>

      <NavLink to="/Kambaz/Account" className={linkClasses}>
        <FaRegCircleUser className="fs-1" /><br />Account
      </NavLink>

      <NavLink to="/Kambaz/Dashboard" end className={linkClasses}>
        <AiOutlineDashboard className="fs-1 text-danger" /><br />Dashboard
      </NavLink>

      <NavLink to="/Kambaz/Courses/1234/Home" className={linkClasses}>
        <LiaBookSolid className="fs-1 text-danger" /><br />Courses
      </NavLink>

      <NavLink to="/Kambaz/Calendar" className={linkClasses}>
        <IoCalendarOutline className="fs-1 text-danger" /><br />Calendar
      </NavLink>

      <NavLink to="/Kambaz/Inbox" className={linkClasses}>
        <FaInbox className="fs-1 text-danger" /><br />Inbox
      </NavLink>

      <NavLink to="../Labs" className={linkClasses}>
        <LiaCogSolid className="fs-1 text-danger" /><br />Labs
      </NavLink>
    </ListGroup>
  );
}