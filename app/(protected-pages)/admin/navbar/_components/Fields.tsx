'use client'

import React, { useState } from 'react';
import { Button, Row, Col, Input, Select, Space, InputNumber } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

type MenuItem = {
  id: number;
  order: number;
  label: string;
  path: string;
}

const initialData = {
  en: [
    { id: 1, order: 1, label: 'Programs', path: '/programs' },
    { id: 2, order: 2, label: 'About', path: '/about' },
    { id: 3, order: 3, label: 'Contact', path: '/contact' },
  ],
  am: [
    { id: 1, order: 1, label: 'Ծրագրեր', path: '/programs' },
    { id: 2, order: 2, label: 'Մեր մասին', path: '/about' },
    { id: 3, order: 3, label: 'Կապ', path: '/contact' },
  ],
  ru: [
    { id: 1, order: 1, label: 'Программы', path: '/programs' },
    { id: 2, order: 2, label: 'О нас', path: '/about' },
    { id: 3, order: 3, label: 'Контакты', path: '/contact' },
  ],
};

export function Fields() {
  const [selectedLang, setSelectedLang] = useState<'en' | 'am' | 'ru'>('en');
  const [data, setData] = useState(initialData);

  const handleChangeLang = (value: 'en' | 'am' | 'ru') => {
    setSelectedLang(value);
  };

  const handleUpdate = (id: number, key: keyof MenuItem, value: string | number) => {
    setData((prev) => {
      const updated = Object.fromEntries(
        Object.entries(prev).map(([lang, items]) => [
          lang,
          items.map((item) =>
            item.id === id
              ? {
                ...item,
                [key]: value,
              }
              : item
          ),
        ])
      );
      if (key === 'order') {
        Object.keys(updated).forEach((lang) => {
          updated[lang].sort((a, b) => a.order - b.order);
        });
      }

      return updated as typeof prev;
    });
  };

  const handleRemove = (id: number) => {
    setData((prev) => {
      const updated = Object.fromEntries(
        Object.entries(prev).map(([lang, items]) => [
          lang,
          items.filter((item) => item.id !== id),
        ])
      );
      return updated as typeof prev;
    });
  };


  const handleAddRow = () => {
    setData((prev) => {
      const newId =
        Math.max(
          ...Object.values(prev)
            .flat()
            .map((i) => i.id),
          0
        ) + 1;

      const newItem: MenuItem = {
        id: newId,
        order: newId,
        label: '',
        path: '',
      };

      const updated = Object.fromEntries(
        Object.entries(prev).map(([lang, items]) => [
          lang,
          [...items, { ...newItem }],
        ])
      );

      return updated as typeof prev;
    });
  };

  const saveText = {
    en: 'Save',
    am: 'Պահպանել',
    ru: 'Сохранить',
  };

  return (
    <Space className="w-full" direction="vertical">
      <Row gutter={16} align="middle" style={{ marginBottom: 12 }}>
        <Col>
          <Select
            defaultValue="en"
            style={{ width: 120 }}
            onChange={handleChangeLang}
            options={[
              { value: 'en', label: 'English' },
              { value: 'am', label: 'Armenian' },
              { value: 'ru', label: 'Russian' },
            ]}
          />
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRow}
          >
            Add Row
          </Button>
        </Col>
      </Row>


      <Space direction="vertical" className="w-full">
        {data[selectedLang].map((item) => (
          <Row key={item.id} gutter={16} align="middle">
            <Col span={2}>
              <InputNumber
                min={1}
                value={item.order}
                onChange={(val) => handleUpdate(item.id, 'order', val || 1)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={8}>
              <Input
                value={item.label}
                onChange={(e) => handleUpdate(item.id, 'label', e.target.value)}
              />
            </Col>
            <Col span={8}>
              <Input
                value={item.path}
                onChange={(e) => handleUpdate(item.id, 'path', e.target.value)}
              />
            </Col>
            <Col span={3}>
              <Button type="primary">{saveText[selectedLang]}</Button>
            </Col>
            <Col span={3}>
              <Button danger onClick={() => handleRemove(item.id)}>
                <DeleteOutlined />
              </Button>
            </Col>
          </Row>
        ))}
      </Space>
    </Space>
  );
}
