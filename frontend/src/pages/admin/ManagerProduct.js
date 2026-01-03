import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal, Form, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const ManagerProduct = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State cho modal thêm sản phẩm
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    price: "",
    size: [],
    color: [],
    description: "",
    stock: "",
    status: "active",
    discord: 0,
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  //delete
  const [productToDelete, setProductToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  // Hàm mở modal xác nhận xóa
const handleShowDeleteModal = (product) => {
  setProductToDelete(product);
  setShowDeleteModal(true);
};

// Hàm đóng modal xác nhận xóa
const handleCloseDeleteModal = () => {
  setProductToDelete(null);
  setShowDeleteModal(false);
};

// Hàm xử lý xóa sản phẩm
const handleDeleteProduct = async () => {
  if (!productToDelete) return;

  try {
    setDeleteLoading(true);
    
    await axios.delete(
      `http://localhost:9000/admin/manager-product/delete/${productToDelete._id}`,
      { withCredentials: true }
    );
    
    setDeleteLoading(false);
    handleCloseDeleteModal();
    
    // Cập nhật lại danh sách sản phẩm
    await fetchProducts();
    
    // Hiển thị thông báo thành công
    setSuccess("Xóa sản phẩm thành công!");
  } catch (error) {
    setDeleteLoading(false);
    console.error("Error deleting product:", error);
    setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.");
  }
};

  // Danh sách size và màu sắc để người dùng chọn
  const availableSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];
  const availableColors = ["Đen", "Trắng", "Đỏ", "Xanh", "Vàng", "Hồng", "Xám", "Nâu"];

  // Fetch danh sách sản phẩm khi component mount hoặc trang hiện tại thay đổi
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    console.log('hi')
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9000/admin/manager-product/${currentPage}`, {
        withCredentials: true,
      });
      console.log(response.data.products.length)
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Xử lý đóng modal và reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      name: "",
      category: "",
      brand: "",
      price: "",
      size: [],
      color: [],
      description: "",
      stock: "",
      status: "active",
      discord: 0,
    });
    setImages([]);
    setPreviewImages([]);
    setError("");
    setSuccess("");
  };

  // Xử lý mở modal
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Xử lý thay đổi size
  const handleSizeChange = (sizeValue) => {
    const sizeNumber = parseInt(sizeValue);
    if (formData.size.includes(sizeNumber)) {
      setFormData({
        ...formData,
        size: formData.size.filter((s) => s !== sizeNumber),
      });
    } else {
      setFormData({
        ...formData,
        size: [...formData.size, sizeNumber],
      });
    }
  };

  // Xử lý thay đổi màu sắc
  const handleColorChange = (colorValue) => {
    if (formData.color.includes(colorValue)) {
      setFormData({
        ...formData,
        color: formData.color.filter((c) => c !== colorValue),
      });
    } else {
      setFormData({
        ...formData,
        color: [...formData.color, colorValue],
      });
    }
  };

  // Xử lý thay đổi file hình ảnh
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      setError("Chỉ được chọn tối đa 5 hình ảnh");
      return;
    }

    // Validate file type and size
    const isValidFiles = files.every(file => {
      const fileType = file.type.split('/')[1].toLowerCase();
      const validTypes = ['jpeg', 'jpg', 'png', 'gif'];
      return validTypes.includes(fileType) && file.size <= 5 * 1024 * 1024;
    });

    if (!isValidFiles) {
      setError("Chỉ hỗ trợ file hình ảnh (jpeg, jpg, png, gif) và kích thước tối đa 5MB");
      return;
    }

    setError("");
    setImages(files);

    // Tạo preview cho hình ảnh
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate form
    if (!formData.name || !formData.category || !formData.brand || !formData.price || !formData.description || !formData.stock) {
      setError("Vui lòng điền đầy đủ thông tin sản phẩm");
      return;
    }

    if (formData.size.length === 0) {
      setError("Vui lòng chọn ít nhất một kích cỡ");
      return;
    }

    if (formData.color.length === 0) {
      setError("Vui lòng chọn ít nhất một màu sắc");
      return;
    }

    if (images.length === 0) {
      setError("Vui lòng chọn ít nhất một hình ảnh");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Tạo FormData để gửi dữ liệu và file
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("brand", formData.brand);
      data.append("price", formData.price);
      data.append("size", JSON.stringify(formData.size));
      data.append("color", JSON.stringify(formData.color));
      data.append("description", formData.description);
      data.append("stock", formData.stock);
      data.append("status", formData.status);
      data.append("discord", formData.discord);

      // Thêm các file hình ảnh
      images.forEach(image => {
        data.append("image", image);
      });

      // 📨 Gửi request giống như `login`
      const res = await axios.post(
        "http://localhost:9000/admin/manager-product/add-product",
        data,
        {
          withCredentials: true,
        }
      );

      setSuccess("Thêm sản phẩm thành công!");
      console.log("Response:", res.data);
      setLoading(false);

      fetchProducts();

      setTimeout(() => {
        handleCloseModal();
      }, 1500);
    } catch (error) {
      setLoading(false);
      console.error("Lỗi khi thêm sản phẩm:", error);


      if (error.response) {
        console.log("Server Response:", error.response.data);
        setError(error.response.data.message || "Có lỗi xảy ra khi thêm sản phẩm");
      } else {
        setError("Không thể kết nối với server");
      }
    }
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center my-3">
        <h2>Quản lý Sản phẩm</h2>
        <Button variant="primary" onClick={handleShowModal}>
          <i className="fa-solid fa-plus me-2"></i>
          Thêm sản phẩm
        </Button>
      </div>

      {/* Bảng hiển thị sản phẩm */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th style={{ width: "8%" }}>Thương hiệu</th>
            <th style={{ width: "8%" }}>Giá</th>
            <th>Size</th>
            <th>Màu sắc</th>
            <th style={{ width: "6%" }}>Tồn kho</th>
            <th style={{ width: "8%" }}>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product, index) => (
              <tr key={product._id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td style={{ width: "8%" }}>{product.brand}</td>
                <td style={{ width: "8%" }}>{product.price.toLocaleString()}</td>
                <td>{product.size.join(", ")}</td>
                <td>{product.color.join(", ")}</td>
                <td style={{ width: "6%" }}>{product.stock}</td>
                <td style={{ width: "8%" }}>
                  <span
                    className={`badge ${product.status === "sale"
                        ? "bg-danger" // Đỏ
                        : product.status === "hot"
                          ? "bg-warning text-dark" 
                          : "bg-secondary text-white"
                      }`}
                  >
                    {product.status === "sale"
                      ? "Sale"
                      : product.status === "hot"
                        ? "Hot"
                        : "Active"}
                  </span>
                </td>
                <td>
                  <Button variant="warning" size="sm" className="me-2">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleShowDeleteModal(product)}>
  <i className="fa-solid fa-trash"></i>
</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">
                {loading ? "Đang tải..." : "Không có sản phẩm nào"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Button
            variant="outline-primary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="me-2"
          >
            Trước
          </Button>
          <span className="align-self-center mx-2">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline-primary"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Sau
          </Button>
        </div>
      )}

      {/* Modal thêm sản phẩm */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sản phẩm</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nhập tên sản phẩm"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Nhập danh mục"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Thương hiệu</Form.Label>
                  <Form.Control
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="Nhập thương hiệu"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Nhập giá sản phẩm"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập mô tả sản phẩm"
                rows={3}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tồn kho</Form.Label>
                  <Form.Control
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="Số lượng tồn kho"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Còn hàng</option>
                    <option value="inactive">Hết hàng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giảm giá (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discord"
                    value={formData.discord}
                    onChange={handleInputChange}
                    placeholder="Nhập % giảm giá"
                    min={0}
                    max={100}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <Form.Check
                    key={size}
                    type="checkbox"
                    id={`size-${size}`}
                    label={size}
                    checked={formData.size.includes(size)}
                    onChange={() => handleSizeChange(size)}
                    inline
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Màu sắc</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {availableColors.map((color) => (
                  <Form.Check
                    key={color}
                    type="checkbox"
                    id={`color-${color}`}
                    label={color}
                    checked={formData.color.includes(color)}
                    onChange={() => handleColorChange(color)}
                    inline
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Hình ảnh sản phẩm (tối đa 5 hình)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <small className="text-muted">Chỉ hỗ trợ file jpg, jpeg, png, gif (tối đa 5MB/file)</small>
            </Form.Group>

            {previewImages.length > 0 && (
              <div className="mb-3">
                <p>Xem trước:</p>
                <div className="d-flex gap-2 flex-wrap">
                  {previewImages.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  ))}
                </div>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : "Thêm sản phẩm"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Modal xác nhận xóa sản phẩm */}
<Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
  <Modal.Header closeButton>
    <Modal.Title>Xác nhận xóa sản phẩm</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Bạn có chắc chắn muốn xóa sản phẩm "{productToDelete?.name}" không?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseDeleteModal} disabled={deleteLoading}>
      Hủy
    </Button>
    <Button variant="danger" onClick={handleDeleteProduct} disabled={deleteLoading}>
      {deleteLoading ? "Đang xóa..." : "Xóa"}
    </Button>
  </Modal.Footer>
</Modal>
    </Container>
  );
};

export default ManagerProduct;