import { useState } from "react";
import { Dropdown, FormCheck } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdContentCopy, MdEdit, MdCheckCircle, MdCancel } from "react-icons/md";
import { BiSolidTrashAlt } from "react-icons/bi";
import ShowIfFaculty from "../../auth/ShowIfFaculty";
import ModuleEditor from "../Modules/ModuleEditor";
import { useQuizActions } from "./useQuizActions";
import DynamicGreenCheck from "./DynamicGreenCheck";

export default function QuizControlButtons({
  quizId,
  initialTitle,
  published,
  selected,
}: {
  quizId: string;
  initialTitle: string;
  published?: boolean;
  selected?: boolean;
}) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(initialTitle ?? "Quiz");
  const { handleEdit, handleDelete, handleCopy, saveQuiz, toggleSelectOne, handlePublishToggle } = useQuizActions();
  const handleClose = () => setShow(false);
  const handleSaveName = async () => { await saveQuiz({ _id: quizId, title: name }); handleClose();};

  return (
    <div className="float-end d-inline-flex align-items-center ">
      <DynamicGreenCheck faded={!published} onClick={() => handlePublishToggle(quizId, !published)} />

      <ShowIfFaculty>
        <FormCheck
          className="fs-5 m-1"
          checked={!!selected}
          onChange={() => toggleSelectOne(quizId)}
        />
        <Dropdown align="end">
          <Dropdown.Toggle as="span" bsPrefix=" " className="d-inline-flex cursor-pointer" aria-label="Quiz actions">
            <IoEllipsisVertical className="fs-4 m-1" />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as="button" className="text-body" onClick={() => handleEdit(quizId)}>
              <MdEdit className="fs-4 mb-1" /> Edit Quiz
            </Dropdown.Item>
            <Dropdown.Item as="button" className="text-body" onClick={() => handleCopy(quizId)}>
              <MdContentCopy className="fs-4 mb-1" /> Copy Quiz
            </Dropdown.Item>
            {published ? (
              <Dropdown.Item as="button" className="text-body" onClick={() => handlePublishToggle(quizId, false)}>
                <MdCancel className="text-danger fs-4 mb-1" /> Unpublish Quiz
              </Dropdown.Item>
            ) : (
              <Dropdown.Item as="button" className="text-body" onClick={() => handlePublishToggle(quizId, true)}>
                <MdCheckCircle className="text-success fs-4 mb-1" /> Publish Quiz
              </Dropdown.Item>
            )}
            <Dropdown.Item as="button" className="text-body" onClick={() => handleDelete(quizId)}>
              <BiSolidTrashAlt className="text-danger fs-4 mb-1" /> Delete Quiz
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <ModuleEditor
          show={show}
          handleClose={handleClose}
          dialogTitle="Edit Quiz"
          moduleName={name}
          setModuleName={setName}
          addModule={handleSaveName}
        />
      </ShowIfFaculty>
    </div>
  );
}
