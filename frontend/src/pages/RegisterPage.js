import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const RegisterPage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(false);
    const [formLogin, setFormLogin] = useState({
        email: "",
        password: "",
    });
    const [fromRegis, setFromRegis] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [message, setMessage] = useState("");

    // xu ly submit login
    const handleLogin = async () => {
        //console.log("form", formLogin.email, formLogin.password);
        if (!formLogin.email || !formLogin.password) {
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
            console.log("res.data.user.role", res.data.user.role)
            if (res.data.user.role == 'admin') {
                //console.log("hi")
                navigate('/admin/manager-product/:page'); // Chuyển trang nếu là admin
              }
            else if (res.status === 200) {
                // window.alert("Đăng nhập thành công!");
                navigate("/")
            }
            // setShowOffCanvasLogin(true);
        } catch (error) {
            setMessage(error.response.data.message);
            console.log("register page: ", error);
        }
    }
    const handleRegister = async () => {
        console.log(fromRegis.confirmPassword, fromRegis.password)
        if (!fromRegis.email || !fromRegis.password || !fromRegis.confirmPassword) {
            setMessage("Nhap du thong tin, an don gio")
            return null;
        }
        if (!fromRegis.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setMessage("Email can dinh dang @gmail.com")
            return null;
        }
        if (fromRegis.password.toString() !== fromRegis.confirmPassword.toString()) {
            setMessage("Password khong khop voi Comfirm password")
            return null;
        }
        try {
            const res = await axios.post("http://localhost:9000/register", {
                email: fromRegis.email,
                password: fromRegis.password
            }, {
                withCredentials: true // Cho phép gửi cookie trong request
            });
            // Lưu trạng thái đăng nhập vào localStorage
            localStorage.setItem("UserLogin", true);
            window.dispatchEvent(new Event("storage"));
            if (res.status === 201) {
                setMessage("Successfull, chuyển hướng sau 2s...");
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setMessage("Email đã tồn tại, vui lòng chọn email khác.");
            } else {
                console.error("Lỗi đăng ký:", error.message);
                setMessage("Lỗi server, vui lòng thử lại sau.");
            }
            console.log("register page: ", error.message)
        }

        console.log("gu")
    }
    return (
        <Container>
            <p className="h4 text-center fw-bold mt-3">Tài Khoản</p>

            <Row g={4} className='mb-5' style={{ height: '300px' }}>
                <Col md={6} className='d-flex justify-content-center'>
                    {isLogin ?
                        (<div className="register-form w-75">
                            <p className="h5 fw-bold mt-3">ĐĂNG KÝ</p>
                            <Form.Label htmlFor="email-regis">Địa chỉ email *</Form.Label>
                            <Form.Control
                                type="email"
                                id="email-regis"
                                className="rounded rounded-pill "
                                value={fromRegis.email}
                                onChange={(e) => setFromRegis({ ...fromRegis, email: e.target.value })}
                            />
                            <Form.Label htmlFor="password-regis">Password*</Form.Label>
                            <Form.Control
                                type="password"
                                id="password-regis"
                                className="rounded rounded-pill "
                                value={fromRegis.password}
                                onChange={(e) => setFromRegis({ ...fromRegis, password: e.target.value })}
                            />
                            <Form.Label htmlFor="password-confirm">Confirm Password *</Form.Label>
                            <Form.Control
                                type="password"
                                id="password-confirm"
                                className="rounded rounded-pill "
                                value={fromRegis.confirmPassword}
                                onChange={(e) => setFromRegis({ ...fromRegis, confirmPassword: e.target.value })}
                            />
                            {/* <Form.Text id="email" muted>
                            Một mã otp để đặt mật khẩu mới sẽ được gửi đến địa chỉ email của bạn.
                        </Form.Text> */}
                            <Button variant="dark" className='w-100 mt-3 rounded rounded-2 py-2' onClick={handleRegister}>Đăng kí</Button>
                            {message && (
                                <p className={`text-center ${message.includes("Successfull") ? "text-success" : "text-danger"}`}>
                                    {message}
                                </p>
                            )}
                        </div>)
                        :
                        (<div className="login-form w-75">
                            <Form.Label htmlFor="email">Tên tài khoản hoặc địa chỉ email *</Form.Label>
                            <Form.Control
                                type="email"
                                id="email"
                                className="rounded rounded-pill"
                                value={formLogin.email}
                                onChange={(e) => setFormLogin({ ...formLogin, email: e.target.value })}
                            />
                            <Form.Label htmlFor="inputPassword5" className="mt-3">Password *</Form.Label>
                            <Form.Control
                                type="password"
                                id="inputPassword5"
                                className="rounded rounded-pill"
                                value={formLogin.password}
                                onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })}
                            />
                            <Button variant="dark" className='w-100 mt-3 rounded rounded-2 py-2' onClick={handleLogin}>Login</Button>
                            <div className="option d-flex justify-content-between mt-2">
                                <Form.Check type="checkbox" label="Remember me" />
                                <a href="/" className='text-decoration-none text-black  fw-semibold'>Lost your password?</a>
                            </div>
                            {message && <p className='text-danger text-center'>{message}</p>}
                        </div>
                        )}
                </Col>
                <Col md={6} className='border border-0 border-start border-1 border-black'>
                    <div className='d-flex justify-content-center flex-column align-items-center w-75'>

                        <div className="form-left text-center">
                            {isLogin ? (<p className="h5 fw-bold mt-3">ĐĂNG KÝ</p>) : (<p className="h5 fw-bold mt-3">ĐĂNG NHẬP</p>)}
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Qua eaque voluptates. Necessitatibus voluptas officia repudiandae dolores. Voluptatibus, dolores.</p>
                        </div>
                        <Button variant="dark" className='w-50 mt-3 rounded rounded-2 py-2' onClick={() => setIsLogin(!isLogin)}><i className="fas fa-arrow-left"></i>{isLogin ? ' Register' : ' Login'}</Button>
                        <i class="fa-solid fa-left text-white"></i>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
export default RegisterPage
