import { MdDoNotDisturbAlt, MdNotificationsActive } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { BiImport } from "react-icons/bi";
import { LiaFileImportSolid } from "react-icons/lia";
import { Button, Container } from "react-bootstrap";
import { IoMdHome } from "react-icons/io";
import { RiBarChart2Fill } from "react-icons/ri";
import { GrAnnounce } from "react-icons/gr";
import ShowIfFaculty from "../../auth/ShowIfFaculty";

export default function CourseStatus() {
	return (
		<Container className="m-2">
			<div id="wd-course-status" style={{ width: "350px" }}>
				<h2>Course Status</h2>

				<ShowIfFaculty>
				<div className="d-flex">
					<div className="w-50 pe-1">
						<Button variant="secondary" size="lg" className="w-100 text-nowrap ">
							<MdDoNotDisturbAlt className="me-2 fs-5" /> Unpublish </Button> </div>
					<div className="w-50">
						<Button variant="success" size="lg" className="w-100">
							<FaCheckCircle className="me-2 fs-5" /> Publish </Button> </div>
				</div>
				</ShowIfFaculty><br />
				
				<ShowIfFaculty>
				<Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
					<BiImport className="me-2 fs-5" /> Import Existing Content </Button>
				<Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
					<LiaFileImportSolid className="me-2 fs-5" /> Import from Commons </Button>
				</ShowIfFaculty>

				<Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
					<IoMdHome className="me-2 fs-5" /> Choose Home Page </Button>
				<Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
					<RiBarChart2Fill className="me-2 fs-5" /> View Course Stream </Button>
				<Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
					<GrAnnounce className="me-2 fs-5" /> New Announcements </Button>
				<Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
					<RiBarChart2Fill className="me-2 fs-5" /> New Analytics </Button>
				<Button variant="secondary" size="lg" className="w-100 mt-1 text-start">
					<MdNotificationsActive className="me-2 fs-5" /> View Course Notifications </Button>
			</div>
		</Container>
	);
}