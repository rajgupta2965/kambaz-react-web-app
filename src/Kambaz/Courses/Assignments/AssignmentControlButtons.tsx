import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "../GreenCheckmark";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import ShowIfFaculty from "../../auth/ShowIfFaculty";
import { useDispatch } from "react-redux";
import { useState } from "react";
import ModuleEditor from "../Modules/ModuleEditor";
import * as client from "./client";
import { updateAssignment as updateAction, deleteAssignment as deleteAction } from "./reducer";

export default function AssignmentControlButtons({
  assignmentId,
  initialTitle,
}: {
  assignmentId?: string;
  initialTitle?: string;
}) {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [name, setName] = useState(initialTitle ?? "Assignment");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSave = async () => {
    if (!assignmentId) return;
    await client.updateAssignment({ _id: assignmentId, title: name });
    dispatch(updateAction({ _id: assignmentId, title: name }));
    handleClose();
  };

  const handleDelete = async () => {
    if (!assignmentId) return;
    if (!window.confirm("Remove this assignment?")) return;
    await client.deleteAssignment(assignmentId);
    dispatch(deleteAction(assignmentId));
  };

  return (
    <div className="float-end">
      <ShowIfFaculty>
        <FaPencil onClick={handleShow} className="text-primary me-3" />
        <FaTrash className="text-danger me-3" onClick={handleDelete} />
      </ShowIfFaculty>

      <GreenCheckmark />
      <IoEllipsisVertical className="fs-4" />

      <ShowIfFaculty>
        <ModuleEditor
          show={show}
          handleClose={handleClose}
          dialogTitle="Edit Assignment"
          moduleName={name}
          setModuleName={setName}
          addModule={handleSave}
        />
      </ShowIfFaculty>
    </div>
  );
}
