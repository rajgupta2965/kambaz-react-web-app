import { useState } from "react";
import { FormCheck, FormControl } from "react-bootstrap";

const REMOTE_SERVER = import.meta.env.VITE_REMOTE_SERVER;

export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });

  const [module, setModule] = useState({
    id: "M1",
    name: "Web Dev Module",
    description: "Introduction to React.js",
    course: "CS5610"
  });

  const ASSIGNMENT_API_URL = `${REMOTE_SERVER}/lab5/assignment`
  const MODULE_API_URL = `${REMOTE_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/assignment`}>
        Get Assignment
      </a><hr />

      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
        href={`${REMOTE_SERVER}/lab5/assignment/title`}>
        Get Title
      </a><hr />

      <h4>Modifying Properties</h4>
      <a id="wd-update-assignment-title"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title
      </a>
      <FormControl className="w-75" id="wd-assignment-title"
        defaultValue={assignment.title} onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })} />
      <hr />
     
      <h4>Assignment Score & Checkbox</h4>
      <a id="wd-update-assignment-score"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}>
        Update Score
      </a>
      <FormControl type="number" className="w-75 mb-3" id="wd-assignment-score"
        defaultValue={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: Number(e.target.value) || 0 })
        } />

      <a id="wd-update-assignment-completed"
        className="btn btn-primary float-end"
        href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}>
        Update Completed
      </a>
      <div className="w-75">
        <FormCheck
          id="wd-assignment-completed"
          type="checkbox"
          label="Completed"
          defaultChecked={assignment.completed}
          onChange={(e) =>
            setAssignment({ ...assignment, completed: e.target.checked })
          }
        />
      </div>
      <hr />

      <h4>Retrieving Module Object</h4>
      <a id="wd-get-module" className="btn btn-primary me-2"
        href={`${MODULE_API_URL}`}>
        Get Module
      </a>
      <a id="wd-get-module-name" className="btn btn-secondary"
        href={`${MODULE_API_URL}/name`}>
        Get Module Name
      </a>
      <hr />

      <h4>Modifying Module</h4>
      <a id="wd-set-module-name"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/name/${encodeURIComponent(module.name)}`}>
        Update Name
      </a>
      <FormControl className="w-75 mb-3" id="wd-module-name"
        placeholder="Type new module name"
        defaultValue={module.name}
        onChange={(e) => setModule({ ...module, name: e.target.value })} />

      <a id="wd-set-module-description"
        className="btn btn-primary float-end"
        href={`${MODULE_API_URL}/description/${encodeURIComponent(module.description)}`}>
        Update Description
      </a>
      <FormControl as="textarea" rows={3} className="w-75" id="wd-module-description"
        placeholder="Type new module description"
        defaultValue={module.description}
        onChange={(e) => setModule({ ...module, description: e.target.value })} />
      <hr />
    </div>
  );
}
