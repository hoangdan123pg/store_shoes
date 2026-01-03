import { Button, Container } from "react-bootstrap";
import "../css/homepage.css";
import adidas_plp from "../assets/images/adidas_plp.jpg";
import ProductCard from "../components/ProductCard";
import bestSeller from "../assets/images/best-seller.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
  const [topBannerProducts, setTopBannerProducts] = useState([])
  const [listProductsHot, setListProductHots] = useState([])
  const [listProductsSale, setListProductSales] = useState([])
  const navigate = useNavigate();
  useEffect(() => {
    console.log("hi")
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:9000/home", {
          withCredentials: true,
        });
        setTopBannerProducts(res.data.listProductBanner || []);
        setListProductHots(res.data.listProductHot || []);
        setListProductSales(res.data.listProductSale || []);
        console.log(`http://localhost:9000${res.data.listProductSale[0].image[0]}`);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleClick = (name) => {

    const link = name.toLowerCase().replace(/ /g, "_").replace(/\//g, "-");
    console.log(1);
    navigate(`/product/${link}`);
  }
  // console.log(`http://localhost:9000${topBannerProducts[0].image[0]}`)
  return (
    <Container >
      {/* Banner */}
      <div className="banner-hot-sale text-center text-white my-5" style={{ background: "linear-gradient(180deg, #B61A00 0%, #821300 100%)" }}>
        <p className="h3 m-0 p-0">MUA 1 ĐƯỢC 2 TÍNH TIỀN 3</p>
      </div>
      {/* wrapper */}
      <section className="wrapper-container">
        <div className="wrapper">
          {topBannerProducts.length > 0 && (
            <img src={`http://localhost:9000${topBannerProducts[0].image[0]}`} alt="Adidas PLP" className="full-image" />
          )}
          <div className="wrapper-controller">
            <p className="fw-bold text-white fs-3">New Balance</p>
            <Button variant="light" size="lg" onClick={() => handleClick(topBannerProducts[0].name)}>XEM NGAY</Button>
          </div>
        </div>
      </section>
      <section className=" wrapper-container d-flex justify-content-center my-4 gap-4">
        <div className="wrapper">
          <div className="wrapper">
            {topBannerProducts.length > 0 && (
              <img src={`http://localhost:9000${topBannerProducts[1].image[0]}`} alt="Adidas PLP" className="full-image" />
            )}
            <div className="wrapper-controller">
              <p className="fw-bold text-white fs-3">New Balance</p>
              <Button variant="light" size="lg" onClick={() => handleClick(topBannerProducts[1].name)}>XEM NGAY</Button>
            </div>
          </div>
        </div>
        <div className="wrapper">
          <div className="wrapper">
            {topBannerProducts.length > 0 && (
              <img src={`http://localhost:9000${topBannerProducts[2].image[0]}`} alt="Adidas PLP" className="full-image" />
            )}
            <div className="wrapper-controller">
              <p className="fw-bold text-white fs-3">New Balance</p>
              <Button variant="light" size="lg" onClick={() => handleClick(topBannerProducts[2].name)}>XEM NGAY</Button>
            </div>
          </div>
        </div>
      </section>
      <section className="new-product">
        <p className="h4 fw-bold">Nổi bật - Hàng Hot</p>
        <div className="row row-cols-6 p-0 m-0">
          {listProductsHot.length > 0 &&  listProductsHot.map((product) => (
            <div className="col mb-2 p-1">
              <ProductCard key={product.id} product={{ ...product, state: "new" }} />
            </div>
          ))}
        </div>
      </section>
      <section className="best-seller">
        <div className="container-img-best-seller p-1">
          <img src={bestSeller} alt="Best Seller" className="banner-best-seller" />
        </div>
        <div className="row row-cols-6 p-0 m-0">
          {listProductsSale.length > 0 && listProductsSale.map((product) => (
            <div className="col mb-2 p-1">
              <ProductCard key={product.id} product={{ ...product, state: "hot" }} />
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
};

export default HomePage;
