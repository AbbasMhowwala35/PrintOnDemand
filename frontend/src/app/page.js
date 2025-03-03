"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [images, setImages] = useState([]);
  const [printCounts, setPrintCounts] = useState({});

  useEffect(() => {
    disableInspect();
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await axios.get(`${BASE_URL}/admin/media`);
      setImages(res.data.data.results);

    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const disableInspect = () => {
    document.addEventListener("contextmenu", (event) => event.preventDefault());
    document.addEventListener("keydown", (event) => {
      if (
        event.ctrlKey &&
        (event.key === "u" || event.key === "U" || // View Source
          event.key === "i" || event.key === "I" || // DevTools
          event.key === "j" || event.key === "J" || // Console
          event.key === "s" || event.key === "S" || // Save
          event.key === "c" || event.key === "C" || // Copy
          event.key === "p" || event.key === "P") // Print
      ) {
        event.preventDefault();
      }
      if (event.key === "F12") {
        event.preventDefault();
      }
    });

    // Blackout for Screenshot Attempts
    const style = document.createElement("style");
    style.innerHTML = `
      @media (min-width: 100px) and (max-width: 100000px) {
        body.screenshot-detected {
          filter: blur(10px);
        }
      }
    `;
    document.head.appendChild(style);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.body.classList.add("screenshot-detected");
      } else {
        document.body.classList.remove("screenshot-detected");
      }
    });
  };

  const printImage = (id, title) => {
    if (printCounts[id] >= 3) {
      alert("Contact administrator for more prints.");
      return;
    }

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
              * {
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
              }
              @page {
                size: auto;
                margin: 0;
              }
              body::before {
                content: "CONFIDENTIAL - DO NOT SAVE";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 3em;
                color: rgba(0, 0, 0, 0.3);
              }
            }
          </style>
        </head>
        <body>
          <img src="${title}" width="100%">
          <script>
            window.onafterprint = () => window.close();
            window.print();
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();

    setPrintCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  return (
    <>
      <Container className="mt-5 text-center">
        <h1 className="mb-4 fw-bold text-primary">Welcome to the Image Print Center</h1>
        <p className="text-muted mb-5">Easily view and print your favorite images. You can print up to 3 times per image.</p>
      </Container>

      {/* Image Gallery */}
      <Container className="mt-5">
        <Row className="g-4">
          {images.map((img) => (
            <Col key={img.id} md={4} sm={6} xs={12}>
              <Card className="shadow-lg border-0 rounded-4 overflow-hidden hover-zoom">
                <Card.Img variant="top" src={img.imagePath} className="p-3 rounded" />
                <Card.Body>
                  <Card.Title className="fw-semibold text-dark">{img.title}</Card.Title>
                  <Button
                    className="w-100 mt-3 fw-bold text-white shadow-sm"
                    variant="primary"
                    onClick={() => printImage(img._id, img.imagePath)}
                  >
                    🖨️ Print Image
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Informative Section */}
      <Container className="text-center my-5 py-5 bg-light rounded shadow-sm">
        <h2 className="text-dark fw-bold">Why the 3-Print Limit?</h2>
        <p className="text-muted px-4">To ensure fair usage, each image has a limit of 3 prints. Need more prints? Contact our administrator for extended access.</p>
      </Container>

      {/* Featured Section */}
      <Container className="text-center my-5 py-5">
        <h2 className="fw-bold text-primary">Explore Our Featured Prints</h2>
        <p className="text-muted">Discover some of our most popular and high-quality images available for printing.</p>
        <img src="https://img.freepik.com/free-vector/printing-industry-illustration_23-2148880704.jpg" alt="Featured Print" className="img-fluid rounded shadow-sm mt-3" style={{ maxWidth: "80%" }} />
      </Container>

      {/* Footer */}
      <footer className="text-center text-white bg-dark py-4 mt-5">
        <p className="mb-0">&copy; {new Date().getFullYear()} Image Print Center. All Rights Reserved.</p>
        <p className="small">Need help? <a href="mailto:support@example.com" className="text-white text-decoration-none">Contact Us</a></p>
      </footer>
    </>
  );
}
