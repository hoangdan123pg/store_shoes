import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/Context'
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import Pagination from 'react-bootstrap/Pagination';
import { Col, Container, Row } from 'react-bootstrap';
import collectionPage from "../css/collectionPage.css";
const CollectionPage = () => {
  const { setBrand, listFilter, handleRemoveFilter } = useContext(Context);
  const [listProduct, setListProduct] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const { category } = useParams();
  const location = useLocation();
  
  // Luôn lấy page từ URL
  const queryParams = new URLSearchParams(location.search);
  const currentPage = Number(queryParams.get("page")) || 1;
  const nameSeacrh = queryParams.get("search") || ""
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/collections/${category}?search=${nameSeacrh}&page=${currentPage}&filter_size=${listFilter.size?.join(",") || ""}&filter_brand=${listFilter.brand?.join(",") || ""}`,
          { withCredentials: true }
        );
        setListProduct(res.data.products);
        setBrand(res.data.brands);
        setTotalPages(res.data.totalPages || 1); // Đảm bảo totalPages có giá trị hợp lệ
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu sản phẩm:", error.message);
      }
    };
    fetchData();
  }, [category, currentPage, nameSeacrh, listFilter]);
  // Phụ thuộc vào currentPage lấy từ URL

  return (
    <Container className="main d-flex flex-column">
  <div className="d-flex">
    {Object.entries(listFilter).map(([key, values]) =>
      values.map((value) => (
        <div key={`${key}-${value}`} className="d-flex justify-content-center align-items-center">
          <i className="fa-regular fa-circle-xmark" onClick={() => handleRemoveFilter(key, value)}></i>
          <p className="m-0 p-0 me-2">{` ${value}`}</p>
        </div>
      ))
    )}
  </div>

  <div className="row row-cols-5 p-0 m-0 flex-grow-1">
    {listProduct.length > 0 &&
      listProduct.map((product) => (
        <div key={product.id} className="col mb-2 p-1">
          <ProductCard product={product} />
        </div>
      ))}
  </div>

  <div className="pagination-wrapper">
    {totalPages > 1 && (
      <Pagination className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <Pagination.Item
            key={i + 1}
            active={currentPage === i + 1}
            onClick={() => navigate(`/collections/all?page=${i + 1}`)}
          >
            {i + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )}
  </div>
</Container>

  )
}

export default CollectionPage;
