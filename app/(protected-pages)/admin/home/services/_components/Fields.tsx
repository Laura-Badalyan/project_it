'use client'

import '@ant-design/v5-patch-for-react-19';
import { useState } from 'react';
import { Button, Col, Input, InputNumber, Modal, Row, Select, Space, Tooltip, Switch } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

type ServiceItem = {
    id: number;
    order: number;
    descr: string;
    visible: boolean;
}

type Lang = 'en' | 'am' | 'ru';

export function Fields() {
    const saveText: Record<Lang, string> = {
        en: 'Save',
        am: 'Պահպանել',
        ru: 'Сохранить',
    };

    const [selectedLang, setSelectedLang] = useState<Lang>('en');
    const [modal, contextHolder] = Modal.useModal();

    const [data, setData] = useState<Record<Lang, ServiceItem[]>>({
        en: [
            { id: 1, order: 1, descr: 'Implementation and maintenance of server systems of any complexity', visible: true },
            { id: 2, order: 2, descr: 'Design, implementation and maintenance of networks of any complexity', visible: true },
            { id: 3, order: 3, descr: 'Technical and software maintenance of computers', visible: true },
            { id: 4, order: 4, descr: 'Design, installation and maintenance of security systems', visible: true },
            { id: 5, order: 5, descr: 'Website design, development and maintenance', visible: true },
            { id: 6, order: 6, descr: 'Information security consulting', visible: true },
            { id: 7, order: 7, descr: 'Design, development and maintenance of computer and mobile applications', visible: true },
            { id: 8, order: 8, descr: 'Installation of surveillance systems', visible: true },
            { id: 9, order: 9, descr: 'Design, installation and maintenance of IP telephone systems', visible: true },
        ],
        am: [
            { id: 1, order: 1, descr: 'Ցանկացած բարդության սերվերային համակարգերի ներդրում և սպասարկում', visible: true },
            { id: 2, order: 2, descr: 'Ցանկացած բարդության ցանցերի նախագծում, ներդրում և սպասարկում', visible: true },
            { id: 3, order: 3, descr: 'Համակարգիչների տեխնիկական և ծրագրային սպասարկում', visible: true },
            { id: 4, order: 4, descr: 'Անվտանգության համակարգերի նախագծում, տեղադրում և սպասարկում', visible: true },
            { id: 5, order: 5, descr: 'Կայքերի նախագծում, պատրաստում և սպասարկում', visible: true },
            { id: 6, order: 6, descr: 'Տեղեկատվական անվտանգության խորհրդատվություն', visible: true },
            { id: 7, order: 7, descr: 'Համակարգչային և բջջային ծրագրերի նախագծում, պատրաստում և սպասարկում', visible: true },
            { id: 8, order: 8, descr: 'Տեսահսկման համակարգերի տեղադրում', visible: true },
            { id: 9, order: 9, descr: 'IP հեռախոսակայանների նախագծում, տեղադրում և սպասարկում', visible: true },
        ],
        ru: [
            { id: 1, order: 1, descr: 'Внедрение и обслуживание серверных систем любой сложности', visible: true },
            { id: 2, order: 2, descr: 'Проектирование, внедрение и обслуживание сетей любой сложности', visible: true },
            { id: 3, order: 3, descr: 'Техническое и программное обслуживание компьютеров', visible: true },
            { id: 4, order: 4, descr: 'Проектирование, установка и обслуживание систем безопасности', visible: true },
            { id: 5, order: 5, descr: 'Проектирование, разработка и обслуживание веб-сайтов', visible: true },
            { id: 6, order: 6, descr: 'Консультации по информационной безопасности', visible: true },
            { id: 7, order: 7, descr: 'Проектирование, разработка и обслуживание компьютерных и мобильных приложений', visible: true },
            { id: 8, order: 8, descr: 'Установка систем видеонаблюдения', visible: true },
            { id: 9, order: 9, descr: 'Проектирование, установка и обслуживание IP-телефонных систем', visible: true },
        ],
    });

    const handleChangeLang = (lang: Lang) => setSelectedLang(lang);

    const handleAddRow = () => {
        const newId = data[selectedLang].length + 1;
        const newItem: ServiceItem = {
            id: newId,
            order: newId,
            descr: '',
            visible: true
        };

        setData((prev) => {
            const updated: Record<Lang, ServiceItem[]> = { ...prev };
            (Object.keys(prev) as Lang[]).forEach((lang) => {
                updated[lang] = [...prev[lang], { ...newItem }];
            });

            const logObj = {
                id: newItem.id,
                descr: newItem.descr,
                order: newItem.order,
                visible: newItem.visible,
                lang: selectedLang,
            };
            console.log('Added item:', logObj);

            return updated;
        });
    };

    const handleUpdate = (id: number, field: keyof ServiceItem, value: string | number | boolean) => {
        setData((prev) => {
            const updated: Record<Lang, ServiceItem[]> = { ...prev };
            (Object.keys(prev) as Lang[]).forEach((lang) => {
                updated[lang] = prev[lang]
                    .map((item) => (item.id === id ? { ...item, [field]: value } : item))
                    .sort((a, b) => a.order - b.order);
            });

            return updated;
        });
    };

    const handleToggleVisibility = (id: number, visible: boolean) => {
        handleUpdate(id, 'visible', visible);
    };

    const handleRemove = (id: number) => {
        const itemToDelete = data[selectedLang].find((item) => item.id === id);
        if (!itemToDelete) return;

        modal.confirm({
            title: 'Are you sure you want to delete this item?',
            content: `Description: ${itemToDelete.descr}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                setData((prev) => {
                    const updated: Record<Lang, ServiceItem[]> = { ...prev };
                    (Object.keys(prev) as Lang[]).forEach((lang) => {
                        updated[lang] = prev[lang].filter((item) => item.id !== id);
                    });

                    const logObj = {
                        id: itemToDelete.id,
                        descr: itemToDelete.descr,
                        order: itemToDelete.order,
                        visible: itemToDelete.visible,
                        lang: selectedLang,
                    };
                    console.log('Deleted item:', logObj);

                    return updated;
                });
            },
            onCancel: () => {
                console.log('Delete cancelled');
            },
        });
    };

    const handleSave = (id: number) => {
        const item = data[selectedLang].find((el) => el.id === id);
        if (item) {
            const logObj = {
                id: item.id,
                descr: item.descr,
                order: item.order,
                visible: item.visible,
                lang: selectedLang,
            };
            console.log('Saved item:', logObj);
        }
    };

    return (
        <>
            {contextHolder}
            <Space className="w-full" direction="vertical">
                <Row gutter={16} align="middle" style={{ marginBottom: 12 }}>
                    <Col>
                        <Select<Lang>
                            value={selectedLang}
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
                    {data[selectedLang].map((item) => (
                        <Row key={item.id} gutter={16} align="middle">
                            <Col span={2}>
                                <InputNumber
                                    min={1}
                                    value={item.order}
                                    onChange={(val) => handleUpdate(item.id, 'order', val ?? 1)}
                                    style={{ width: '100%' }}
                                />
                            </Col>
                            <Col span={14}>
                                <Tooltip title={item.descr}>
                                    <Input
                                        value={item.descr}
                                        onChange={(e) => handleUpdate(item.id, 'descr', e.target.value)}
                                    />
                                </Tooltip>
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