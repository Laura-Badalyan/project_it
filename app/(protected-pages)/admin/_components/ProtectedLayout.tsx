'use client';

import React, { useState, useEffect } from 'react';
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
  PictureOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Layout, Menu, theme, Spin } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href="/admin/dashboard">Dashboard</Link>, '/admin/dashboard', <PieChartOutlined />),
  getItem(<Link href="/admin/navbar">Navbar</Link>, '/admin/navbar', <DesktopOutlined />),
  getItem('Home Page', 'sub1', <UserOutlined />, [
    getItem(<Link href="/admin/home/services">Services</Link>, '/admin/home/services', <AppstoreOutlined />),
    getItem(<Link href="/admin/home/slider">Slider</Link>, '/admin/home/slider', <PictureOutlined />),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem('Team 1', '6'),
    getItem('Team 2', '8'),
  ]),
  getItem('Files', '9', <FileOutlined />),
];

export function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  const getDefaultKey = () => {
    if (pathname.startsWith('/admin/dashboard')) return '1';
    if (pathname.startsWith('/admin/navbar')) return '2';
    return '1';
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: '1px',
            background: '#001529',
          }}
        >
          Welcome
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={[getDefaultKey()]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '1rem',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'right',
            alignItems: 'center',
          }}
        >
          <button>logout</button>
        </Header>
        <Content style={{ margin: '0 16px' }}>
          <div>{children}</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          {new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
}
