// Utility query builders and mutations for products, warehouses, and orders.
// NOTE: External helpers like `makeGQLAjax` and `$` are assumed to be available in the environment.

declare const makeGQLAjax: (
  query: string,
  endpoint: string
) => Promise<{ success: boolean }>;
type JQueryLike = {
  val: () => string | number | undefined;
};

declare function $(selector: string): JQueryLike;

type NullableString = string | null | undefined;

type LineItem = {
  id?: string;
  sku?: string;
  date?: string;
  quantity: number;
  price: string | number;
};

export function getProductsQry(
  cursor: NullableString = null,
  sku: NullableString = null
): string {
  const hasSku = sku !== null && sku !== undefined && sku !== "";
  const hasCursor = cursor !== null && cursor !== undefined && cursor !== "";

  const cursorQry = hasSku
    ? "first: 10"
    : hasCursor
    ? `after:"${cursor}", first: 10`
    : "first: 10";

  const skuQry = hasSku ? `(sku:"${sku}")` : "";

  return `{
        products${skuQry} {
            request_id
            complexity
            data(${cursorQry}) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
                edges {
                    node {
                        id
                        name
                        sku
                        warehouse_products {
                            price
                            backorder
                            warehouse_id
                            warehouse_identifier
                        }
                    }
                }
            }
        }
    }`;
}

export function getWarehouseProductsQry(
  warehouseId: NullableString = null,
  cursor: NullableString = null,
  sku: NullableString = null
): string {
  const hasSku = sku !== null && sku !== undefined && sku !== "";
  const hasCursor = cursor !== null && cursor !== undefined && cursor !== "";

  const cursorQry = hasSku
    ? "first: 10"
    : hasCursor
    ? `after: "${cursor}", first: 10`
    : "first: 10";

  const filterArgs: string[] = [];
  if (warehouseId !== null && warehouseId !== undefined && warehouseId !== "") {
    filterArgs.push(`warehouse_id: "${warehouseId}"`);
  }
  if (hasSku) {
    filterArgs.push(`sku: "${sku}"`);
  }

  const filterStr = filterArgs.length ? `(${filterArgs.join(", ")})` : "";

  return `{
        warehouse_products${filterStr} {
            request_id
            complexity
            data(${cursorQry}) {
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    startCursor
                    endCursor
                }
                edges {
                    node {
                        id
                        account_id
                        on_hand
                        backorder
                        available
                        inventory_bin
                        reserve_inventory
                        reorder_amount
                        reorder_level
                        custom
                        price
                        warehouse {
                            id
                            identifier
                            dynamic_slotting
                            profile
                        }
                        product {
                            id
                            name
                            sku
                            price
                        }
                    }
                    cursor
                }
            }
        }
    }`;
}

export async function updateOrderTotalPriceMutation(
  orderId: string,
  totalItemsPrice: string | number
): Promise<boolean> {
  const resolvedOrderId = orderId || $("#order_id")?.val();

  const updateTotalQuery = `
        mutation {
            order_update(
                data: {
                    order_id: "${resolvedOrderId}"
                    total_price: "${totalItemsPrice}"
                }
            ) {
                request_id
                complexity
            }
        }
    `;

  const result = await makeGQLAjax(
    updateTotalQuery,
    "{{route('account.ajax')}}"
  );
  return result.success;
}

export function addProductMutation(
  orderId: string,
  sku: string,
  price: string | number,
  date: string,
  quantity: number = 1
): string {
  return `
        mutation {
            order_add_line_items(
                data: {
                    order_id: "${orderId}",
                    line_items: [
                        {
                            sku: "${sku}",
                            partner_line_item_id: "${date}",
                            quantity: "${quantity}",
                            quantity_pending_fulfillment: 1,
                            price: "${price}"
                        }
                    ]
                }
            ) {
                request_id
                complexity
            }
        }
    `;
}

export function addProductMutation1(
  orderId: string,
  items: LineItem[]
): string {
  const formattedItems = items
    .map(
      (item) => `
        {
            sku: "${item.sku ?? ""}",
            partner_line_item_id: "${item.date ?? ""}",
            quantity: ${item.quantity},
            quantity_pending_fulfillment: 1,
            price: "${item.price}"
        }
    `
    )
    .join(",");

  return `
        mutation AddLineItemsToOrder {
            order_add_line_items(
                data: {
                    order_id: "${orderId}",
                    line_items: [${formattedItems}]
                }
            ) {
                request_id
                complexity
            }
        }
    `;
}

export function reQueryOrder(orderId: string): string {
  return `
        query {
            order(id: "${orderId}") {
                request_id
                complexity
                data {
                    line_items {
                        edges {
                            node {
                                product_name
                                sku
                                fulfillment_status
                                quantity
                                price
                                backorder_quantity
                                id
                            }
                        }
                    }
                }
            }
        }
    `;
}

export function updateTotalPriceMutation(
  orderId: string,
  totalPrice: string | number,
  subtotal: string | number
): string {
  return `
      mutation {
        order_update(
          data: {
            order_id: "${orderId}",
            total_price: "${totalPrice}"
            subtotal: "${subtotal}"
          }
        ) {
          request_id
          complexity
        }
      }
    `;
}

export function orderUpdateLineItemsMutationQ(
  orderId: string,
  lineItems: LineItem[]
): string {
  const formattedItems = lineItems
    .map(
      (item) => `
                {
                    id: "${item.id ?? ""}",
                    quantity: ${item.quantity},
                    quantity_pending_fulfillment: ${item.quantity},
                    price: "${item.price}"
                }
            `
    )
    .join(",");

  return `
        mutation {
            order_update_line_items(
                data: {
                    order_id: "${orderId}",
                    line_items: [${formattedItems}]
                }
            ) {
                request_id
                complexity
            }
        }
    `;
}

export function orderUpdateLineItemsMutationQ1(
  orderId: string,
  lineItems: LineItem[]
): string {
  const formattedItems = lineItems
    .map(
      (item) => `
        {
            id: "${item.id ?? ""}",
            quantity: ${item.quantity},
            quantity_pending_fulfillment: ${item.quantity},
            price: "${item.price}"
        }
    `
    )
    .join(",");

  return `
        mutation UpdateLineItems {
            order_update_line_items(
                data: {
                    order_id: "${orderId}",
                    line_items: [${formattedItems}]
                }
            ) {
                request_id
                complexity
            }
        }
    `;
}
