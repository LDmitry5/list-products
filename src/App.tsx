import { useEffect, type FC } from "react";
import { ConfigProvider } from "antd";
import LoginForm from "@/components/LoginForm";
import ProductList from "@/components/ProductList";
import { useAuthStore } from "@/store/useAuthStore";
import "@/App.css";

const App: FC = () => {
  const { token } = useAuthStore();

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    if (storedToken) {
      useAuthStore.getState().setToken(storedToken, true);
    }
  }, []);

  if (!token) {
    return <LoginForm />;
  }

  return (
    <ConfigProvider>
      <ProductList />
    </ConfigProvider>
  );
};

export default App;
