import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Table, Card, Form, Spinner } from 'react-bootstrap';

const OrderManager = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get("http://localhost:9000/admin/manager-orders", {
                    withCredentials: true,
                });
                console.log(response.data);
                setOrders(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrders();
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        console.log(orderId, newStatus);
        try {
            await axios.put(`http://localhost:9000/admin/orders/${orderId}/status`, { status: newStatus }, {
                withCredentials: true,
            });
            setOrders(orders.map(order => (order._id === orderId ? { ...order, status: newStatus } : order)));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container className="mt-4">
            <h4 className="mb-4">Quản lý đơn hàng</h4>
            {orders.length === 0 ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>Order ID</th>
                            <th>User</th>
                            <th>Order Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.user?.email || 'N/A'}</td>
                                <td>{new Date(order.createdAt).toLocaleString("vi-VN", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Form.Select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Form.Select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Container>
    );
};

export default OrderManager;
