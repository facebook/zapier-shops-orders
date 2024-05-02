/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type CancellationReasonCode =
  | 'CUSTOMER_REQUESTED'
  | 'OUT_OF_STOCK'
  | 'INVALID_ADDRESS'
  | 'SUSPICIOUS_ORDER'
  | 'CANCEL_REASON_OTHER';
