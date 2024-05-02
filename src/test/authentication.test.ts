/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import zapier from 'zapier-platform-core';
import nock from 'nock';
import App from '../index';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import { BASE_URL } from '../constants';

import cmsResponse from './fixtures/responses/get_cms_response.json';
import userInfo401Response from './fixtures/responses/get_user_info_401_response.json';

const appTester = zapier.createAppTester(App);

describe('authentication', () => {
  describe('test auth', () => {
    describe('given access_token returns a 200 and the expected response', () => {
      nock(BASE_URL).get('/me').reply(200, cmsResponse);

      it('returns info about the user', async () => {
        const result = await appTester(App.authentication.test);
        expect(result.id).to.equal('1723037511487665');
      });
    });

    describe('given the connected account credentials are invalid', () => {
      nock(BASE_URL).get('/me').reply(401, userInfo401Response);

      it('throws an error telling the user their token is expired', async () => {
        expect(appTester(App.authentication.test)).to.be.rejectedWith(
          'Unable to get Commerce account details, please enter a valid access token and try again. Access token has expired'
        );
      });
    });

    describe('given Meta responds with an error and no message', () => {
      nock(BASE_URL).get('/me').reply(500, {});

      it('throws an error with the expected generic error message', async () => {
        expect(appTester(App.authentication.test)).to.be.rejectedWith(
          'Oops! Something went wrong. Meta may be having issues with their API - please try again later.'
        );
      });
    });
  });
});
