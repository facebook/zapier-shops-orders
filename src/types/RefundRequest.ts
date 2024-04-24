import { CurrencyAmount } from './CurrencyAmount';
import { RefundReasonCode } from './RefundReasonCode';

export type RefundRequest = {
  items: Array<{
    retailer_id?: string;
    item_id?: string;
    item_refund_amount?: CurrencyAmount;
    item_refund_quantity?: number;
  }>;
  reason_code: RefundReasonCode;
  reason_text?: string;
  idempotency_key: string;
  shipping?: {
    shipping_refund: CurrencyAmount;
  };
  deductions?: {
    deduction_type: 'RETURN_SHIPPING';
    deduction_amount: CurrencyAmount;
  };
  return_id?: string;
};
