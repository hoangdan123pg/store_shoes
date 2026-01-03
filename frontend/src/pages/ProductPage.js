import React, { useEffect, useState } from 'react'
import { Button, ButtonGroup, Col, Container, Row, Form } from 'react-bootstrap'
// import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const ProductPage = () => {
    const [product, setProduct] = useState()
    const { name } = useParams(); // Lấy name từ URL
    const [quantity, setQuantity] = useState(1);
    const [chooseSize, setChooseSize] = useState();
    const [rateForm, setRateForm] = useState(0);
    const [commentForm, setCommentForm] = useState("");
    const navigate = useNavigate();
    //console.log(name)

    // Lay name tu url -> fetch api
    useEffect(() => {
        console.log("hi")
        //const originalName = name.replace(/_/g, " ").replace(/-/g, "/");
        //console.log(originalName)
        // fetch api
        const fetchData = async (req, res) => {
            try {
                const res = await axios.get(`http://localhost:9000/product?name=${encodeURIComponent(name)}`,
                    { withCredentials: true });
                setProduct(res.data.products[0])
                console.log("api tra data: ", res.data.products[0])
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }
        fetchData()
    }, [])
    //console.log("ProductPage")
    // handle add to cart
    const handleAddToCart = (product) => {
        const addToCart = async () => {
            console.log("hi1", product._id, quantity, chooseSize)
            try {
                const res = await axios.post(`http://localhost:9000/add-to-cart`, { id: product._id, quantity: quantity, size: chooseSize }, { withCredentials: true });
                // console.log("api tra data: ", res.data.products[0])
            } catch (error) {
                console.error("Error fetching products:", error);
                if (error.response && error.response.status === 401) {
                    navigate('/register&login');
                }
            }
        }
        addToCart();
    }
    const handleSubmit = async () => {
        console.log("hi")
        if (rateForm === 0) {
            alert("Vui lòng chọn số sao!");
            return;
        }
        try {
            const res = await axios.post(`http://localhost:9000/products/review/${product._id}`, {
                rate: rateForm,
                comment: commentForm
            }, { withCredentials: true });

            alert("Đánh giá thành công!");
            setRateForm(0);
            setCommentForm("");
            console.log(res.data);
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
        }
    };
    return (
        <Container>
            <Row className='mt-5 g-2'>
                <Col md={1}>
                    <div className="list-image d-flex flex-column">
                        {product?.image.map((img, index) => (
                            <div className="image-item overflow-hidden mb-1" >
                                <img
                                    src={`http://localhost:9000${img}`}
                                    style={{ objectFit: "cover", objectPosition: "center", width: "100%", height: "100%" }}
                                    alt=" detail2"
                                />
                            </div>
                        ))}
                    </div>
                    {/* <div className="image-item overflow-hidden mb-1" > */}
                </Col>
                <Col md={5}>
                    <div className="image-view">
                        <div className="image-item overflow-hidden m-0 p-0 mb-1" >
                            <img
                                src={`http://localhost:9000${product?.image[0]}`}
                                style={{ objectFit: "cover", objectPosition: "center", width: "100%", height: "100%" }}
                                alt=" detail3"
                            />

                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className='product-detail ms-3'>
                        <p className='fw-bold mt-2 fs-5'>{product?.name}</p>
                        <div className='d-flex'>
                            <p className='fw-bold mt-2 text-muted text-decoration-line-through fs-5'>{product?.price.toLocaleString("vi-VN")}₫</p>
                            <p className='fw-bold mt-2 ms-3 fs-5'>{(product?.price - ((product?.price * product?.discord) / 100)).toLocaleString("vi-VN")}₫</p>
                        </div>
                        <p className='fw-medium mt-2 fs-5'>{product?.description}</p>
                        <p className='fw-bold mt-2 fs-5'>Size :</p>
                        <div className='d-flex'>
                            {product?.size.map((s, index) => (
                                <div
                                    className="border border-1 border-muted rounded-pill d-flex justify-content-center align-items-center me-2"
                                    style={{ width: "45px", height: "45px", backgroundColor: chooseSize === s ? "black" : "transparent", color: chooseSize === s ? "white" : "black", cursor: "pointer" }}
                                    onClick={() => setChooseSize(s)} >
                                    <p key={index} className='fw-bold fs-5 p-0 m-0'>{s}</p>
                                </div>
                            ))}
                        </div>
                        <ButtonGroup className='border border-1 border-muted rounded-3 mt-2'>
                            <Button variant="sight" className='p-1 border-0 border-end border-1 border-muted' onClick={() => quantity > 1 && setQuantity(quantity - 1)}><i class="fa-solid fa-minus p-0"></i></Button>
                            <Button variant="sight" className="px-3">{quantity}</Button>
                            <Button variant="sightt" className='p-1 border-0 border-start border-1 border-muted' onClick={() => setQuantity(quantity + 1)}><i class="fa-solid fa-plus fs-"></i></Button>
                        </ButtonGroup>
                        <Button
                            variant="dark"
                            className='w-75 mt-3 rounded rounded-2 py-2 mb-3 d-block mx-auto'
                            onClick={() => handleAddToCart(product)}
                        >   THÊM VÀO GIỎ HÀNG</Button>
                        <div className="comments">
                            <div className="comments-header">
                                <h3>Comments</h3>
                                <p className="average-rating">
                                    ⭐ <strong>Average Rating:</strong> {product?.rate?.length > 0
                                        ? (product.rate.reduce((sum, item) => sum + item.rate, 0) / product.rate.length).toFixed(1)
                                        : "No ratings yet"}
                                </p>
                            </div>

                            {product?.comment?.map((item, index) => (
                                <div key={index} className="comment">
                                    <p><strong>User:</strong> {item.user_id?.email || "Unknown"}</p>
                                    <p>{item.comment}</p>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 border rounded shadow-sm bg-white">

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="3">
                                    Chọn số sao:
                                </Form.Label>
                                <Col sm="9">
                                    <Form.Select value={rateForm} onChange={(e) => setRateForm(Number(e.target.value))}>
                                        <option value={0}>Chọn số sao</option>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <option key={star} value={star}>
                                                {star} ⭐
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Nhập bình luận:</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    value={commentForm}
                                    onChange={(e) => setCommentForm(e.target.value)}
                                    placeholder="Viết đánh giá của bạn..."
                                    rows={3}
                                />
                            </Form.Group>

                            <Button variant="success" className="w-100" onClick={handleSubmit}>
                                Gửi đánh giá
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className='mt-5 g-2'>
                <Col md={12}>
                    <div className='similar-products'>
                        <p className='fw-bold mt-2 fs-3'>Sản phẩm tương tự</p>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}
export default ProductPage