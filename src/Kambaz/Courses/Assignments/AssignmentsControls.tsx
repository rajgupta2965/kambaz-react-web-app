import { Button, Form, InputGroup } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
import ShowIfFaculty from "../../auth/ShowIfFaculty";
import { useNavigate, useParams } from "react-router-dom";

export default function AssignmentControls() {
  const navigate = useNavigate();
  const { cid, courseId } = useParams();
  const currentCourseId = courseId ?? cid ?? "";

  return (
    <div id="wd-modules-controls" className="d-flex align-items-center flex-nowrap gap-2 overflow-auto">
      <div className="flex-grow-1" style={{ minWidth: 220 }}>
        <InputGroup size="lg" className="w-100">
          <InputGroup.Text><IoSearchSharp /></InputGroup.Text>
          <Form.Control placeholder="Search" />
        </InputGroup>
      </div>

      <ShowIfFaculty>
        <div className="d-flex flex-nowrap flex-shrink-0">
          <Button variant="secondary" size="lg" className="me-2" id="wd-add-group-btn">
            <FaPlus className="me-2 position-relative" style={{ bottom: 1 }} />
            Group
          </Button>
          <Button
            variant="danger"
            size="lg"
            id="wd-add-assignment-btn"
            onClick={() =>
              navigate(
                `/Kambaz/Courses/${currentCourseId}/Assignments/new?type=Assignment`,
                { state: { assignType: "Assignment" } }
              )
            }
          >
            <FaPlus className="me-2 position-relative" style={{ bottom: 1 }} />
            Assignment
          </Button>
        </div>
      </ShowIfFaculty>
      
    </div>
  );
}
