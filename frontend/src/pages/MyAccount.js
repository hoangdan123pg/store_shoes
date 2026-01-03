import React, { useEffect, useState } from 'react';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import "../css/myAccount.css"
import EditOrder from './admin/EditOrder';

const MyAccount = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState("");

    // Đồng bộ activeKey với URL khi component mount
    useEffect(() => {
        const path = location.pathname.split('/')[2] || "account"; // Lấy phần sau `/my-account/`
        setActiveKey(path);
    }, [location.pathname]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await axios.get('http://localhost:9000/my-account', { 
                    withCredentials: true 
                });
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate('/register&login');
                }
            }
        };
        fetchData();
    }, [navigate]);

    // xu ly logout
    const handleLogout = async () => {
        console.log("logout");
        try {
            const response = await axios.post('http://localhost:9000/logout', { 
                withCredentials: true 
            });
            if(response.status === 200) {
                // xoa localStrage
                localStorage.clear();
                // navigate('/register&login');
                // Reload lại trang
                window.location.href = '/register&login';
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Container>
            <Row>
                <Col md={3}>
                    <div className='sidebar mt-3 me-3'>
                        <p className='h4 text-uppercase po-0 m-0'>Tài khoản</p>
                        <hr className="border border-0 border-bottom border-2 border-black mt-1 mb-3"></hr>
                        <ListGroup activeKey={activeKey} className='border-0'>
                            <ListGroup.Item 
                                action 
                                eventKey="account"
                                onClick={() => navigate('/my-account/account')}
                                className='border-0 border-top border-1'
                            >
                                Tài khoản
                            </ListGroup.Item>
                            <ListGroup.Item 
                                action 
                                eventKey="edit-order"
                                onClick={() => navigate('/my-account/edit-order')}
                                className='border-0'
                            >
                                Đơn hàng
                            </ListGroup.Item>
                                {/* <ListGroup.Item 
                                    action 
                                    eventKey="edit-location"
                                    onClick={() => navigate('/my-account/edit-location')}
                                    className='border-0'
                                >
                                    Địa chỉ
                                </ListGroup.Item> */}
                            <ListGroup.Item 
                                action  
                                onClick={() => handleLogout()}
                                className='border-0'
                            >
                                Logout
                            </ListGroup.Item>
                        </ListGroup>
                    </div>
                </Col>
                <Col md={9}>
                    {/* Nội dung hiển thị dựa trên activeKey */}
                    {activeKey === "account" && <p>Trang tài khoản</p>}
                    {activeKey === "edit-order" && <EditOrder />}
                    {activeKey === "edit-location" && <p>Chỉnh sửa địa chỉ</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default MyAccount;
