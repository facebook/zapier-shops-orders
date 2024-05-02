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

import get_user_info_response from './fixtures/responses/get_user_info_response.json';
import get_user_info_401_response from './fixtures/responses/get_user_info_401_response.json';
import { BASE_URL } from '../constants';

const appTester = zapier.createAppTester(App);

describe('authentication', () => {
  describe('test auth', () => {
    describe('given access_token returns a 200 and the expected response', () => {
      nock(BASE_URL).get('/me').query(true).reply(200, get_user_info_response);

      it('returns info about the user', async () => {
        const result = await appTester(App.authentication.test, {
          authData: { access_token: 'dummy' },
        });
        expect(result).to.equal('12345');
      });
    });

    describe('given the connected account credentials are invalid', () => {
      nock(BASE_URL).get('/me').query(true).reply(401, get_user_info_401_response);

      it('throws an error telling the user their token is expired', async () => {
        expect(
          appTester(App.authentication.test, {
            authData: { access_token: 'dummy' },
          })
        ).to.be.rejectedWith('Access token has expired');
      });
    });

    describe('given Meta responds with an error and no message', () => {
      nock(BASE_URL).get('/me').query(true).reply(500, {});

      it('throws an error with the expected generic error message', async () => {
        expect(
          appTester(App.authentication.test, {
            authData: { access_token: 'dummy' },
          })
        ).to.be.rejected;
      });
    });
  });
});
