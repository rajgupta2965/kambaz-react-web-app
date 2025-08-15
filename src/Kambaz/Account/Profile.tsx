import { Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Profile() {
  return (
    <Container className="m-2">
      <div id="wd-profile-screen">
        <h1>Profile</h1>

        <Form.Control id="wd-username" defaultValue="rajgupta"
          placeholder="username" className="mb-2"/>
        <Form.Control id="wd-password" type="password" defaultValue="123456"
          placeholder="password" className="mb-2" />
        <Form.Control id="wd-firstname" defaultValue="Raj"
          placeholder="First Name" className="mb-2" />
        <Form.Control id="wd-lastname" defaultValue="Gupta"
          placeholder="Last Name" className="mb-2" />
        <Form.Control id="wd-dob" type="date"
          defaultValue="yyyy-mm-dd" className="mb-2" />
        <Form.Control id="wd-email" type="email" defaultValue="rajgupta@gmail.com"
          placeholder="email" className="mb-3" />
        <Form.Select id="wd-role" defaultValue="USER" className="mb-3">
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </Form.Select>
        <Link to="/Kambaz/Account/Signin" className="btn btn-danger w-100">Sign out</Link>

      </div>
    </Container>
  );
}
