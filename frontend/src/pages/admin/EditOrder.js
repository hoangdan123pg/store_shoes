import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Badge } from 'react-bootstrap';
const EditOrder = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:9000/orders',
                    { withCredentials: true }
                );
                setOrders(response.data);
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);
    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'processing':
                return 'primary';
            case 'shipped':
                return 'info';
            case 'delivered':
                return 'success';
            case 'cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    };
    return (
        <div>
            <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
                <thead>
                    <tr>
                        <th style={{ width: '10%' }}>Order ID</th>
                        <th style={{ width: '15%' }}>CreateAt</th>
                        <th style={{ width: '30%' }}>Items</th>
                        <th style={{ width: '10%' }}>Shipping Address</th>
                        <th style={{ width: '15%' }}>Total Price</th>
                        <th style={{ width: '10%' }}>Payment Method</th>
                        <th style={{ width: '10%' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td style={{ width: '10%', wordWrap: 'break-word', whiteSpace: 'normal' }}><p className='text-wrap'>{order._id}</p></td>
                            <td style={{ width: '15%' }}><p>{new Date(order.createdAt).toLocaleString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}</p></td>
                            <td style={{ width: '30%' }}>
                                <ul>
                                    {order.items.map(item => (
                                        <li key={item.product._id}>
                                            Product: {item.product.name}, Quantity: {item.quantity}, Size: {item.size}
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td style={{ width: '15%' }}><p>{order.shippingAddress.location}</p></td>
                            <td style={{ width: '10%' }}><p>{order.totalPrice}</p></td>
                            <td style={{ width: '10%' }}><p>{order.paymentMethod}</p></td>
                            <td style={{ width: '10%' }}>
                                <Badge bg={getStatusVariant(order.status)}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
export default EditOrder