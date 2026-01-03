import React from 'react'
import Card from 'react-bootstrap/Card';
import nike_af1 from "../assets/images/nike_af1.jpg";
import "../css/productCard.css";
import { useNavigate } from 'react-router-dom';
const ProductCard = ({product}) => {
  //  console.log("product card", product.status)
  //Tạo hàm khi click vào card sẽ chuyển trang /product/:name
  const navigate = useNavigate();
  const handleClick = () => {

    const link = product.name.toLowerCase().replace(/ /g, "_").replace(/\//g, "-");
    console.log(1);
    navigate(`/product/${link}`);
  }
  return (
    <Card className='p-0 m-0 card-product' onClick={handleClick}>
      <div className="card-img-container">
      <Card.Img variant="top" src={`http://localhost:9000${product.image[0]}`}  className="product-img"/>
      </div>
      <Card.Body>
        <Card.Text  className="overflow-hidden text-truncate">{product.name}</Card.Text>
        <Card.Text className='fw-bold'>{product.brand}</Card.Text>
        <Card.Text>{product.price.toLocaleString("vi-VN")}₫</Card.Text>
        <div className="banner">
        <div className="banner-sale w-25 text-center" style={{ background: "black" }} >
          <p className="m-0 p-0 text-white">-{product.discord}%</p>
        </div>
        {product.state == "new" || product.status == "sale" && (
          <div className="banner-new w-25 text-center mt-1" style={{ background: "linear-gradient(180deg, #B61A00 0%, #821300 100%)" }} >
          <p className="m-0 p-0 text-white">NEW</p>
        </div>
        )}
        {product.state == "hot" || product.status == "hot" && (
          <div className="banner-new w-25 text-center mt-1" style={{ background: "orange" }} >
          <p className="m-0 p-0 text-white">HOT</p>
        </div>
        )}
        </div>
      </Card.Body>
    </Card>
  );
}
//linear-gradient(180deg, #B61A00 0%, #821300 100%)
export default ProductCard;
  
