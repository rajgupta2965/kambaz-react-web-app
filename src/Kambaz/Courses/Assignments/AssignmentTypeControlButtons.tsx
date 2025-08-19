import { IoEllipsisVertical } from "react-icons/io5";
import { BsPlus } from "react-icons/bs";
import ShowIfFaculty from "../../auth/ShowIfFaculty";
import { useNavigate, useParams } from "react-router-dom";

type AssignType = "Assignment" | "Quiz" | "Exam" | "Project";

export default function AssignmentTypeControlButtons({ assignType = "Assignment" }: { assignType?: AssignType }) {
  const navigate = useNavigate();
  const { cid, courseId } = useParams();
  const currentCourseId = courseId ?? cid ?? "";
  const goNew = () => {
    navigate(
      `/Kambaz/Courses/${currentCourseId}/Assignments/new?type=${encodeURIComponent(assignType)}`,
      { state: { assignType } }
    );
  };

  return (
    <div className="float-end">
      <ShowIfFaculty>
        <BsPlus className="fs-2" style={{ cursor: "pointer" }} onClick={goNew} />
      </ShowIfFaculty>
      <IoEllipsisVertical className="fs-4" />
    </div>
  );
}
