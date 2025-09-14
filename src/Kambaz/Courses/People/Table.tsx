// import { Container, Table } from "react-bootstrap";
// import { FaUserCircle } from "react-icons/fa";
// import PeopleDetails from "./Details";
// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router";
// import * as coursesClient from "../client";

// export default function PeopleTable({ users = [] }: { users?: any[] }) {
// 	const { cid } = useParams();
// 	const [enrolledUsers, setEnrolledUsers] = useState<any[] | null>(null);

// 	useEffect(() => {
// 		let ignore = false;
// 		const load = async () => {
// 			if (!cid) { setEnrolledUsers(null); return; }
// 			try {
// 				const data = await coursesClient.findUsersForCourse(cid);
// 				if (!ignore) setEnrolledUsers(data);
// 			} catch {
// 				if (!ignore) setEnrolledUsers([]);
// 			}
// 		};
// 		load();
// 		return () => { ignore = true; };
// 	}, [cid]);

// 	const rows = enrolledUsers ?? users;
	
// 	return (
// 		<Container className="m-2">
// 			<div id="wd-people-table">
// 				<PeopleDetails />
// 				<Table striped>
// 					<thead>
// 						<tr>
// 							<th>Name</th>
// 							<th>Login ID</th>
// 							<th>Section</th>
// 							<th>Role</th>
// 							<th>Last Activity</th>
// 							<th>Total Activity</th>
// 						</tr>
// 					</thead>
// 					<tbody>
// 					{/* {users */}
// 							{/* // .filter((usr) =>
// 							// 	enrollments.some((enrollment) => enrollment.user === usr._id && enrollment.course === cid)
// 							// ) */}
// 							{rows
// 							.map((user: any) => (
// 								<tr key={user._id}>
// 									<td className="wd-full-name text-nowrap">
// 										<Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none link-danger">
// 											<FaUserCircle className="me-2 fs-1 text-secondary" />
// 											<span className="wd-first-name">{user.firstName}</span>
// 											<span className="wd-last-name">{user.lastName}</span>
// 										</Link>
// 									</td>
// 									<td className="wd-login-id">{user.loginId}</td>
// 									<td className="wd-section">{user.section}</td>
// 									<td className="wd-role">{user.role}</td>
// 									<td className="wd-last-activity">{user.lastActivity}</td>
// 									<td className="wd-total-activity">{user.totalActivity}</td>
// 								</tr>
// 							))}
// 					</tbody>
// 				</Table>
// 			</div>
// 		</Container>
// 	);
// }

import { Container, Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import PeopleDetails from "./Details";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import * as coursesClient from "../client";

export default function PeopleTable({ users = [] }: { users?: any[] }) {
  const { cid } = useParams();
  const [enrolledUsers, setEnrolledUsers] = useState<any[] | null>(null);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      if (!cid) { setEnrolledUsers(null); return; }
      try {
        const data = await coursesClient.findUsersForCourse(cid);
        if (!ignore) setEnrolledUsers(data);
      } catch {
        if (!ignore) setEnrolledUsers([]);
      }
    };
    load();
    return () => { ignore = true; };
  }, [cid]);

  const rows = enrolledUsers ?? users;

  return (
    <Container className="m-2">
      <div id="wd-people-table">
        <PeopleDetails />
        <Table striped>
          <thead>
            <tr>
              <th>Name</th>
              <th>Login ID</th>
              <th>Section</th>
              <th>Role</th>
              <th>Last Activity</th>
              <th>Total Activity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user: any) => (
              <tr key={user._id}>
                <td className="wd-full-name text-nowrap">
                  <Link to={`/Kambaz/Account/Users/${user._id}`} className="text-decoration-none link-danger">
                    <FaUserCircle className="me-2 fs-1 text-secondary" />
                    <span className="wd-first-name">{user.firstName}</span>
                    <span className="wd-last-name">{user.lastName}</span>
                  </Link>
                </td>
                <td className="wd-login-id">{user.loginId}</td>
                <td className="wd-section">{user.section}</td>
                <td className="wd-role">{user.role}</td>
                <td className="wd-last-activity">{user.lastActivity}</td>
                <td className="wd-total-activity">{user.totalActivity}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
