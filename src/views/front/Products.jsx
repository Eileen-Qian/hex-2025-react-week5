import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/${API_PATH}/products`);
        setProducts(res.data.products);
      } catch (error) {
        console.error(error);
      }
    };
    getProducts();
  }, []);

  const goSingleProduct = (id) => {
    navigate(`/product/${id}`);
  };

  const addCart = async (id, qty = 1) => {
    const data = {
      product_id: id,
      qty,
    };
    try {
      const url = `${API_BASE}/api/${API_PATH}/cart`;
      const res = await axios.post(url, { data });
      alert(res.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <div className="row mt-5">
        {products.map((product) => (
          <div className="col-md-4 mb-3" key={product.id}>
            <div className="card h-100">
              <img
                src={product.imageUrl}
                className="card-img-top"
                alt={product.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{product.content}</p>
                <div
                  className="btn-group btn-group-sm w-100"
                  role="group"
                  aria-label="Small button group"
                >
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={() => goSingleProduct(product.id)}
                  >
                    查看細節
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => addCart(product.id)}
                  >
                    加入購物車
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
