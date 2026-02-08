export interface IAuth {
  id: string;
  username: string;
  email: string;
  accessToken: string;
  refreshToken: string;
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
}

// Интерфейс данных формы
export interface IProductFormValues {
  title: string;
  price: number;
  rating: number;
  brand: string;
  sku: string;
}

export interface IAddProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  usdToRubRate: number;
}
