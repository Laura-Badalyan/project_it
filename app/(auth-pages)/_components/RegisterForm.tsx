"use client";

import '@ant-design/v5-patch-for-react-19';
import React from "react";
import { Form, Input, Button, Card } from "antd";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterForm() {
  const onFinish = (values: RegisterFormValues) => {
    console.log("Register values:", values);
  };

  return (
    <Card className="w-full max-w-md shadow-xl rounded-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <Form<RegisterFormValues> layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Enter a valid email" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: "Password is required" }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Register
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
