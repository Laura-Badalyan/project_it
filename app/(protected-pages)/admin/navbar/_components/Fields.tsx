'use client'

import React, { useState } from 'react';
import { Button, Row, Col, Input, Select, Space } from 'antd';

export function Fields() {
  const [selectedLang, setSelectedLang] = useState('en');

  const handleChange = (value: string) => {
    setSelectedLang(value)
  }

  return (
    <Space className="w-full" direction="vertical">
      <Select
        defaultValue="en"
        style={{ width: 120 }}
        onChange={handleChange}
        options={[
          { value: 'en', label: 'English' },
          { value: 'am', label: 'Armenian' },
          { value: 'ru', label: 'Russian' },
        ]}
      />

      {selectedLang === 'en' && (
        <Space direction="vertical" className="w-full">
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Input value="Programs"  />
            </Col>
            <Col span={8}>
              <Input value="/programs"  />
            </Col>
            <Col span={8}>
              <Button type="primary" >
                Save
              </Button>
            </Col>
          </Row>
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Input value="About"  />
            </Col>
            <Col span={8}>
              <Input value="/about"  />
            </Col>
            <Col span={8}>
              <Button type="primary" >
                Save
              </Button>
            </Col>
          </Row>
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Input value="Contact"  />
            </Col>
            <Col span={8}>
              <Input value="/contact"  />
            </Col>
            <Col span={8}>
              <Button type="primary" >
                Save
              </Button>
            </Col>
          </Row>
        </Space>
      )}

      {selectedLang === 'am' && (
           <Space direction="vertical" className="w-full">
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Input value="Ծրագրեր"  />
              </Col>
              <Col span={8}>
                <Input value="/programs"  />
              </Col>
              <Col span={8}>
                <Button type="primary" >
                  Պահպանել
                </Button>
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Input value="Մեր մասին"  />
              </Col>
              <Col span={8}>
                <Input value="/about"  />
              </Col>
              <Col span={8}>
                <Button type="primary" >
                  Պահպանել
                </Button>
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Input value="Կապ"  />
              </Col>
              <Col span={8}>
                <Input value="/contact"  />
              </Col>
              <Col span={8}>
                <Button type="primary" >
                  Պահպանել
                </Button>
              </Col>
            </Row>
          </Space>
        )}

        {selectedLang === 'ru' && (
            <Space direction="vertical" className="w-full">
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Input value="Программы"  />
              </Col>
              <Col span={8}>
                <Input value="/programs"  />
              </Col>
              <Col span={8}>
                <Button type="primary" >
                  Сохранить
                </Button>
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Input value="О нас"  />
              </Col>
              <Col span={8}>
                <Input value="/about"  />
              </Col>
              <Col span={8}>
                <Button type="primary" >
                  Сохранить
                </Button>
              </Col>
            </Row>
            <Row gutter={16} align="middle">
              <Col span={8}>
                <Input value="Контакты"  />
              </Col>
              <Col span={8}>
                <Input value="/contact"  />
              </Col>
              <Col span={8}>
                <Button type="primary" >
                  Сохранить
                </Button>
              </Col>
            </Row>
          </Space>
        )}

    </Space>
  )

};
