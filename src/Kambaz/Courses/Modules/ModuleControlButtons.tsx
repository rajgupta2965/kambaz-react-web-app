import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../GreenCheckmark";
import { BsPlus } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import ShowIfFaculty from "../../auth/showIfFaculty";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ModuleEditor from "./ModuleEditor";
import { addLessonToModule } from "./reducer";

export default function ModuleControlButtons(
  { moduleId, deleteModule, editModule }: {
    moduleId: string;
    deleteModule: (moduleId: string) => void;
    editModule: (moduleId: string) => void;
  }
) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [lessonName, setLessonName] = useState("");

  const handleClose = () => {
    setShow(false);
    setLessonName("");
  };

  const handleShow = () => setShow(true);

  const handleAddLesson = () => {
    dispatch(addLessonToModule({ moduleId, name: lessonName }));
    handleClose();
  };

  const handleDeleteModule = () => {
    if (!window.confirm("Remove this module and its lessons?")) return;
    deleteModule(moduleId);
  };

  return (
    <div className="float-end">
      <ShowIfFaculty>
        <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
        <FaTrash className="text-danger me-3 mb" onClick={handleDeleteModule} />
      </ShowIfFaculty>

      <GreenCheckmark />

      <ShowIfFaculty>
        <BsPlus className="fs-2" onClick={handleShow} />
      </ShowIfFaculty>

      <IoEllipsisVertical className="fs-4" />

      <ShowIfFaculty>
        <ModuleEditor
          show={show}
          handleClose={handleClose}
          dialogTitle="Add Lesson"
          moduleName={lessonName}
          setModuleName={setLessonName}
          addModule={handleAddLesson}
        />
      </ShowIfFaculty>
    </div>
  );
}
