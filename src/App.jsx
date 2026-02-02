import { useEffect, useRef, useState } from "react";
import * as bootstrap from "bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

import "./assets/scss/all.scss";

import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination";
import Login from "./views/Login";

const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  shipping: []
};

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [modalType, setModalType] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    has_pre: false,
    has_next: false,
  });

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`,
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const productModalRef = useRef(null);

  useEffect(() => {
    // 從 Cookie 取得 Token
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexW2Token="))
      ?.split("=")[1];
    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
    }

    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });

    // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    const checkLogin = async () => {
      try {
        const res = await axios.post(`${API_BASE}/api/user/check`);
        console.log(res.data);
        setIsAuth(true);
        getProducts();
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    checkLogin();
  }, []);

  const openModal = (type, product) => {
    setModalType(type);
    setTemplateProduct((pre) => ({
      ...pre,
      ...product,
    }));
    productModalRef.current.show();
  };

  const closeModal = () => {
    productModalRef.current.hide();
  };

  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="text-end mt-4">
            <button
              className="btn btn-primary"
              onClick={() => openModal("create", INITIAL_TEMPLATE_DATA)}
            >
              建立新的產品
            </button>
          </div>
          <h2>產品列表</h2>
          <table className="table mt-4">
            <thead>
              <tr>
                <th>分類</th>
                <th>產品名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>是否啟用</th>
                <th>編輯</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.category}</td>
                  <td>{product.title}</td>
                  <td>
                    {String(product.origin_price).replace(
                      /(\d)(?=(\d{3})+$)/g,
                      "$1,",
                    )}
                  </td>
                  <td>
                    {String(product.price).replace(/(\d)(?=(\d{3})+$)/g, "$1,")}
                  </td>
                  <td className={product.is_enabled ? "text-success" : ""}>
                    {product.is_enabled ? "啟用" : "未啟用"}
                  </td>
                  <td>
                    <div
                      className="btn-group"
                      role="group"
                      aria-label="Basic example"
                    >
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal("edit", product)}
                      >
                        編輯
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal("delete", product)}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Login
          setIsAuth={setIsAuth}
          isAuth={isAuth}
          getProducts={getProducts}
        />
      )}

      <Pagination pagination={pagination} onChangePage={getProducts} />

      <ProductModal
        getProducts={getProducts}
        modalType={modalType}
        templateProduct={templateProduct}
        closeModal={closeModal}
      />
    </>
  );
}

export default App;
