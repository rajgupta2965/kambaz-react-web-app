import { Button, Container, FormControl } from "react-bootstrap";
import { } from "react-router-dom";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signin = async () => {
    const user =  await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/Kambaz/Dashboard");
  };

  return (
    <Container className="m-2">
      <div id="wd-signin-screen">
        <h1>Sign in</h1>
        <FormControl defaultValue={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          className="wd-username mb-2" placeholder="Username"/>
        <FormControl defaultValue={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          className="wd-password mb-2" placeholder="Password" type="password"/>
        <Button onClick={signin} className="wd-signin-btn w-100" > Sign in </Button>
        <Link to="/Kambaz/Account/Signup" className="wd-signup-link"> Sign up </Link>
      </div>
    </Container>
  );
}