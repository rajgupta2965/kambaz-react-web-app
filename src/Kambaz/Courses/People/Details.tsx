import { useEffect, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import { FaPencil } from "react-icons/fa6";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import * as client from "../../Account/client";
import { Form, FormControl, FormSelect } from "react-bootstrap";

export default function PeopleDetails() {
  const { uid } = useParams();
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();

  const deleteUser = async (uid: string) => {
    await client.deleteUser(uid);
    navigate(-1);
  };

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [loginId, setLoginId] = useState("");
  const [section, setSection] = useState("");

  const startEditing = () => {
    setName(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim());
    setRole((user.role ?? "").toString());
    setEmail(user.email ?? "");
    setLoginId(user.loginId ?? "");
    setSection(user.section ?? "");
    setEditing(true);
  };

  const saveUser = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const safeName = (name ?? "").trim();
    const parts = safeName.split(/\s+/).filter(Boolean);
    const firstName = parts[0] ?? user.firstName ?? "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

    const updatedUser = {
      ...user,
      firstName,
      lastName,
      role: (role ?? user.role) || user.role,
      email: (email ?? "").trim(),
      loginId: (loginId ?? "").trim(),
      section: (section ?? "").trim(),
    };

    await client.updateUser(updatedUser);
    setUser(updatedUser);
    setEditing(false);
    window.location.reload();
  };

  const fetchUser = async () => {
    if (!uid) return;
    const u = await client.findUserById(uid);
    setUser(u);
  };

  useEffect(() => {
    if (uid) fetchUser();
  }, [uid]);
  if (!uid) return null;

  return (
    <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
      <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0 wd-close-details">
        <IoCloseSharp className="fs-1" />
      </button>
      <div className="text-center mt-2">
        <FaUserCircle className="text-secondary me-2 fs-1" />
      </div>
      <hr />

      <div className="d-flex align-items-center justify-content-between text-danger">
        <div className="fs-4">{user.firstName} {user.lastName}</div>
        {!editing ? (
          <FaPencil onClick={startEditing} className="fs-5 wd-edit" role="button" />
        ) : (
          <button type="submit" form="wd-people-form" className="btn p-0 m-0 border-0">
            <FaCheck className="fs-5 wd-save" />
          </button>
        )}
      </div>

      <Form id="wd-people-form" onSubmit={saveUser} className="mt-2">
        <div className="d-flex align-items-center">
          <label className="fw-bold me-2 mb-0">Name:</label>
          {!editing ? (
            <span className="wd-name">{user.firstName} {user.lastName}</span>
          ) : (
            <FormControl
              className="wd-edit-name flex-grow-1"
              value={name}
              placeholder="FirstName LastName"
              onChange={(e) => setName(e.target.value)}
            />
          )}
        </div>

        <div className="d-flex align-items-center">
          <label className="fw-bold me-2 mb-0">Role:</label>
          {!editing ? (
            <span className="wd-roles">{user.role}</span>
          ) : (
            <FormSelect
              className="wd-edit-role flex-grow-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select role</option>
              <option value="ADMIN">ADMIN</option>
              <option value="FACULTY">FACULTY</option>
              <option value="TA">TA</option>
              <option value="STUDENT">STUDENT</option>
            </FormSelect>
          )}
        </div>

        <div className="d-flex align-items-center">
          <label className="fw-bold me-2 mb-0">Email ID:</label>
          {!editing ? (
            <span className="wd-email-id">{user.email}</span>
          ) : (
            <FormControl
              className="wd-edit-email flex-grow-1"
              type="email"
              value={email}
              placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          )}
        </div>

        <div className="d-flex align-items-center">
          <label className="fw-bold me-2 mb-0">Login ID:</label>
          {!editing ? (
            <span className="wd-login-id">{user.loginId}</span>
          ) : (
            <FormControl
              className="wd-edit-loginid flex-grow-1"
              value={loginId}
              placeholder="login id"
              onChange={(e) => setLoginId(e.target.value)}
            />
          )}
        </div>
        
        <div className="d-flex align-items-center">
          <label className="fw-bold me-2 mb-0">Section:</label>
          {!editing ? (
            <span className="wd-section">{user.section}</span>
          ) : (
            <FormControl
              className="wd-edit-section flex-grow-1"
              value={section}
              placeholder="Section"
              onChange={(e) => setSection(e.target.value)}
            />
          )}
        </div>

        <div className="d-flex align-items-center">
          <label className="fw-bold me-2 mb-0">Total Activity:</label>
          <span className="wd-total-activity">{user.totalActivity}</span>
        </div>
      </Form>

      <hr />
      <button onClick={() => deleteUser(uid)} className="btn btn-danger float-end wd-delete">
        Delete
      </button>
      <button onClick={() => navigate(-1)} className="btn btn-secondary float-start float-end me-2 wd-cancel">
        Cancel
      </button>
    </div>
  );
}
