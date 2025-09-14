import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as client from "./client";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import { Button, Container, Form } from "react-bootstrap";
export default function Signup() {
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signup = async () => {
    const currentUser = await client.signup(user);
    dispatch(setCurrentUser(currentUser));
    navigate("/Kambaz/Account/Profile");
  };

  return (
    <Container className="m-2">
      <div id="wd-signup-screen">
        <h1>Sign up</h1>
        <Form.Control className="wd-username mb-2" placeholder="Username" 
        value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}/>
        <Form.Control className="wd-password mb-2"  type="password" placeholder="Password" 
        value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })}/>
        <Form.Control className="wd-password-verify mb-3" type="password" placeholder="Verify Password"/>
        <Button onClick={signup} className="wd-signup-btn btn btn-primary w-100 mb-2">Sign up</Button>
        <Link to="/Kambaz/Account/Signin" className= "wd-signin-link"> Sign in </Link>
      </div>
    </Container>
  );
}
