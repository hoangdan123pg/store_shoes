import React, { useContext, useEffect, useState } from 'react'
import { Button, ButtonGroup, Offcanvas } from 'react-bootstrap'
// import Form from 'react-bootstrap/Form';
import  "../css/cart.css"
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import { Context} from '../context/Context'
const OffCanvasCart = ({ show, setShow }) => {
  const [listCart, setListCart] = useState([]);
  const { setListCartOrder,listCartOrder } = useContext(Context);
  const navigate = useNavigate();
  // const totalPrice = listCart.reduce((total, cart) => total + cart.quantity * (cart.product.price - cart.product.price * cart.product.discord * 0.01), 0);
  const totalPrice = listCart?.reduce((total, cart) => {
    if (!cart.product || cart.product.price == null || cart.product.discord == null) {
        return total; // Bỏ qua phần tử nếu product không hợp lệ
    }
    return total + cart.quantity * (cart.product.price - cart.product.price * cart.product.discord * 0.01);
}, 0) || 0;


    const handleClose = () => setShow(false);
    // lay thong tin cart
    const fetchCart = async () => {
      try {
        const res = await axios.get("http://localhost:9000/cart", 
          { withCredentials: true });
          setListCart(res.data.items);
        console.log("api tra data: ", res.data.items);
      } catch (error) {
        console.error("Error fetching products:", error);
        if (error.response && error.response.status === 401) {
          navigate('/register&login');
      }
      }
    }
    useEffect(() => {
      fetchCart();
    }, [show == true]);
    // xu ly tăng giam so luong
    const handleQuantity = ({cart}, type) =>{
       //console.log("hi", cart)
      if(type == "decrease" && cart.quantity === 1) return;
        
      const updateQuality = async () => {
        try {
          const res = await axios.put("http://localhost:9000/update-quantity", {id: cart._id, productId: cart.product._id, type: type}, { withCredentials: true });
          console.log("api tra data: ", res.data)
          fetchCart();
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
      updateQuality();
    }
    const handleDeleteItem = async (id) => {
      console.log("id: ", id);
      try {
        const res = await axios.delete(`http://localhost:9000/remove-item/${id}`, { withCredentials: true });
        console.log("api tra data: ", res.data)
        fetchCart();
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    // xu ly them san pham vao cart se thanh toan
    const handleCheckboxChange = (cartItem) => {
      console.log("item: ", cartItem);  
      setListCartOrder((prev) => {
          const isItemExist = prev.some(item => item.product._id === cartItem.product._id);
  
          if (isItemExist) {
              // Nếu đã có trong danh sách, bỏ chọn (xóa khỏi listCartOrder)
              return prev.filter(item => item.product._id !== cartItem.product._id);
          } else {
              // Nếu chưa có, thêm vào danh sách
              console.log("cartItem: ", cartItem)
              return [...prev, cartItem];
          }
      });
  };
  
    const handleListCart = (cart) =>(
        <>
        <div className="d-flex flex-1 justify-content-between align-items-center mb-3 border-0 border-bottom border-1 border-black">
        <div className="right">
          <Form.Check 
            type="checkbox"
            className='m-0 p-0 me-1'
            checked={listCartOrder.some(item => item.product._id === cart.product._id)}
            onChange={() => handleCheckboxChange(cart)}
          />
        </div>
            <div className="left d-flex flex-grow-1">
                <img src={`http://localhost:9000${cart.product?.image[0]}`}  alt="" className='cart-image p-0 m-0 align-self-center' />
                <div className="detail ms-2">
                    <p className="fw-bold p-0 m-0 h-10 overflow-hidden fs-6">{cart.product?.name} </p>
                    <div className="d-flex align-items-center justify-content-between">
                      <p className='p-0 m-0 fw-bold fs-6'>Size: {cart?.size}</p>
                      <div>
                      <ButtonGroup className='border-0 btn-sm'>
                        <Button variant="sight" className='py-0 p-1 border-0 border-end border-1 border-muted ' onClick={() => handleQuantity({cart}, "decrease")}><i class="fa-solid fa-minus p-0"></i></Button>
                        <Button variant="sight" className="py-0 px-1 fs-6">{cart?.quantity}</Button>
                        <Button variant="sightt" className='py-0 p-1 border-0 border-start border-1 border-muted ' onClick={() => handleQuantity({cart}, "increase")}><i class="fa-solid fa-plus fs-"></i></Button>
                    </ButtonGroup>
                      </div>
                    </div>
                    <p className="fw-bold" style={{ fontSize: "14px" }}>
  {cart && cart.product ? (
    <>
      <span style={{ fontSize: "14px" }} className="text-secondary fw-medium">
        {cart.quantity}*
      </span>
      {((cart.product.price ?? 0) - ((cart.product.price ?? 0) * (cart.product.discord ?? 0) * 0.01)).toLocaleString("vi-VN")}₫
      {" => "}
      {(cart.quantity * ((cart.product.price ?? 0) - ((cart.product.price ?? 0) * (cart.product.discord ?? 0) * 0.01)) ).toLocaleString("vi-VN")}₫
    </>
  ) : (
    <span className="text-secondary">Không có sản phẩm</span>
  )}
</p>

                </div>

            </div>           
            <i className="fa-solid fa-xmark align-self-start mt-1" onClick={() => handleDeleteItem(cart?.product._id)}></i>
        </div>
        </>
    )
  return (
    <Offcanvas show={show} onHide={handleClose} placement="end" className="w-25">
      <Offcanvas.Header closeButton >
        <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <hr className="border border-0 border-bottom border-1 border-black w-75 mx-auto my-0"></hr>
      <Offcanvas.Body className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto">
      {/* d-flex flex-1 justify-content-between align-items-center */}
        <div className=" mb-3">
            {listCart.length > 0 && listCart.map(cart => handleListCart(cart))}
        </div>
    </div>
        <div className="footer-cart border border-0 border-top border-2 border-black">
            <div className="d-flex justify-content-between align-items-center mb-2 fw-bold h5 mt-1">
                <p>Tổng số tiền</p>
                <p>{totalPrice.toLocaleString("vi-VN")}₫</p>
            </div>
            <Button variant="light" className='w-100 mt-3 rounded rounded-pill py-1 lh-lg' onClick={() => {setShow(false); navigate("/cart")}}>Tiến Hành Thanh Toán</Button>
            {/* <Button variant="dark" className='w-100 mt-3 rounded rounded-2 lh-lg'>THANH TOÁN</Button> */}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
export default OffCanvasCart
