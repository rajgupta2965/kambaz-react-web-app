import { Link } from "react-router-dom";
export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
            <h2 id="wd-dashboard-published">Published Courses (12)</h2> <hr />
            <div id="wd-dashboard-courses">
                <table>
                    <tr>
                        <td>
                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/reactjs.jpg" width={200} />
                                    <div>
                                        <h5> CS1234 React JS </h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn Reactjs at Northeastern</p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                        <td>
                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/algorithms.jpg" width={200} />
                                    <div>
                                        <h5> CS5800 Alogrithms </h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn Algorithms at Northeastern  </p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                        <td>
                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/ai.jpg" width={200} />
                                    <div>
                                        <h5> CS5100 Foundations of Artificial Intelligence</h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn AI at Northeastern</p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                        <td>

                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/dbms.jpg" width={200} />
                                    <div>
                                        <h5> CS5200 Database Management Systems </h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn DBMS at northeastern</p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/nlp.jpg" width={200} />
                                    <div>
                                        <h5> CS6120 Natural Language Processing </h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn Language Process at Northeastern</p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                        <td>
                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/ml.jpg" width={200} />
                                    <div>
                                        <h5> 6140 Machine Learning</h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn Machine Learning at Northeastern</p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                        <td>
                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/datamining.jpg" width={200} />
                                    <div>
                                        <h5> 6220 Data Mining Techniques</h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn Data Mining at Northeastern</p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                        <td>
                            <div className="wd-dashboard-course">
                                <Link to="/Kambaz/Courses/1234/Home"
                                    className="wd-dashboard-course-link" >
                                    <img src="/images/network.jpg" width={200} />
                                    <div>
                                        <h5> CY6740 Network Security </h5>
                                        <p className="wd-dashboard-course-title">
                                            Learn Network Security at Northeastern</p>
                                        <button> Go </button>
                                    </div>
                                </Link>
                            </div>
                        </td>
                    </tr>
                </table>









            </div>
        </div>
    );
}
