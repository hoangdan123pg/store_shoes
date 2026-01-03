import React, { useContext, useEffect, useState } from 'react'
import { Button, From, Col, Container, Form, ListGroup, Row , Dropdown } from 'react-bootstrap'
import Table from 'react-bootstrap/Table';
import { useNavigate } from 'react-router-dom';
import {Context} from '../context/Context'
import axios from "axios";

const CartPage = () => {
  const [listCart, setListCart] = useState([]);
  const {listCartOrder } = useContext(Context);
  const totalPrice = listCartOrder.reduce((total, cart) => total + cart.quantity * (cart.product.price - cart.product.price * cart.product.discord * 0.01), 0);
  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState("");
  console.log("listCartOrder: ", listCartOrder);
  const [shippingAddress, setShippingAddress] = useState({
    location: "1",
    phone: "1",
  });
//   const data = {
//     items: listCartOrder.map(item => ({
//         product: item.product._id,  // Lấy ID của product
//         quantity: item.quantity,    // Lấy số lượng
//         size: item.size             // Lấy kích thước
//     })),
//     totalPrice: totalPrice + 35000,
//     shippingAddress: shippingAddress,
//     paymentMethod: dropdown,
// } 

const handleSubmitOrder = async () => {
  if (!listCartOrder || listCartOrder.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
  }

  if (!shippingAddress || !shippingAddress.location || !shippingAddress.phone) {
      alert("Bạn cần nhập địa chỉ giao hàng hợp lệ!");
      return;
  }

  if (!['cod', 'credit_card', 'paypal'].includes(dropdown)) {
      alert("Vui lòng chọn phương thức thanh toán hợp lệ!");
      return;
  }

  const data = {
      items: listCartOrder.map(item => ({
          product: item.product._id,  // Lấy ID của product
          quantity: item.quantity,    // Lấy số lượng
          size: item.size             // Lấy kích thước
      })),
      totalPrice: totalPrice + 35000,
      shippingAddress,
      paymentMethod: dropdown,
  };
  try {
      const res = await axios.post("http://localhost:9000/submit-order", data, { withCredentials: true });
      console.log("API trả về:", res.data);
      navigate("/my-account/edit-order");
  } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      if (error.response && error.response.status === 401) {
          navigate('/register&login');
      } else {
          alert("Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!");
      }
  }
};
  // console.log("data: ", data)
  const listItem = (cart) => (
    <tr className='text-center'>
      <td>
        <div className="d-flex jstify-content-between">
          {/* <i class="fa-solid fa-xmark align-self-start mt-1 me-2 align-self-center"></i> */}
          <img src={`http://localhost:9000${cart.product.image[0]}`} alt="" className='cart-image' />
          <p className="fw-bold ms-2 h-10 overflow-hidden text-start">{cart.product.name} / Size {cart.size}</p>
        </div>
      </td>
      <td>{cart.product.price.toLocaleString("vi-VN")}₫</td>
      <td>
        <p>{cart.quantity}</p>
      </td>
      <td><p>{(cart.quantity * (cart.product.price - (cart.product.price * cart.product.discord * 0.01))).toLocaleString("vi-VN")}₫</p></td>
      <td>
        <p>{cart.product.discord} %</p>
      </td>
    </tr>
  )
  return (
    <Container className='mb-3'>
      <p className="h4 text-center text-decoration-underline mt-3">SHOPPING CART</p>
      <Row className='g-5 mt-4'>
        <Col md={8}>
          <div classNamw="cart-container overflow-auto" style={{ height: "500px" }}>
            <Table hover>
              <thead>
                <tr className='text-center'>
                  <th style={{ width: "50%" }}>SẢN PHẨM</th>
                  <th style={{ width: "15%" }}>GIÁ</th>
                  <th style={{ width: "13%" }}>SỐ LƯỢNG</th>
                  <th style={{ width: "15%" }}>TẠM TÍNH</th>
                  <th style={{ width: "7%" }}>SALE</th>
                </tr>
              </thead>
              <tbody>
                {listCartOrder.length > 0 && listCartOrder.map(cart => listItem(cart))}
              </tbody>
            </Table>
          </div>
        </Col>
        <Col md={4}>
          <div className="bill-container border border-2 border-muted">
            <p className="h4 pt-4 ps-4 pb-4">TỔNG CỘNG GIỎ HÀNG</p>
            <ListGroup >
              <ListGroup.Item className="border-0 border-bottom border-1 border-muted pb-0 mb-0 ">
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Tạm tính</p>
                  <p className="text-end">{(totalPrice).toLocaleString("vi-VN")}₫</p>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-0 border-bottom border-1 border-muted pb-0 mb-0 ">
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Hình thức giao hàng</p>
                  <div className="text-end">
                    <Dropdown>
                      <Dropdown.Toggle variant="light" id="dropdown-basic">
                      {dropdown}  
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setDropdown("cod")}>Thanh toán khi nhận hàng</Dropdown.Item>
                        <Dropdown.Item onClick={() => setDropdown("credit_card")}>Banking</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="border-0 border-bottom border-1 border-muted pb-0 mb-0 ">
                <div className="d-flex justify-content-between">
                  <p className="fw-bold">Giao hàng</p>
                  <div className="text-end">
                    <Form.Check type="radio" defaultChecked label="Tiêu chuẩn (3-4 ngày):" name="shipping" />
                    <p className="fw-bold">35,000₫</p>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className='border-0 '>
                <div className=''>
                  <p className="fw-bold m-0">Nhập địa chỉ</p>
                  <Form.Control 
                    type="text" 
                    className="mt-1 border-0 border-bottom border-1 border-muted" 
                    placeholder="Nhập địa chỉ" 
                    value={shippingAddress.location}
                    onChange= {(e) => setShippingAddress({...shippingAddress, location: e.target.value})}/>
                  <Form.Control 
                    type="text" 
                    className="mt-1 border-0 border-bottom border-1 border-muted" 
                    placeholder="Nhập số điện thoại" 
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    />
                </div>
              </ListGroup.Item>
              <ListGroup.Item className='border-0 '>
                <div className='d-flex justify-content-between'>
                  <p className="fw-bold">TỔNG CỘNG</p>
                  <p className="fw-bold">{(totalPrice + 35000).toLocaleString("vi-VN")}₫</p>
                </div>
              </ListGroup.Item>
            </ListGroup>
            <Button variant="dark" className='w-75 mt-3 rounded rounded-2 py-2 mb-3 d-block mx-auto' onClick={handleSubmitOrder}>THANH TOÁN</Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}
export default CartPage
// useEffect(() => {
//   const fetchCart = async () => {
//     try {
//       const res = await axios.get("http://localhost:9000/cart",
//         { withCredentials: true });
//       setListCart(res.data.items);
//       console.log("api tra data: ", res.data.items);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       if (error.response && error.response.status === 401) {
//         navigate('/register&login');
//       }
//     }
//   }
//   fetchCart();
// }, []);