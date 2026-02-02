import { useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE;

function Login({ getProducts, setIsAuth, isAuth }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginMessage, setLoginMessage] = useState("");
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((preData) => ({
      ...preData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);        
      const { token, expired } = res.data;
      document.cookie = `hexW2Token=${token}; expires=${new Date(expired)}`;
      axios.defaults.headers.common["Authorization"] = token;
      setIsAuth(true);
      setLoginMessage("登入成功");
      getProducts();
    } catch (error) {
      console.error(error);
      setIsAuth(false);
      setLoginMessage(error?.response.data?.message);
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoginMessage("");
      }, 1000);
    }
  };
  return (
    <>
      <div className="container login">
        <div className="row justify-content-center">
          <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
          <div className="col-8">
            <form id="form" className="form-signin" onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="username"
                  name="username"
                  placeholder="name@example.com"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  autoFocus
                />
                <label htmlFor="username">Email address</label>
              </div>
              <div className="form-floating">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              <button
                className="btn btn-lg btn-primary w-100 mt-3"
                type="submit"
              >
                登入
              </button>
            </form>
            {loginMessage && (
              <p
                className={`h3 mt-3 
                  ${isAuth ? "text-success" : "text-danger"}`}
              >
                {loginMessage}
              </p>
            )}
          </div>
        </div>
        <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
      </div>
    </>
  );
}

export default Login;
