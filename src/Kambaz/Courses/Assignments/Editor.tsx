export default function AssignmentEditor() {
    return (
        <form action="#/Kambaz/Courses/1234/Assignments">
            <div id="wd-assignments-editor">
                <label htmlFor="wd-name"><h3>Assignment Name</h3> </label>
                <input id="wd-name" value="A1 - ENV + HTML" /> <br /><br />
                <textarea id="wd-description" name="Description" rows={10} cols={50}>
                    The assignment is available online Submit a link to the landing page
                    of your Web application running on Netlify. The landing page should
                    include the following: Your full name and section Links to each of
                    the lab name and assignments Link to the Kanbas application Links
                    to all relevant source code repositories The Kanbas application
                    should include a link to navigate back to the landing page.
                </textarea><br /><br />

                <table>
                    <tr>
                        <td align="left" valign="top">
                            <label htmlFor="wd-points">Points</label>
                        </td>
                        <td>
                            <input id="wd-points" value={100} />
                        </td>
                    </tr><br />

                    <tr>
                        <td align="left" valign="top">
                            <label htmlFor="wd-group">Assignment Group</label>
                        </td>
                        <td>
                            <select name="Assignment Group" id="wd-group">
                                <option value="Assignment">ASSIGNMENT</option>
                                <option value="Quizzes">QUIZZES</option>
                                <option value="Exams">EXAMS</option>
                            </select>
                        </td>
                    </tr><br />

                    <tr>
                        <td align="left" valign="top">
                            <label htmlFor="wd-display-grade-as">Display Grade as</label>
                        </td>
                        <td>
                            <select name="Percentage" id="wd-display-grade-as">
                                <option value="Percentage">Percentage</option>
                                <option value="Grade">Grade</option>
                            </select>
                        </td>
                    </tr><br />

                    <tr>
                        <td align="left" valign="top">
                            <label htmlFor="wd-submission-type">Submission Type</label>
                        </td>
                        <td>
                            <select name="Submission Type" id="wd-submission-type">
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select> <br /><br />

                            <span >Online Entry Options</span><br />

                            <input type="checkbox" id="wd-text-entry" name="Text Entry" checked />
                            <label htmlFor="wd-text-entry">Text Entry</label><br />
                            <input type="checkbox" id="wd-website-url" name="Website URL" />
                            <label htmlFor="wd-website-url">Website URL</label><br />
                            <input type="checkbox" id="wd-media-recordings" name="Media Recordings" />
                            <label htmlFor="wd-media-recordings">Media Recordings</label><br />
                            <input type="checkbox" id="wd-student-annotation" name="Student Annotation" />
                            <label htmlFor="wd-student-annotation">Student Annotation</label><br />
                            <input type="checkbox" id="wd-file-upload" name="File Uploads" />
                            <label htmlFor="wd-file-upload">File Uploads</label><br /><br />
                        </td>
                    </tr>

                    <tr>
                        <td align="left" valign="top">
                            <label htmlFor="wd-assign-to">Assignment Assign to</label>
                        </td>

                        <td>
                            <input id="wd-assign-to" value={"Everyone"} /> <br /><br />

                            <label htmlFor="wd-due-date">Due</label><br />
                            <input type="date" id="wd-due-date" value="05/13/2024" /><br /><br />
                            <tr>
                                <td>
                                    <label htmlFor="wd-available-from">Available from</label><br />
                                    <input type="date" id="wd-available-from" value="05/06/2024" />
                                </td>

                                <td>
                                    <label htmlFor="wd-available-until">Until</label><br />
                                    <input type="date" id="wd-available-until" value="05/20/2024" />
                                </td>
                            </tr>
                        </td>
                    </tr>
                </table>
                <input type="button" value="Cancel"></input>
                <input type="submit" value="Save"></input>
            </div>
        </form>

    );
}