'use client'

import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from 'react';
import { Button, Row, Col, Input, Select, Space, InputNumber, Modal, Switch, message, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

type SliderItem = {
  id: string;
  description: string;
  image: string;
  lang: string;
  order: number;
  visible: boolean;
};

type Lang = 'en' | 'am' | 'ru';

const initialSliderData = {
  en: [],
  am: [],
  ru: [],
};

export function Slider() {
  const [selectedLang, setSelectedLang] = useState<Lang>('en');
  const [data, setData] = useState<Record<Lang, SliderItem[]>>(initialSliderData);
  const [localData, setLocalData] = useState<SliderItem[]>([]);
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    setLocalData(data[selectedLang].map(item => ({ ...item })));
  }, [selectedLang, data]);

  const handleChangeLang = (value: Lang) => {
    setSelectedLang(value);
  };

  const handleAddSlider = () => {
    const newId = Math.max(...localData.map(i => i.id), 0) + 1;
    const maxOrder = localData.length > 0 ? Math.max(...localData.map(i => i.order)) : 0;
    const newItem: SliderItem = {
      id: newId,
      description: '',
      image: '',
      lang: selectedLang,
      order: maxOrder + 1,
      visible: true
    };

    const updatedLocal = [...localData, newItem];
    setLocalData(updatedLocal);

    const updatedData = { ...data };
    Object.keys(updatedData).forEach(lang => {
      updatedData[lang as Lang] = [
        ...(updatedData[lang as Lang] || []),
        { ...newItem, lang: lang as Lang }
      ];
    });
    setData(updatedData);

    console.log('Added slider item:', { ...newItem, lang: selectedLang });
  };

  const handleUpdate = (id: string, field: keyof SliderItem, value: string | number | boolean) => {
    setLocalData((prevLocal) => {
      const updatedLocal = prevLocal.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      updatedLocal.sort((a, b) => a.order - b.order);

      setData((prevData) => {
        const updatedData: typeof data = { ...prevData };
        Object.keys(updatedData).forEach((lang) => {
          updatedData[lang as Lang] = updatedData[lang as Lang]
            .map(item => item.id === id ? { ...item, [field]: value } : item)
            .sort((a, b) => a.order - b.order);
        });
        return updatedData;
      });

      const updatedItem = updatedLocal.find(item => item.id === id);
      if (updatedItem) {
        // console.log('Updated slider item:', { ...updatedItem, lang: selectedLang });
      }

      return updatedLocal;
    });
  };

  const handleToggleVisibility = (id: string, visible: boolean) => {
    handleUpdate(id, 'visible', visible);
  };

  const handleSave = (id: string) => {
    const updatedData = { ...data };
    const itemIndex = localData.findIndex(i => i.id === id);
    if (itemIndex === -1) return;

    Object.keys(updatedData).forEach(lang => {
      const langData = updatedData[lang as Lang];
      const indexInLang = langData.findIndex(i => i.id === id);
      if (indexInLang !== -1) {
        langData[indexInLang] = { ...localData[itemIndex] };
      }
      langData.sort((a, b) => a.order - b.order);
    });

    setData(updatedData);

    const logObj = { ...localData[itemIndex], lang: selectedLang };
    console.log('Saved slider item:', logObj);
    message.success('Slider item saved successfully');
  };

  const handleRemove = (id: string) => {
    const deletedItem = data[selectedLang].find((i) => i.id === id);
    if (!deletedItem) return;

    modal.confirm({
      title: 'Are you sure you want to delete this slider item?',
      content: `Description: ${deletedItem.description || 'No description'}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        const updatedData: typeof data = { ...data };
        Object.keys(updatedData).forEach((lang) => {
          updatedData[lang as Lang] = updatedData[lang as Lang].filter(
            (i) => i.id !== id
          );
        });
        setData(updatedData);

        console.log('Deleted slider item:', { ...deletedItem, lang: selectedLang });
        message.success('Slider item deleted successfully');

        setLocalData(localData.filter((i) => i.id !== id));
      },
      onCancel: () => {
        console.log('Delete cancelled');
      },
    });
  };

  const saveText = { en: 'Save', am: 'Պահպանել', ru: 'Сохранить' };
  const descriptionText = { en: 'Description', am: 'Նկարագրություն', ru: 'Описание' };

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
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddSlider}>
              Add Slider
            </Button>
          </Col>
        </Row>

        <Space direction="vertical" className="w-full">
          {localData.map((item) => (
            <Row key={item.id} gutter={16} align="middle" style={{ marginBottom: 16, padding: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
              <Col span={2}>
                <InputNumber
                  min={1}
                  value={item.order}
                  onChange={(val) => handleUpdate(item.id, 'order', val || 1)}
                  style={{ width: '100%' }}
                  placeholder="Order"
                />
              </Col>

              <Col span={4}>
                <Tooltip title={item.description}>
                  <Input
                    value={item.description}
                    onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                    placeholder={descriptionText[selectedLang]}
                  />
                </Tooltip>
              </Col>

              <Col span={4}>
                <Tooltip title={item.description}>
                  <Input
                    value={item.image}
                    onChange={(e) => handleUpdate(item.id, 'image', e.target.value)}
                  />
                </Tooltip>
              </Col>

              <Col span={14}>
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