import React, { useEffect, useState } from 'react'
import { ListGroup } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const SidebarAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeKey, setActiveKey] = useState("");

    // Đồng bộ activeKey với URL khi component mount
        useEffect(() => {
            const path = location.pathname.split('/')[2] || "manager-product"; // Lấy phần sau `/my-account/`
            console.log("path", path)
            setActiveKey(path);
        }, [location.pathname]);

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
        <>
            {/* Tinh nang */}
            <div className="color border-0 mb-2 me-2" style={{ height: '300px' }}>
                <ListGroup activeKey={activeKey} className='border-0'>
                    <ListGroup.Item
                        action
                        eventKey="manager-product"
                        onClick={() => navigate('/admin/manager-product/1')}
                        className='border-0'
                    >
                        Sản Phẩm
                    </ListGroup.Item>
                    <ListGroup.Item
                        action
                        eventKey="manager-order"
                        onClick={() => navigate('/admin/manager-order/1')}
                        className='border-0'
                    >
                        Đơn hàng
                    </ListGroup.Item>
                    {/* <ListGroup.Item
                        action
                        eventKey="manager-user"
                        onClick={() => navigate('/admin/manager-user/1')}
                        className='border-0'
                    >
                        Người dùng
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

        </>
    )
}
export default SidebarAdmin