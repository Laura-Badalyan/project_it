"use client";

import React from "react";
import { Form, Input, Button, Card } from "antd";

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginForm() {
  const onFinish = (values: LoginFormValues) => {
    console.log("Login values:", values);
  };

  return (
    <Card className="w-full max-w-md shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <Form<LoginFormValues> layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
