import { createHashRouter } from "react-router";
import FrontendLayout from "../layout/FrontendLayout";
import Home from "../views/front/Home";
import Products from "../views/front/Products";
import SingleProduct from "../views/front/SingleProduct";
import Cart from "../views/front/Cart";
import FrontNotFound from "../views/front/FrontNotFound";

export const router = createHashRouter([
    {
        path: '/',
        element: <FrontendLayout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'products',
                element: <Products />
            },
            {
                path: 'product/:id',
                element: <SingleProduct />
            },
            {
                path: 'cart',
                element: <Cart />
            },
        ]
    }, {
        path: '*',
        element: <FrontNotFound />
    }
])