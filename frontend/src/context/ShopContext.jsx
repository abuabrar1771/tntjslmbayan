import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext();

// 🌟 CRITICAL GLOBAL CONFIGURATION: Forces Axios to attach your HttpOnly cookie to every request
axios.defaults.withCredentials = true;

const ShopContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const currency = "₹";
  const delivery_fee = 10;
  const navigate = useNavigate();

  // ---------------- STATE DECLARATIONS ----------------
  // 🌟 Token now acts as a reactive Boolean UI toggle flag instead of a raw key string
  const [token, setToken] = useState(
    localStorage.getItem("token") === "true" ? true : null,
  );
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  
  // 🌟 FIX: Automatically hydrate userProfile from your localStorage backup right on boot!
  const [userProfile, setUserProfile] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ---------------- FETCH MASTER PRODUCTS ----------------
  const getProductsData = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/product/list`);
      if (res.data.success) {
        setProducts(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Product fetch failure:", err);
      toast.error(err.message);
    }
  };

  // ---------------- FETCH USER PROFILE ----------------
  const getUserProfile = async (directProfileData = null) => {
    if (directProfileData) {
      setUserProfile(directProfileData);
      setToken(true);
      localStorage.setItem("token", "true");
      localStorage.setItem("user", JSON.stringify(directProfileData)); // 🌟 Save backup
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/user/profile`, {});

      if (res.data.success) {
        setUserProfile(res.data.user);
        setToken(true);
        localStorage.setItem("token", "true");
        localStorage.setItem("user", JSON.stringify(res.data.user)); // 🌟 Save backup
      } else {
        if (token) logout();
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      }
    }
  };

  // ---------------- ADD TO CART (ARRAY BASED) ----------------
  const addToCart = (itemDetail) => {
    setCartItems((prev) => {
      const updatedCart = [...prev, itemDetail];
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
    return { data: { success: true } };
  };

  // ---------------- UPDATE CART QUANTITY ----------------
  const updateCartQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prev) => {
      const updatedCart = [...prev];
      const item = updatedCart[index];

      if (item) {
        const unitPrice = item.totalAmount / (item.quantity || 1);
        item.quantity = newQuantity;
        item.totalAmount = unitPrice * newQuantity;
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  // ---------------- CART TOTALS CALCULATORS ----------------
  const getCartAmount = () => {
    return cartItems.reduce(
      (total, item) => total + (Number(item.totalAmount) || 0),
      0,
    );
  };

  const getCartCount = () => {
    return cartItems.length;
  };

  // ---------------- CLEAR CART DATA ----------------
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  // ---------------- AUTHENTICATION LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    localStorage.removeItem("user"); // Purge old static data profile hooks
    setToken(null);
    setUserProfile(null);
    setCartItems([]);
    toast.success("Logged out successfully");
    navigate("/");
  };

  // ---------------- LIFECYCLE RUNTIME HYDRATION ----------------
  useEffect(() => {
    getProductsData();

    // Hydrate cart data from local storage
    const localCart = localStorage.getItem("cart");
    if (localCart) {
      try {
        setCartItems(JSON.parse(localCart));
      } catch (error) {
        console.error("Cart hydration exception:", error);
        setCartItems([]);
      }
    }

    // 🌟 Check cookie validity with backend upon app load if token layout state is flag active
    const localTokenFlag = localStorage.getItem("token");
    if (localTokenFlag === "true") {
      getUserProfile();
    }
  }, []);

  // ---------------- VALUE INJECTION DISPATCH MAPPING ----------------
  const value = {
    navigate,
    backendUrl,
    currency,
    delivery_fee,
    token,
    setToken,
    products,
    cartItems,
    setCartItems,
    addToCart,
    getCartAmount,
    getCartCount,
    logout,
    updateCartQuantity,
    clearCart,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    userProfile,
    setUserProfile,
    getUserProfile,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
