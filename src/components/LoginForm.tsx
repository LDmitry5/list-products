import { useState, type CSSProperties, type FC } from "react";
import { Flex, Form, Input, Button, Checkbox, message } from "antd";
import { useAuthStore } from "@/store/useAuthStore";
import form from "@/components/LoginForm.module.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import type { IAuth } from "@/types/types";

const boxStyle: CSSProperties = {
  width: 515,
  background: "linear-gradient(180deg, rgba(35, 35, 35, 0.03) 0%, rgba(35, 35, 35, 0) 50%)",
  borderRadius: 34,
  paddingBlock: 58,
  paddingInline: 48,
  border: "1px solid #40a9ff",
  margin: "10px auto",
  boxSizing: "border-box",
};

const LoginForm: FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPersistent, setIsPersistent] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      message.error("Заполните все поля");
      return;
    }

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Неверный логин или пароль");
      }

      const data: IAuth = await response.json();
      useAuthStore.getState().setToken(data.accessToken, isPersistent);
      message.success("Вход выполнен");
    } catch (error) {
      if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
        message.error(error.message);
      }
    }
  };

  return (
    <Flex vertical style={boxStyle} justify="center" align="center">
      <h1 className={form.title}>Добро пожаловать</h1>
      <h4 className={form.subtitle}>Пожалуйста, авторизуйтесь</h4>
      <Form layout="vertical" style={{ width: "100%" }} onFinish={handleLogin}>
        <Form.Item label="Логин" rules={[{ required: true }]}>
          <Input
            prefix={<UserOutlined />}
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Item>
        <Form.Item label="Пароль" rules={[{ required: true }]}>
          <Input.Password
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Checkbox
            style={{ width: "100%" }}
            checked={isPersistent}
            onChange={(e) => setIsPersistent(e.target.checked)}>
            Запомнить данные
          </Checkbox>
        </Form.Item>
        <Button className={form.submit} type="primary" htmlType="submit">
          Войти
        </Button>
      </Form>
      <Flex justify="center" align="center" style={{ width: "100%", margin: "16px 0 32px" }}>
        <hr className={form.hr} />
        <span className={form.text}>или</span>
        <hr className={form.hr} />
      </Flex>
      <Flex justify="center" align="center">
        <span className={form.textCreate}>Нет аккаунта?</span>
        <Button className={form.btnCreate} type="link">
          Создать
        </Button>
      </Flex>
    </Flex>
  );
};

export default LoginForm;
