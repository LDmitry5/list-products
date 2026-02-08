import { useEffect, useState, type ChangeEvent, type FC, type Key } from "react";
import { Table, Spin, Input, Button, message, Flex, Checkbox } from "antd";
import { useProductStore } from "@/store/useProductStore";
import type { ColumnType } from "antd/es/table";
import type { SortOrder } from "antd/lib/table/interface";
import type { IProduct } from "@/types/types";
import product from "@/components/ProductList.module.css";
import { PlusCircleOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import AddProductModal from "./AddProductModal";

type ProductColumn = ColumnType<IProduct> & {
  sortDirections?: SortOrder[];
};

const ProductList: FC = () => {
  const { products, loading, error, sortConfig, searchTerm, fetchProducts, setSortConfig, setSearchTerm } =
    useProductStore();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [usdToRubRate, setUsdToRubRate] = useState<number>(80);

  useEffect(() => {
    fetchProducts();
    fetchExchangeRate();
  }, []);

  const fetchExchangeRate = async () => {
    try {
      const response = await fetch("https://www.floatrates.com/daily/usd.json");
      const data = await response.json();
      setUsdToRubRate(data.rub.rate);
    } catch (err) {
      console.error("Ошибка загрузки курса:", err);
    }
  };

  const columns: ProductColumn[] = [
    {
      title: (
        <Checkbox
          checked={selectedRowKeys.length === products.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys(products.map((p) => p.id));
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      key: "selection",
      render: (_text, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: "Наименование",
      dataIndex: "title",
      key: "title",
      sorter: (a: IProduct, b: IProduct) => a.title.localeCompare(b.title),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Вендор",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Артикул",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Оценка",
      dataIndex: "rating",
      key: "rating",
      sorter: (a: IProduct, b: IProduct) => a.rating - b.rating,
      sortDirections: ["ascend", "descend"],
      render: (rating: number) => <span style={{ color: rating < 3 ? "red" : "black" }}>{rating ? rating : 3}/5</span>,
    },
    {
      title: "Цена, ₽",
      dataIndex: "price",
      key: "price",
      sorter: (a: IProduct, b: IProduct) => a.price - b.price,
      sortDirections: ["ascend", "descend"],
      render: (price: number) => (
        <span>
          {new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            minimumFractionDigits: 2,
          }).format(price * usdToRubRate)}
        </span>
      ),
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: () => (
        <Button
          className={product.btnPlus}
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => message.info("Действие для строки")}
        />
      ),
    },
  ];

  const sortedProducts = [...products].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    let result = 0;

    if (key === "title") {
      result = a.title.localeCompare(b.title);
    } else if (key === "price") {
      result = a.price - b.price;
    } else if (key === "rating") {
      result = a.rating - b.rating;
    } else if (key === "brand") {
      result = a.brand.localeCompare(b.brand);
    } else if (key === "sku") {
      result = a.sku.localeCompare(b.sku);
    }

    return direction === "asc" ? result : -result;
  });

  const filteredProducts = sortedProducts.filter(
    (product) =>
      (product.title && product.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddProduct = () => {
    setIsModalVisible(true);
  };

  return (
    <Flex vertical style={{ width: "100%" }} justify="center" align="center" gap={15}>
      <Flex className={product.wrapSearch} align="center" gap={350}>
        <span className={product.searchText}>Товары</span>
        <Input prefix={<SearchOutlined />} className={product.search} placeholder="Найти" onChange={handleSearch} />
      </Flex>
      <Flex vertical style={{ width: "100%" }}>
        <Flex className={product.wrapAddProduct} justify="space-between" align="center">
          <span className={product.addProductText}>Все позиции</span>
          <Button
            className={product.btnAddProduct}
            icon={<PlusCircleOutlined />}
            type="primary"
            onClick={handleAddProduct}>
            Добавить товар
          </Button>
        </Flex>
        {loading ? (
          <Spin size="large" style={{ display: "block", margin: "0 auto" }} />
        ) : error ? (
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        ) : (
          <Table
            dataSource={filteredProducts}
            style={{ padding: "0 30px", backgroundColor: "#fff" }}
            columns={columns}
            rowKey="id"
            pagination={{
              pageSize: 10,
              style: {
                backgroundColor: "#fff",
                padding: "10px",
              },
            }}
            onChange={(_pagination, _filters, sorter) => {
              if (sorter && typeof sorter === "object" && !Array.isArray(sorter)) {
                if (sorter.field && sorter.order) {
                  setSortConfig(sorter.field as string, sorter.order === "ascend" ? "asc" : "desc");
                }
              }
            }}
          />
        )}
        <AddProductModal
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          onSuccess={() => {
            setIsModalVisible(false);
            message.success("Товар добавлен!");
          }}
          usdToRubRate={usdToRubRate}
        />
      </Flex>
    </Flex>
  );
};

export default ProductList;
