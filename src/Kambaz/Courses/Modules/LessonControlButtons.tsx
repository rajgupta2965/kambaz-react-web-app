import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import ShowIfFaculty from "../../auth/ShowIfFaculty";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ModuleEditor from "./ModuleEditor";
import { updateLesson, deleteLesson } from "./reducer";
import * as modulesClient from "./client";

export default function LessonControlButtons(
  {
    moduleId,
    lessonId,
    initialName,
  }: {
    moduleId: string;
    lessonId: string;
    initialName?: string;
  }
) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [lessonName, setLessonName] = useState(initialName ?? "Lesson");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    await modulesClient.updateLessonById(lessonId, { name: lessonName });
    dispatch(updateLesson({ moduleId, lessonId, name: lessonName }));
    handleClose();
  };
  const handleDelete = async () => {
    if (!window.confirm("Remove this lesson?")) return;
    await modulesClient.deleteLessonById(lessonId);
    dispatch(deleteLesson({ moduleId, lessonId }));
  };

  return (
    <div className="float-end">
      <ShowIfFaculty>
        <FaPencil onClick={handleShow} className="text-primary me-3" />
        <FaTrash className="text-danger me-3 mb" onClick={handleDelete} />
      </ShowIfFaculty>

      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />

      <ShowIfFaculty>
        <ModuleEditor
          show={show}
          handleClose={handleClose}
          dialogTitle="Edit Lesson"
          moduleName={lessonName}
          setModuleName={setLessonName}
          addModule={handleSave}
        />
      </ShowIfFaculty>
    </div>
  );
}
