import { CurrencyAmount } from './CurrencyAmount';

export type Order = {
  id: string;
  order_status: {
    state: string;
  };
  created: string;
  last_updated: string;
  items: {
    data: Array<OrderItem>;
  };
  channel: string;
  ship_by_date: string;
  selected_shipping_option: SelectedShippingOption;
  shipping_address: ShippingAddress;
  estimated_payment_details: EstimatedPaymentDetails;
  buyer_details: BuyerDetails;
};

export type OrderItem = {
  id: string;
  product_id: string;
  retailer_id: string;
  quantity: number;
  price_per_unit: CurrencyAmount;
};
export type SelectedShippingOption = {
  name: string;
  price: CurrencyAmount;
  calculated_tax: CurrencyAmount;
  estimated_shipping_time: {
    min_days: number;
    max_days: number;
  };
};
export type ShippingAddress = {
  name: string;
  street1: string;
  street2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};
export type EstimatedPaymentDetails = {
  subtotal: {
    items: CurrencyAmount;
    shipping: CurrencyAmount;
  };
  tax: CurrencyAmount;
  total_amount: CurrencyAmount;
  tax_remitted: boolean;
};
export type BuyerDetails = {
  name: string;
  email: string;
  email_remarketing_option: boolean;
};
