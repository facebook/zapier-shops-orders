/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type CommerceMerchantSettings = {
  contact_email?: string;
  merchant_page?: {
    id: string;
    name: string;
  };
  payment_provider?: string;
  terms?: string;
  id?: string;
};
