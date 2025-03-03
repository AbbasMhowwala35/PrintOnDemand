"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, Container, Card, Alert, Navbar, Nav } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminPage() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imageTitle, setImageTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [downloadLimit, setDownloadLimit] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
      setToken(token)
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchImages();
      fetchCategories();
    }
  }, [isLoggedIn]);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/media`, {
      });
      console.log(res)
      setImages(res.data.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data.results);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id)
    try {
      await axios.delete(`${BASE_URL}/admin/media/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImages(images.filter((img) => img._id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleUpload = async () => {
    if (!imageTitle || !selectedFile || !selectedCategory) {
      alert("Please fill all fields!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("title", imageTitle);
      formData.append("file", selectedFile);
      formData.append("download_limit", downloadLimit);
      formData.append("category_id", selectedCategory);
      await axios.post(`${BASE_URL}/admin/media`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await axios.post(
        `${BASE_URL}/admin/category`,
        { name: newCategory },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewCategory("");
      setShowCategoryModal(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setIsChanged(false);
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    setNewCategoryName(e.target.value);
    setIsChanged(e.target.value !== selectedCategory.name);
  };

  const handleSaveChanges = async () => {
    if (!selectedCategory) return;
    try {
      await axios.patch(
        `${BASE_URL}/admin/category/${selectedCategory.id}`,
        { name: newCategoryName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowEditModal(false);
      fetchCategories(); 
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${BASE_URL}/admin/category/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/admin/login`, {
        email: username,
        password: password,
      });

      if (response.data.status === 1) {
        setIsLoggedIn(true);
        setError("");
        localStorage.setItem("authToken", response.data.data.token);
      } else {
        setError("Invalid Username or Password! Try Again.");
      }
    } catch (error) {
      setError("Login Failed! Please check your credentials.");
    }
  };
  //   if (username === "admin" && password === "admin123") {
  //     setIsLoggedIn(true);
  //     setError("");
  //   } else {
  //     setError("Invalid Username or Password! Try Again.");
  //   }
  // };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
      setUsername("");
      setPassword("");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
        <Card className="p-4 shadow-lg text-center rounded-4" style={{ width: "400px" }}>
          <h3 className="fw-bold text-primary">Admin Login</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form className="my-5">
            <Form.Group className="mb-3">
              {/* <Form.Label>Username</Form.Label> */}
              <Form.Control type="text" placeholder="Enter Admin Username" onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-5">
              {/* <Form.Label>Password</Form.Label> */}
              <Form.Control type="password" placeholder="Enter Admin Password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" className="w-100 shadow-sm " onClick={handleLogin}>
              Login
            </Button>
          </Form>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="d-flex flex-column align-items-center mt-5">
      <Navbar bg="dark" variant="dark" className="w-100 mb-4 shadow-lg rounded">
        <Container>
          <Navbar.Brand className="fw-bold">Admin Panel</Navbar.Brand>
          <Nav>
            <Button variant="secondary" className="me-2" href="/">Back to Website</Button>
            <Button variant="danger" onClick={handleLogout}>Logout</Button>
          </Nav>
        </Container>
      </Navbar>
      <div className="text-end w-100 my-3">
        <Button variant="success" className="mb-3 px-4 py-2 shadow-sm" onClick={() => setShowModal(true)}>
          + Upload New Image
        </Button>
      </div>
      <div className="w-100">
        <Table striped bordered hover responsive className="text-center shadow-lg bg-white rounded-3">
          <thead className="bg-dark text-light">
            <tr>
              <th>Title</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img._id}>
                <td className="align-middle">{img.title}</td>
                <td>
                  <img src={img.url} alt={img.title} width="100" className="rounded shadow-sm" />
                </td>
                <td className="align-middle">
                  <Button variant="danger" className="shadow-sm" onClick={() => handleDelete(img.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="category_table w-100">
        {/* Categories Table */}
        <div className="w-100 mt-5">
          <h4 className="text-center mb-3">Categories</h4>
          <Table striped bordered hover responsive className="text-center shadow-lg bg-white rounded-3">
            <thead className="bg-dark text-light">
              <tr>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id}>
                  <td className="align-middle">{cat.name}</td>
                  <td className="align-middle">
                    <Button variant="warning" className="me-2" onClick={() => handleEditCategory(cat)}>
                      Edit
                    </Button>
                    <Button variant="danger" className="shadow-sm" onClick={() => handleDeleteCategory(cat.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter image title" onChange={(e) => setImageTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Select Image</Form.Label>
              <Form.Control type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Download Limit</Form.Label>
              <Form.Control type="number" placeholder="Enter download limit" onChange={(e) => setDownloadLimit(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <div className="d-flex">
                <Form.Select onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="" disabled>Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
                <Button variant="outline-primary" className="ms-2" onClick={() => setShowCategoryModal(true)}>
                  +
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpload} className="shadow-sm">
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Add Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control type="text" placeholder="Enter category name" onChange={(e) => setNewCategory(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCategory}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                value={newCategoryName}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} disabled={!isChanged}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}