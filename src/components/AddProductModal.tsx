import { useState, type FC } from "react";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";
import { useProductStore } from "@/store/useProductStore";
import type { IAddProductModalProps, IProductFormValues } from "@/types/types";

const AddProductModal: FC<IAddProductModalProps> = ({ visible, onCancel, onSuccess, usdToRubRate }) => {
  const [form] = Form.useForm();
  const { addProduct } = useProductStore();
  const [loading, setLoading] = useState(false);

  const handleFinish = async (values: IProductFormValues) => {
    try {
      setLoading(true);
      const priceInUSD = values.price / usdToRubRate;
      addProduct({
        ...values,
        price: priceInUSD,
      });
      form.resetFields();
      onCancel();
      onSuccess();
      // message.success("Товар успешно добавлен!");
    } catch (error) {
      message.error("Ошибка при добавлении товара");
      console.error("Add product error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Добавить товар"
      open={visible}
      onCancel={onCancel}
      destroyOnHidden
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" htmlType="submit" loading={loading} onClick={() => form.submit()}>
          Добавить
        </Button>,
      ]}>
      <Form form={form} onFinish={handleFinish} layout="vertical" style={{ padding: "0 8px" }}>
        <Form.Item name="title" label="Наименование" rules={[{ required: true, message: "Введите название товара" }]}>
          <Input placeholder="Введите название" />
        </Form.Item>

        <Form.Item name="price" label="Цена" rules={[{ required: true, message: "Введите цену в рублях" }]}>
          <InputNumber
            min={0}
            step={0.01}
            formatter={(value) => (value ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : "")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item name="brand" label="Вендор" rules={[{ required: true, message: "Введите бренд" }]}>
          <Input placeholder="Производитель" />
        </Form.Item>

        <Form.Item name="sku" label="Артикул" rules={[{ required: true, message: "Введите артикул" }]}>
          <Input placeholder="Уникальный код товара" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
