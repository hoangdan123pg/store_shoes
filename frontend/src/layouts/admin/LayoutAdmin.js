import React from 'react'
import { Col, Container, Row } from 'react-bootstrap';
import SidebarAdmin from '../../components/admin/SidebarAdmin';
const LayoutAdmin = ({children}) => {
    return (
        <Container fluid className="p-0 m-0 mt-2">
            <Row g={2} className="vh-100"> 
            <Col md={2} className="vh-100">
                    <div className="side-bar-admin " style={{backgroundColor: '#E3F2FD', height: "100%" }}><SidebarAdmin /></div>
                </Col>
                <Col md={10}>
                    <div className="main">{children}</div>
                </Col>
            </Row>
        </Container>
    )
}
export default LayoutAdmin