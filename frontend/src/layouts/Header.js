import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Navbar, Nav, Form, InputGroup, NavDropdown } from "react-bootstrap";
import logoPage from "../assets/images/logoPage01.jpg";
import "../css/header.css";
import { Context } from "../context/Context";
import OffCanvasLogin from "../components/OffCanvasLogin";
import OffCanvasCart from "../components/OffCanvasCart";
import axios from "axios";

export default function Header() {
  //const {showOffCanvasLogin, setShowOffCanvasLogin } = useContext(Context);
  const [showOffCanvasLogin, setShowOffCanvasLogin ] = useState(false);
  const [showOffCanvasCart, setShowOffCanvasCart ] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("UserLogin"));
  const navigate = useNavigate();
  const [search, setSearch] = useState(""); 
  const [topSale, setTopSale] = useState([]);
  
  useEffect(() => {
    // lay thong tin top sale
    const fetchTopSale = async () => {
      try {
        const res = await axios.get("http://localhost:9000/topsale", 
          { withCredentials: true });
          console.log("api tra data top sale: ", res.data.topSale);
          setTopSale(res.data.topSale);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchTopSale();
    const handleStorageChange = () => {
      const isUserLogin = localStorage.getItem("UserLogin");
      setIsLoggedIn(isUserLogin ? true : false);
    };
    // Lắng nghe sự thay đổi của localStorage
    window.addEventListener("storage", handleStorageChange);
    // Xóa sự kiện khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  console.log("handlePopUpLogin", isLoggedIn);
  const handlePopUpLogin = () => {
    console.log("handlePopUpLogin", isLoggedIn);
    if (isLoggedIn) {
      navigate("/my-account/");
    } else {
      setShowOffCanvasLogin(true);
    }
  };
  const handlePopUpCart = () => {
    if (!isLoggedIn) {
      navigate("/register&login");
    } else {
      setShowOffCanvasCart(true);
    }
  };
  const handleSreach = () => {
    console.log("search", search);
    if (search.trim() !== "") {
      navigate(`/collections/all?search=${encodeURIComponent(search)}&page=1`);
    } else {
      navigate(`/collections/all?page=1`); // Nếu không nhập gì, chỉ giữ page
    }
  };
  
  return (
    <Container fluid className="border border-0 border-bottom border-2 border-dark m-0 p-0">
      <p className="text-center bg-light py-2">
        Hotline: 012345678JOK | Free ship cho đơn 1k, trên 1k không freeship
      </p>

      <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}>
        <Container>
          {/* LOGO */}
          <Navbar.Brand href="/" className="d-flex align-items-center">
            <img className="rounded-3" src={logoPage} alt="Logo" height={70} width={100} />
          </Navbar.Brand>

          {/* TOGGLE BUTTON (FOR MOBILE) */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" style={{ backgroundColor: 'white' }} />

          {/* NAVBAR CONTENT */}
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-around">
            {/* SEARCH BAR */}
            <Form className="mx-3 w-50 ms-5">
              <InputGroup className="rounded-2" style={{ height: "50px" }}>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  aria-label="Tìm kiếm"
                  className="rounded-start-5"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <InputGroup.Text
                  onClick={() => console.log("search")}
                  style={{ cursor: "pointer" }}
                  className="rounded-end-5"
                >
                  <i className="fas fa-search" onClick ={handleSreach}></i>
                </InputGroup.Text>
              </InputGroup>
            </Form>

            {/* USER & CART ICONS */}
            <div className="d-flex align-items-center">
              <Nav.Link  className="me-3 bg-white rounded-pill px-3 py-2" onClick={handlePopUpLogin}>
                <i className="fas fa-user fs-4"></i>
              </Nav.Link>
              <Nav.Link  className="bg-white rounded-pill px-3 py-2" onClick={handlePopUpCart}>
                <i className="fas fa-shopping-cart fs-4"></i>
              </Nav.Link>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Nav */}
      <Nav className="justify-content-center" activeKey="/">
        <Nav.Item>
          <Nav.Link href="/" className="text-black">CỬA HÀNG</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/collections/all?page=1" className="text-black">GIẢM GIÁ UP TO {topSale}%</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          {/* <Nav.Link eventKey="link-2" className="text-black">SNEAKER</Nav.Link> */}
          {/* <NavDropdown
            id="nav-dropdown-dark-example"
            title="SHOES"
            menuVariant="light"
            className="custom-dropdown"
            show={show} 
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
          </NavDropdown> */}
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="link-3" className="text-black">LIÊN HỆ</Nav.Link>
        </Nav.Item>
      </Nav>
      <OffCanvasLogin show={showOffCanvasLogin} setShow={setShowOffCanvasLogin} />
      <OffCanvasCart show={showOffCanvasCart} setShow={setShowOffCanvasCart} />
    </Container>
  );
}
