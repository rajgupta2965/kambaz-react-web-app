import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { IoSearchSharp } from "react-icons/io5";
export default function AssignmentControls() {
  return (
    <div id="wd-modules-controls" className="d-flex align-items-center flex-nowrap gap-2 overflow-auto">
      <div className="flex-grow-1" style={{ minWidth: 220 }}>
        <InputGroup size="lg" className="w-100">
          <InputGroup.Text><IoSearchSharp /></InputGroup.Text>
          <Form.Control placeholder="Search" />
        </InputGroup>
      </div>
      <div className="d-flex flex-nowrap flex-shrink-0">
        <Button variant="secondary" size="lg" className="me-2" id="wd-add-group-btn">
          <FaPlus className="me-2 position-relative" style={{ bottom: 1 }} />
          Group
        </Button>
        <Button variant="danger" size="lg" id="wd-add-assignment-btn">
          <FaPlus className="me-2 position-relative" style={{ bottom: 1 }} />
          Assignment
        </Button>
      </div>
    </div>
  );
}
