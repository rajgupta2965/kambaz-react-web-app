import { Button, Container, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

const fmtDate = (d?: string) => {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  return dt.toISOString().slice(0, 10);
};

export default function Profile() {
  const [profile, setProfile] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
  };

  const fetchProfile = () => {
    if (!currentUser) return navigate("/Kambaz/Account/Signin");
    setProfile(currentUser);
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/Kambaz/Account/Signin");
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <Container className="m-2">
      <div id="wd-profile-screen">
        <h1>Profile</h1>
        {profile && (
          <div>
            <FormControl
              id="wd-username"
              className="mb-2"
              placeholder="Username"
              value={profile.username ?? ""}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
            <FormControl
              id="wd-password"
              className="mb-2"
              type="text"
              placeholder="Password"
              value={profile.password ?? ""}
              onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            />
            <FormControl
              id="wd-firstname"
              className="mb-2"
              placeholder="First name"
              value={profile.firstName ?? ""}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
            <FormControl
              id="wd-lastname"
              className="mb-2"
              placeholder="Last name"
              value={profile.lastName ?? ""}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
            <FormControl
              id="wd-dob"
              className="mb-2"
              type="date"
              placeholder=""
              value={fmtDate(profile.dob)}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            />
            <FormControl
              id="wd-email"
              className="mb-2"
              type="email"
              placeholder="username@gmail.com"
              value={profile.email ?? ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <select
              id="wd-role"
              className="form-control mb-2"
              value={profile.role ?? "USER"}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="FACULTY">FACULTY</option>
              <option value="TA">TA</option>
              <option value="STUDENT">STUDENT</option>
            </select>

            <Button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </Button>
            <Button onClick={signout} className="wd-signout-btn btn btn-danger w-100"> Sign out </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
