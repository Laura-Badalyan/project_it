'use client'

import '@ant-design/v5-patch-for-react-19';
import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Input, Select, Space, InputNumber, Modal, Switch } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

type MenuItem = {
  id: number;
  order: number;
  label: string;
  path: string;
  visible: boolean;
};

const initialData = {
  en: [
    { id: 1, order: 1, label: 'Programs', path: '/programs', visible: true },
    { id: 2, order: 2, label: 'About', path: '/about', visible: true },
    { id: 3, order: 3, label: 'Contact', path: '/contact', visible: true },
  ],
  am: [
    { id: 1, order: 1, label: 'Ծրագրեր', path: '/programs', visible: true },
    { id: 2, order: 2, label: 'Մեր մասին', path: '/about', visible: true },
    { id: 3, order: 3, label: 'Կապ', path: '/contact', visible: true },
  ],
  ru: [
    { id: 1, order: 1, label: 'Программы', path: '/programs', visible: true },
    { id: 2, order: 2, label: 'О нас', path: '/about', visible: true },
    { id: 3, order: 3, label: 'Контакты', path: '/contact', visible: true },
  ],
};

export function Fields() {
  const [selectedLang, setSelectedLang] = useState<'en' | 'am' | 'ru'>('en');
  const [data, setData] = useState(initialData);
  const [localData, setLocalData] = useState<MenuItem[]>([]);
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    setLocalData(data[selectedLang].map(item => ({ ...item })));
  }, [selectedLang, data]);

  const handleChangeLang = (value: 'en' | 'am' | 'ru') => {
    setSelectedLang(value);
  };

  const handleAddRow = () => {
    const newId = Math.max(...localData.map(i => i.id), 0) + 1;
    const newItem: MenuItem = { id: newId, order: newId, label: '', path: '', visible: true };

    const updatedLocal = [...localData, newItem];
    setLocalData(updatedLocal);

    const updatedData = { ...data };
    Object.keys(updatedData).forEach(lang => {
      updatedData[lang as keyof typeof updatedData] = [
        ...(updatedData[lang as keyof typeof updatedData] || []),
        { ...newItem }
      ];
    });
    setData(updatedData);

    console.log('Added item:', { ...newItem, lang: selectedLang });
  };

  const handleUpdate = (id: number, field: keyof MenuItem, value: string | number | boolean) => {
    setLocalData((prevLocal) => {
      const updatedLocal = prevLocal.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      updatedLocal.sort((a, b) => a.order - b.order);

      setData((prevData) => {
        const updatedData: typeof data = { ...prevData };
        Object.keys(updatedData).forEach((lang) => {
          updatedData[lang as keyof typeof updatedData] = updatedData[lang as keyof typeof updatedData]
            .map(item => item.id === id ? { ...item, [field]: value } : item)
            .sort((a, b) => a.order - b.order);
        });
        return updatedData;
      });

      const updatedItem = updatedLocal.find(item => item.id === id);
      if (updatedItem) {
        // console.log('Updated item:', { ...updatedItem, lang: selectedLang });
      }

      return updatedLocal;
    });
  };

  const handleToggleVisibility = (id: number, visible: boolean) => {
    handleUpdate(id, 'visible', visible);
  };

  const handleSave = (id: number) => {
    const updatedData = { ...data };
    const itemIndex = localData.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    Object.keys(updatedData).forEach(lang => {
      const langData = updatedData[lang as keyof typeof updatedData];
      const indexInLang = langData.findIndex(i => i.id === id);
      if (indexInLang !== -1) {
        langData[indexInLang] = { ...localData[itemIndex] };
      }
      langData.sort((a, b) => a.order - b.order);
    });

    setData(updatedData);

    const logObj = { ...localData[itemIndex], lang: selectedLang };
    console.log('Saved item:', logObj);
  };

  const handleRemove = (id: number) => {
    const deletedItem = data[selectedLang].find((i) => i.id === id);
    if (!deletedItem) return;

    modal.confirm({
      title: 'Are you sure you want to delete this menu item?',
      content: `Label: ${deletedItem.label}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const updatedData: typeof data = { ...data };
        Object.keys(updatedData).forEach((lang) => {
          updatedData[lang as keyof typeof updatedData] = updatedData[lang as keyof typeof updatedData].filter(
            (i) => i.id !== id
          );
        });
        setData(updatedData);

        console.log('Deleted menu item:', { ...deletedItem, lang: selectedLang });

        setLocalData(localData.filter((i) => i.id !== id));
      },
      onCancel: () => {
        console.log('Delete cancelled');
      },
    });
  };

  const saveText = { en: 'Save', am: 'Պահպանել', ru: 'Сохранить' };

  return (
    <>
      {contextHolder}
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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRow}>
              Add Row
            </Button>
          </Col>
        </Row>

        <Space direction="vertical" className="w-full">
          {localData.map((item) => (
            <Row key={item.id} gutter={16} align="middle">
              <Col span={2}>
                <InputNumber
                  min={1}
                  value={item.order}
                  onChange={(val) => handleUpdate(item.id, 'order', val || 1)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={7}>
                <Input
                  value={item.label}
                  onChange={(e) => handleUpdate(item.id, 'label', e.target.value)}
                />
              </Col>
              <Col span={7}>
                <Input
                  value={item.path}
                  onChange={(e) => handleUpdate(item.id, 'path', e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Space>
                  <Button type="primary" onClick={() => handleSave(item.id)}>
                    {saveText[selectedLang]}
                  </Button>
                  <Button danger onClick={() => handleRemove(item.id)}>
                    <DeleteOutlined />
                  </Button>
                  <Switch
                    checked={item.visible}
                    onChange={(checked) => handleToggleVisibility(item.id, checked)}
                    style={{
                      backgroundColor: item.visible ? '#1890ff' : '#ccc',
                    }}
                  />
                </Space>
              </Col>
            </Row>
          ))}
        </Space>
      </Space>
    </>
  );
}