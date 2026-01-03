import React from 'react'
import Header from './Header';
import Footer from './Footer';
import { Col, Container, Row } from 'react-bootstrap';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (

        <Container>
          <Header />
          <Row g={2}>
            <Col md={3}>
            <div className="sidebar"><Sidebar /></div>
            </Col>
            <Col md={9}>
            <div className="content">{children}</div>
            </Col>
          </Row>
          <Footer />
        </Container>
      );
    };
export default MainLayout;