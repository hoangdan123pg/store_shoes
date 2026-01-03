import React, { useContext, useState } from 'react'
import { Button, Offcanvas, Alert  } from 'react-bootstrap'
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { Context} from '../context/Context'
import { useNavigate } from 'react-router-dom';
const OffCanvasLogin = ({ show, setShow }) => {
  //const { setShowOffCanvasLogin } = useContext(Context);
  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  // xu ly submit login
  const handleLogin = async () => {
    if(!formLogin.email || !formLogin.password) {
      setMessage("Nhap du thong tin, an don gio");
      return null;
    }
    try {
      //console.log(formLogin);
      const res = await axios.post("http://localhost:9000/login", {
        email: formLogin.email,
        password: formLogin.password
      }, {
        withCredentials: true // Cho phép gửi cookie trong request
      });

      // Lưu trạng thái đăng nhập vào localStorage
      localStorage.setItem("UserLogin", true);
      window.dispatchEvent(new Event("storage")); // Kích hoạt sự kiện storage để React nhận diện
      setMessage(res.data.message);
      // Hiển thị hộp thoại cảnh báo
      setShow(false);
      window.alert("Đăng nhập thành công!");
      navigate("/");
     // Kiểm tra role và điều hướng
      if (res.data.user.role === 'admin') {
      navigate('/admin/manager-product/:page'); // Chuyển trang nếu là admin
    }
    } catch (error) {
      setMessage(error.response.data.message);
      console.log("offcanvas login: ", error);
    }
  }
  return (
    <>
    <Offcanvas show={show} onHide={handleClose} placement="end" className="w-25">
      <Offcanvas.Header closeButton >
        <Offcanvas.Title>Sign In</Offcanvas.Title>
      </Offcanvas.Header>
      <hr className="border border-0 border-bottom border-1 border-black w-75 mx-auto my-0"></hr>
      <Offcanvas.Body>
        
          <Form.Label htmlFor="email">Tên tài khoản hoặc địa chỉ email *</Form.Label>
          <Form.Control
            type="email"
            id="email"
            className="rounded rounded-pill"
            value={formLogin.email}
            onChange={(e) => setFormLogin({...formLogin, email: e.target.value})}
            />
          <Form.Label htmlFor="inputPassword5" className="mt-3">Password *</Form.Label>
          <Form.Control
            type="password"
            id="inputPassword5"
            className="rounded rounded-pill"
            value={formLogin.password}
            onChange={(e) => setFormLogin({...formLogin, password: e.target.value})}
            />
            <Button 
              variant="dark" 
              className='w-100 mt-3 rounded rounded-2 py-2'
              onClick={handleLogin}  
              >Login</Button>
            <div className="option d-flex justify-content-between mt-2">
            <Form.Check type="checkbox" label="Remember me"/>
            <a href="#" className='text-decoration-none text-black  fw-semibold'>Lost your password?</a>
            </div>
            <hr className="border border-0 border-bottom border-1 border-black w-75 mx-auto mt-5"></hr>

            <div className="create-account d-flex justify-content-center align-items-center flex-column">
            <i className="fa-regular fa-user p-3" style={{fontSize: '40px', opacity: '0.5'}}></i>
            <p className='m-0'>No account yet?</p>
            <p className='m-0 text-uppercase fw-bold text-decoration-underline' 
            onClick={() =>{ 
              handleClose();
              navigate("/register&login")} }>Create an account</p>
            {message && <p className='text-danger'>{message}</p>}
            </div>
      </Offcanvas.Body>
    </Offcanvas>
    </>
  )
}

export default OffCanvasLogin


/* 
Tạo chức năng login 
Kế hoạch:
Frontend React: Gửi dữ liệu email và password lên backend.
Backend Node.js + Express: Xác thực tài khoản, kiểm tra mật khẩu.
Tạo JWT Token: Trả token về cho frontend để lưu trữ trong localStorage.
Bảo vệ các route cần xác thực bằng JWT.
*/