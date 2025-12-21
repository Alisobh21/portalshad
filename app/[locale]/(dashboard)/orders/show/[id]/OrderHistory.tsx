"use client";

import { FC } from "react";
import { useTranslations } from "next-intl";
import { FaHistory } from "react-icons/fa";
import { useSelector } from "react-redux";

/* ShadCN components */
import { Card, CardContent } from "@/components/ui/card";

interface OrderHistoryProps {
  id: string;
  fetchOrder: () => void;
  status?: boolean;
}

interface OrderHistoryItem {
  information: string;
}

interface Order {
  order_history?: OrderHistoryItem[];
}

interface RootState {
  orders: {
    oneOrder: Order | null;
  };
}

const OrderHistory: FC<OrderHistoryProps> = () => {
  const t = useTranslations("ShowOrder");
  const { oneOrder } = useSelector((state: RootState) => state.orders);
  const history = oneOrder?.order_history;

  return (
    <div className="w-full relative">
      <header className="mb-4 flex justify-between px-2 lg:px-4">
        <div className="flex items-center gap-2">
          <div className="w-[40px] h-[40px] rounded-xl flex items-center justify-center bg-[#f6e1d5] text-[#a3480f]">
            <FaHistory size={20} />
          </div>
          <h1 className="text-2xl font-semibold">{t("orderHistory")}</h1>
        </div>
      </header>

      <div className="px-2 lg:px-4">
        {history?.length ? (
          history.map((item, index) => (
            <Card key={index} className="mb-2">
              <CardContent>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: item.information }}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">{t("noHistory")}</p>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
