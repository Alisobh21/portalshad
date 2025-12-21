// components/order/types.ts

export interface Warehouse {
  id: number;
  identifier: string;
  name?: string;
}

export interface WarehouseProduct {
  price: number;
  warehouse_identifier: string;
  warehouse_id: number;
}

export interface OrderProduct {
  id?: number;
  name: string;
  sku: string;
  quantity: number;
  warehouse_products: WarehouseProduct[];
  total?: number;
}

export interface ProductsQueryEdge {
  node: {
    price: number;
    backorder: number;
    on_hand: number;
    available: number;
    product: {
      name: string;
      sku: string;
    };
    warehouse: Warehouse;
  };
}
