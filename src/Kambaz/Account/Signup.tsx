import { Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <Container className="m-2">
      <div id="wd-signup-screen">
        <h1>Sign up</h1>
        <Form.Control id="wd-username" placeholder="Username" className="mb-2" />
        <Form.Control id="wd-password" type="password" placeholder="Password" className="mb-2" />
        <Form.Control id="wd-password-verify" type="password" placeholder="Verify Password" className="mb-3" />
        <Link id="wd-signup-btn" to="/Kambaz/Account/Profile"
          className="btn btn-primary w-100 mb-2">Sign up
        </Link>
        <Link id="wd-signin-link" to="/Kambaz/Account/Signin">Sign in</Link>
      </div>
    </Container>
  );
}
