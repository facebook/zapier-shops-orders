import { CancellationReasonCode } from './CancellationReasonCode';

export type CancellationRequest = {
  cancel_reason?: {
    reason_code: CancellationReasonCode;
    reason_description?: string;
  };
  restock_items?: boolean;
  items: Array<{
    retailer_id?: string;
    item_id?: string;
    quantity: number;
  }>;
  idempotency_key: string;
};
