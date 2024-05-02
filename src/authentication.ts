/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BASE_URL } from './constants';

import { Bundle, ZObject } from 'zapier-platform-core';
import { CommerceMerchantSettings } from './types/CommerceMerchantSettings';

const test = async (z: ZObject, _bundle: Bundle) => {
  const response = await z.request(`${BASE_URL}/me`, {
    headers: {
      prefixErrorMessageWith:
        'Unable to get Commerce account details, please enter a valid access token and try again',
    },
  });
  return z.JSON.parse(response.content) as CommerceMerchantSettings;
};

export default {
  type: 'custom',
  fields: [
    {
      key: 'access_token',
      label: 'Access Token',
      required: true,
      helpText:
        'Get an access token here: [Commerce Permission Wizard](https://business.facebook.com/commerce_permission_wizard)',
    },
  ],
  test: test,
  connectionLabel: '{{id}}',
};
