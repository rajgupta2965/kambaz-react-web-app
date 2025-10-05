import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import ModulesControls from "./ModulesControls";
import { FormControl } from "react-bootstrap";
import { setModules, editModule, updateModule, deleteModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowDropdown } from "react-icons/io";
import * as coursesClient from "../client";
import * as modulesClient from "./client";

type Lesson = { _id: string; name: string; description?: string; module?: string };
type Module = { editing: any; _id: string; name: string; description?: string; course: string; lessons?: Lesson[] };

export default function Modules() {
  const { cid } = useParams();
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: any) => state.modulesReducer);
  const dispatch = useDispatch();

  const fetchModulesForCourse = async () => {
    const modules = await coursesClient.findModulesForCourse(cid!);
    dispatch(setModules(modules));
  };
  useEffect(() => {
    fetchModulesForCourse();
  }, [cid]);

  const createModuleForCourse = async () => {
    const newModule = await coursesClient.createModuleForCourse(cid!, {
      name: moduleName,
      course: cid,
    });
		dispatch(setModules([...(modules ?? []), { ...newModule, lessons: newModule.lessons ?? [] }]));
    setModuleName("");
  };

  const deleteModuleHandler = async (moduleId: string) => {
    await modulesClient.deleteModule(moduleId);
    dispatch(deleteModule(moduleId));
  };

  const updateModuleHandler = async (module: any) => {
    await modulesClient.updateModule(module);
    dispatch(updateModule(module));
  };

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setOpen(prev => ({ ...prev, [id]: prev[id] === undefined ? false : !prev[id] }));

  return (
    <div className="wd-modules">
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={createModuleForCourse}
      />

      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: Module) => {
          const expanded = open[module._id] !== false;
          return (
            <ListGroup.Item key={module._id} className="wd-module p-0 mb-5 fs-5 border-gray">
              <div className="wd-title p-3 ps-2 bg-secondary align-items-center justify-content-between">
                <span>
                  <BsGripVertical className="me-1 fs-3" />
                  <IoMdArrowDropdown
                    className="me-2 fs-3"
                    style={{
                      transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 150ms ease",
                      cursor: "pointer",
                      verticalAlign: "middle"
                    }}
                    onClick={() => toggle(module._id)}
                    role="button"
                    aria-label="Toggle module"
                    tabIndex={0} />

                  {!module.editing && module.name}
                  {module.editing && (
                    <FormControl className="w-50 d-inline-block"
                      onChange={(e) => updateModuleHandler({ ...module, name: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateModuleHandler({ ...module, editing: false });
                        }
                      }}
                      defaultValue={module.name} />
                  )}
                </span>
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => deleteModuleHandler(moduleId)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))} />
              </div>

              {expanded && module.lessons && module.lessons.length > 0 && (
                <ListGroup className="wd-lessons rounded-0">
                  {module.lessons.map((lesson: Lesson) => (
                    <ListGroup.Item key={lesson._id}
                      className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between">
                      <span>
                        <BsGripVertical className="me-2 fs-3" />
                        {lesson.name}
                      </span>
                      <LessonControlButtons
                        moduleId={module._id}
                        lessonId={lesson._id}
                        initialName={lesson.name}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </div>
  );
}
