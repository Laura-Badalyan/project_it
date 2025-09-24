'use client'

import { useState } from "react";
import { Form, Input, Button, Card, Space } from "antd";
import type { FormInstance } from "antd/es/form";

type ServicesFormValues = {
    services: string[];
}

export function Fields() {

    const initialServices: string[] = [
        "Ցանկացած բարդության սերվերային համակարգերի ներդրում և սպասարկում",
        "Ցանկացած բարդության ցանցերի նախագծում, ներդրում և սպասարկում",
        "Համակարգիչների տեխնիկական և ծրագրային սպասարկում",
        "Անվտանգության համակարգերի նախագծում, տեղադրում և սպասարկում",
        "Կայքերի նախագծում, պատրաստում և սպասարկում",
        "Տեղեկատվական անվտանգության խորհրդատվություն",
        "Համակարգչային և բջջային ծրագրերի նախագծում, պատրաստում և սպասարկում",
        "Տեսահսկման համակարգերի տեղադրում",
        "IP հեռախոսակայանների նախագծում, տեղադրում և սպասարկում",
    ];

    const [form] = Form.useForm<ServicesFormValues>();
    const [services, setServices] = useState<string[]>(initialServices);

    const handleFinish = (values: ServicesFormValues) => {
        console.log("Updated Services:", values.services);
        setServices(values.services);
    };


    return (
        <Card title="Ծառայությունների կառավարում" style={{ maxWidth: 800, margin: "0 auto" }}>
            <Form<ServicesFormValues>
                form={form as FormInstance<ServicesFormValues>}
                layout="vertical"
                initialValues={{ services }}
                onFinish={handleFinish}
            >
                <Form.List name="services">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    key={key}
                                    style={{ display: "flex", marginBottom: 8 }}
                                    align="baseline"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={name}
                                        rules={[{ required: true, message: "Լրացրու ծառայությունը" }]}
                                        style={{ flex: 1 }}
                                    >
                                        <Input placeholder="Ծառայության անուն" style={{ width: "600px" }} />
                                    </Form.Item>
                                    <Button danger onClick={() => remove(name)}>
                                        Հեռացնել
                                    </Button>
                                </Space>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} block>
                                    Ավելացնել նոր ծառայություն
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Պահպանել
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}
