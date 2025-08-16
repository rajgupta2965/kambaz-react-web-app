import { useParams } from "react-router-dom";
import * as db from "../../Database";
import ListGroup from "react-bootstrap/ListGroup";
import { BsGripVertical } from "react-icons/bs";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";

type Lesson = {
	_id: string;
	name: string;
	description?: string;
	module?: string;
};

type Module = {
	_id: string;
	name: string;
	description?: string;
	course: string;
	lessons?: Lesson[];
};

export default function Modules() {
	const { cid } = useParams<{ cid: string }>();
	const modules = (db.modules as Module[]) || [];

	return (
		<div>
			<ListGroup id="wd-modules" className="rounded-0">
				{modules
					.filter((module) => module.course === cid)
					.map((module) => (
						<ListGroup.Item
							key={module._id}
							className="wd-module p-0 mb-5 fs-5 border-gray"
						>
							<div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center justify-content-between">
								<span>
									<BsGripVertical className="me-2 fs-3" />
									{module.name}
								</span>
								<ModuleControlButtons />
							</div>

							{module.lessons && module.lessons.length > 0 && (
								<ListGroup className="wd-lessons rounded-0">
									{module.lessons.map((lesson) => (
										<ListGroup.Item
											key={lesson._id}
											className="wd-lesson p-3 ps-1 d-flex align-items-center justify-content-between"
										>
											<span>
												<BsGripVertical className="me-2 fs-3" />
												{lesson.name}
											</span>
											<LessonControlButtons />
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					))}
			</ListGroup>
		</div>
	);
}
