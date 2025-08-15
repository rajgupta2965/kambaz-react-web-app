import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

type Course = {
  id: string;
  title: string;
  desc: string;
  img: string;
  to: string;
};

const courses: Course[] = [
  { id: "react", title: "CS1234 React JS", desc: "Learn Reactjs at Northeastern", img: "/images/reactjs.jpg", to: "/Kambaz/Courses/1234/Home" },
  { id: "algorithms", title: "CS5800 Algorithms", desc: "Learn Algorithms at Northeastern", img: "/images/algorithms.jpg", to: "/Kambaz/Courses/1234/Home" },
  { id: "ai", title: "CS5100 Foundations of Artificial Intelligence", desc: "Learn AI at Northeastern", img: "/images/ai.jpg", to: "/Kambaz/Courses/1234/Home" },
  { id: "dbms", title: "CS5200 Database Management Systems", desc: "Learn DBMS at Northeastern", img: "/images/dbms.jpg", to: "/Kambaz/Courses/1234/Home" },
  { id: "nlp", title: "CS6120 Natural Language Processing", desc: "Learn Language Processing at Northeastern", img: "/images/nlp.jpg", to: "/Kambaz/Courses/1234/Home" },
  { id: "ml", title: "CS6140 Machine Learning", desc: "Learn Machine Learning at Northeastern", img: "/images/ml.jpg", to: "/Kambaz/Courses/1234/Home" },
  { id: "dm", title: "CS6220 Data Mining Techniques", desc: "Learn Data Mining at Northeastern", img: "/images/datamining.jpg", to: "/Kambaz/Courses/1234/Home" },
  { id: "netsec", title: "CY6740 Network Security", desc: "Learn Network Security at Northeastern", img: "/images/network.jpg", to: "/Kambaz/Courses/1234/Home" },
];

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1><hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2><hr />

      <Container fluid id="wd-dashboard-courses">
        <Row className="g-4">
          {courses.map((c) => (
            <Col key={c.id} xs={12} sm={6} md={4} lg={3}>
              <Card className="h-100">
                <LinkContainer to={c.to} style={{ cursor: "pointer" }}>
                  <Card.Img variant="top" src={c.img} alt={c.title} />
                </LinkContainer>

                <Card.Body className="d-flex flex-column">
                  <Card.Title>{c.title}</Card.Title>
                  <Card.Text className="flex-grow-1">{c.desc}</Card.Text>
                  <LinkContainer to={c.to}>
                    <Button variant="primary" className="mt-auto">Go</Button>
                  </LinkContainer>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
