import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import Pagination from "../..//components/Pagination.jsx";

// 純 API 呼叫，不含 setState，放在元件外部
const fetchProducts = async (page = 1) => {
  const res = await axios.get(`${API_BASE}/api/${API_PATH}/products?page=${page}`);
  return res.data;
};

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_pre: false,
    has_next: false,
  });

  // useEffect 內部定義完整的 async 函式，避免 cascading renders
  useEffect(() => {
    const init = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data.products);
        setPagination(data.pagination);
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  // 給 Pagination 和其他事件使用的函式
  const getProducts = async (page = 1) => {
    try {
      const data = await fetchProducts(page);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error(error);
    }
  };

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
        <Pagination pagination={pagination} onChangePage={getProducts} />
      </div>
    </div>
  );
}

export default Products;
