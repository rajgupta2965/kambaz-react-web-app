import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaPlus, FaQuestionCircle, FaSort, FaSortAlphaDown } from "react-icons/fa";
import { IoEllipsisVertical, IoSearchSharp } from "react-icons/io5";
import ShowIfFaculty from "../../auth/ShowIfFaculty";
import { MdCancel, MdCheckCircle, MdOutlineDateRange } from "react-icons/md";
import { FaChartSimple } from "react-icons/fa6";
import { useQuizActions } from "./useQuizActions";
import { useSelector, useDispatch } from "react-redux";
import { selectSelectedIds, selectQuizzesForCourse, upsertQuiz } from "./reducer";
import * as api from "./client";

export default function QuizControls({
  search,
  onSearchChange,
}: {
  search?: string;
  onSearchChange?: (v: string) => void;
}) {
  const navigate = useNavigate();
  const { cid, courseId } = useParams();
  const currentCourseId = courseId ?? cid ?? "";
  const dispatch = useDispatch();
  const courseQuizzes = useSelector((s: any) => selectQuizzesForCourse(s, currentCourseId));
  const {sortByName, sortByAvailable, sortByDue, sortByPoints, sortByQuestions, handlePublishMany, handlePublishAll, handleUnpublishAll,} = useQuizActions();
  const selectedIds = useSelector(selectSelectedIds);

  const handleAdd = async () => {
    const count = (courseQuizzes?.length ?? 0) + 1;
    const newId = `${currentCourseId}_Q${count}`;
    const newTitle = `Q${count} - New Quiz`;
    const payload = {
      _id: newId,
      course: currentCourseId,
      title: newTitle,
      desc: "",
      points: 0,
      questions: 0,
      timeLimit: 20,
      published: false,
      questionBank: { mc: [], tf: [], fib: [] },
    } as any;
    const saved = await api.createQuiz(currentCourseId, payload);
    dispatch(upsertQuiz({ courseId: currentCourseId, item: saved }));
    navigate(`/Kambaz/Courses/${currentCourseId}/Quizzes/${saved._id}/Details`);
  };

  return (
    <div id="wd-modules-controls" className="d-flex align-items-center flex-nowrap gap-2 overflow-visible">
      <div className="flex-grow-1" style={{ minWidth: 220 }}>
        <InputGroup size="lg" className="w-100">
          <InputGroup.Text><IoSearchSharp /></InputGroup.Text>
          <Form.Control
            placeholder="Search for Quiz"
            value={search ?? ""}
            onChange={(e) => onSearchChange?.(e.currentTarget.value)}
          />
        </InputGroup>
      </div>
      <Dropdown align="end">
        <Dropdown.Toggle variant="secondary" size="lg" bsPrefix="btn" className="text-nowrap flex-shrink-0 d-inline-flex align-items-center" >
          Sort <FaSort className="m-1" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={sortByName}><FaSortAlphaDown className="fs-4 mb-1" /> Sort by Name</Dropdown.Item>
          <Dropdown.Item onClick={sortByAvailable}><MdOutlineDateRange className="fs-4 mb-1" /> Sort by Available date</Dropdown.Item>
          <Dropdown.Item onClick={sortByDue}><MdOutlineDateRange className="fs-4 mb-1" /> Sort by Due date</Dropdown.Item>
          <Dropdown.Item onClick={sortByPoints}><FaChartSimple className="fs-4 mb-1" /> Sort by Weightage</Dropdown.Item>
          <Dropdown.Item onClick={sortByQuestions}><FaQuestionCircle className="fs-4 mb-1" /> Sort by number of Questions</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <ShowIfFaculty>
        <Button variant="danger" size="lg" id="wd-add-quiz-btn" className="text-nowrap flex-shrink-0 d-inline-flex align-items-center" onClick={handleAdd}>
          <FaPlus className="me-1 position-relative" />Quiz
        </Button>
        <Dropdown align="end" className="me-2">
          <Dropdown.Toggle variant="secondary" size="lg" bsPrefix="btn" >
            <IoEllipsisVertical className="fs-4" />
          </Dropdown.Toggle>
          <Dropdown.Menu className="rb-no-active-blue">
            <Dropdown.Item onClick={() => handlePublishMany(selectedIds, true)}>
              <MdCheckCircle className="text-success fs-4 mb-1" /> Publish Selected
            </Dropdown.Item>
            <Dropdown.Item onClick={handlePublishAll}>
              <MdCheckCircle className="text-success fs-4 mb-1" /> Publish All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handlePublishMany(selectedIds, false)}>
              <MdCancel className="text-danger fs-4 mb-1" /> Unpublish Selected
            </Dropdown.Item>
            <Dropdown.Item onClick={handleUnpublishAll}>
              <MdCancel className="text-danger fs-4 mb-1" /> Unpublish All
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ShowIfFaculty>
    </div>
  );
}
