import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import type { IProduct } from "@/types/types";

interface ProductState {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  searchTerm: string;
  fetchProducts: () => Promise<void>;
  setSortConfig: (key: string, direction: "asc" | "desc") => void;
  setSearchTerm: (term: string) => void;
  addProduct: (product: Omit<IProduct, "id">) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  sortConfig: null,
  searchTerm: "",

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get("https://dummyjson.com/products", {
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      });
      set({ products: data.products, loading: false });
    } catch (err) {
      set({ error: "Ошибка загрузки товаров", loading: false });
    }
  },

  setSortConfig: (key, direction) => {
    set({ sortConfig: { key, direction } });
  },

  setSearchTerm: (term) => {
    set({ searchTerm: term });
  },

  addProduct: (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
    };
    set((state) => ({ products: [...state.products, newProduct] }));
    // Toast уведомление (реализуем позже)
  },
}));
