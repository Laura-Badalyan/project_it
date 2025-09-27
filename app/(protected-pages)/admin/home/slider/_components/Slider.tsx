'use client'

import '@ant-design/v5-patch-for-react-19';
import { useState, useEffect } from 'react';
import { Button, Row, Col, Input, Select, Space, InputNumber, Modal, Switch, Upload, message, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';
import Image from 'next/image';

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
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setLocalData(data[selectedLang].map(item => ({ ...item })));
  }, [selectedLang, data]);

  const handleChangeLang = (value: Lang) => {
    setSelectedLang(value);
  };

  const handleAddSlider = () => {
    const newId = `slider-${Date.now()}`;
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
        console.log('Updated slider item:', { ...updatedItem, lang: selectedLang });
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

  const handleImageUpload = (id: string, file: File) => {
    setUploading(true);

    setTimeout(() => {
      const imageUrl = URL.createObjectURL(file);
      handleUpdate(id, 'image', imageUrl);
      setUploading(false);
      message.success('Image uploaded successfully');

      console.log('Uploaded image for slider:', { id, imageUrl, lang: selectedLang });
    }, 1000);
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }

      return true;
    },
    fileList,
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList);
    },
  };

  const saveText = { en: 'Save', am: 'Պահպանել', ru: 'Сохранить' };
  const descriptionText = { en: 'Description', am: 'Նկարագրություն', ru: 'Описание' };
  const uploadText = { en: 'Upload', am: 'Վերբեռնել', ru: 'Загрузить' };

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

              <Col span={8}>
                <Tooltip title={item.description}>
                  <Input
                    value={item.description}
                    onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                    placeholder={descriptionText[selectedLang]}
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
                
                  {item.image ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Image
                        src={item.image}
                        alt="Slider preview"
                        width={50}
                        height={30}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk6MeobSfWUUKBF4I9w6kNNqLUwX4z1//9k="
                        loading="lazy"
                        quality={75}
                        sizes="50px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'block';
                        }}
                      />
                      <Button
                        size="small"
                        onClick={() => window.open(item.image, '_blank')}
                        icon={<EyeOutlined />}
                      >
                        View
                      </Button>
                    </div>
                  ) : (
                    <Upload
                      {...uploadProps}
                      customRequest={({ file, onSuccess, onError }) => {
                        if (file instanceof File) {
                          handleImageUpload(item.id, file);
                          onSuccess?.('ok');
                        } else {
                          onError?.(new Error('Invalid file'));
                        }
                      }}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />} loading={uploading}>
                        {uploadText[selectedLang]}
                      </Button>
                    </Upload>
                  )}
                </Space>
              </Col>

           
            </Row>
          ))}
        </Space>
      </Space>
    </>
  );
}