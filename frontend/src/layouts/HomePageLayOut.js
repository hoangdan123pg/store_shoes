import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Col, Container, Row } from "react-bootstrap";
const HomePageLayOut = ({ children }) => {
  return (
    <Container fluid className="p-0 m-0">
      <Header />
      <Row>
        <Col md={12}>
          <div className="content">{children}</div>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};
export default HomePageLayOut;
