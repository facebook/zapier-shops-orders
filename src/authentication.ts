/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Bundle, ZObject } from 'zapier-platform-core';
import { FacebookAdsApi, User } from 'facebook-nodejs-business-sdk';

const test = async (_z: ZObject, bundle: Bundle) => {
  FacebookAdsApi.init(bundle.authData.access_token);
  const user = await new User('me').get([]);
  return user.id;
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
