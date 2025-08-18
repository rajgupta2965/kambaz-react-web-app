import { Button, Container, FormControl } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

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

  const fetchProfile = () => {
    if (!currentUser) return navigate("/Kambaz/Account/Signin");
    setProfile(currentUser);
  };

  const signout = () => {
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
              value={profile.username ?? ""}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
            />
            <FormControl
              id="wd-password"
              className="mb-2"
              type="text"
              value={profile.password ?? ""}
              onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            />
            <FormControl
              id="wd-firstname"
              className="mb-2"
              value={profile.firstName ?? ""}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            />
            <FormControl
              id="wd-lastname"
              className="mb-2"
              value={profile.lastName ?? ""}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            />
            <FormControl
              id="wd-dob"
              className="mb-2"
              type="date"
              value={fmtDate(profile.dob)}
              onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
            />
            <FormControl
              id="wd-email"
              className="mb-2"
              type="email"
              value={profile.email ?? ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />

            <select
              id="wd-role"
              className="form-control mb-2"
              value={profile.role ?? "USER"}
              onChange={(e) => setProfile({ ...profile, role: e.target.value })}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="FACULTY">Faculty</option>
              <option value="STUDENT">Student</option>
            </select>

            <Button onClick={signout} className="w-100 mb-2" id="wd-signout-btn">
              Sign out
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
