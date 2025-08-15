import { Container, Table } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
export default function PeopleTable() {
	return (
		<Container className="m-2">
			<div id="wd-people-table">
				<Table striped>
					<thead>
						<tr><th>Name</th><th>Login ID</th><th>Section</th><th>Role</th><th>Last Activity</th><th>Total Activity</th></tr>
					</thead>
					<tbody>
						<tr>
							<td className="wd-full-name text-nowrap">
								<FaUserCircle className="me-2 fs-1 text-secondary" />
								<span className="wd-first-name">Tony</span>{" "}
								<span className="wd-last-name">Stark</span></td>
							<td className="wd-login-id">001234561S</td>
							<td className="wd-section">S101</td>
							<td className="wd-role">STUDENT</td>
							<td className="wd-last-activity">2020-10-01</td>
							<td className="wd-total-activity">10:21:32</td>
						</tr>
						<tr>
							<td className="wd-full-name text-nowrap">
								<FaUserCircle className="me-2 fs-1 text-secondary" />
								<span className="wd-first-name">Steve</span>{" "}
								<span className="wd-last-name">Rogers</span></td>
							<td className="wd-login-id">0012368490</td>
							<td className="wd-section">S101</td>
							<td className="wd-role">STUDENT</td>
							<td className="wd-last-activity">2020-10-02</td>
							<td className="wd-total-activity">08:15:32</td>
						</tr>
						<tr>
							<td className="wd-full-name text-nowrap">
								<FaUserCircle className="me-2 fs-1 text-secondary" />
								<span className="wd-first-name">Bruce</span>{" "}
								<span className="wd-last-name">Wayne</span></td>
							<td className="wd-login-id">001238491S</td>
							<td className="wd-section">S102</td>
							<td className="wd-role">TA</td>
							<td className="wd-last-activity">2020-10-05</td>
							<td className="wd-total-activity">12:25:32</td>
						</tr>
						<tr>
							<td className="wd-full-name text-nowrap">
								<FaUserCircle className="me-2 fs-1 text-secondary" />
								<span className="wd-first-name">Natasha</span>{" "}
								<span className="wd-last-name">Romanoff</span></td>
							<td className="wd-login-id">001234382S</td>
							<td className="wd-section">S101</td>
							<td className="wd-role">STUDENT</td>
							<td className="wd-last-activity">2020-10-04</td>
							<td className="wd-total-activity">07:34:32</td>
						</tr>
						<tr>
							<td className="wd-full-name text-nowrap">
								<FaUserCircle className="me-2 fs-1 text-secondary" />
								<span className="wd-first-name">Thor</span>{" "}
								<span className="wd-last-name">Odinson</span></td>
							<td className="wd-login-id">001234909S</td>
							<td className="wd-section">S102</td>
							<td className="wd-role">TA</td>
							<td className="wd-last-activity">2020-10-09</td>
							<td className="wd-total-activity">11:40:32</td>
						</tr>
						<tr>
							<td className="wd-full-name text-nowrap">
								<FaUserCircle className="me-2 fs-1 text-secondary" />
								<span className="wd-first-name">Bruce</span>{" "}
								<span className="wd-last-name">Banner</span></td>
							<td className="wd-login-id">001687561S</td>
							<td className="wd-section">S101</td>
							<td className="wd-role">STUDENT</td>
							<td className="wd-last-activity">2020-10-09</td>
							<td className="wd-total-activity">12:20:32</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</Container>
	);
}