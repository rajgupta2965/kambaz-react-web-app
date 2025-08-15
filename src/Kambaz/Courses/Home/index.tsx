import { Container } from "react-bootstrap";
import Modules from "../Modules";
import CourseStatus from "./Status";
export default function Home() {
	return (
		<Container className="m-2">
			<div className="d-flex" id="wd-home">
				<div className="flex-fill me-3">
					<Modules />
				</div>
				<div className="d-none d-xl-block">
					<CourseStatus />
				</div>
			</div>
		</Container>
	);
}
