// (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.

import { Bundle, HttpResponse, ZObject } from 'zapier-platform-core';
import { RequestOptions } from 'https';

export const includeBearerToken = (request: RequestOptions, _z: ZObject, bundle: Bundle) => {
  const access_token = bundle.authData.access_token;
  if (access_token) {
    request.headers = request.headers || {};
    request.headers.Authorization = `Bearer ${access_token}`;
  }
  return request;
};

/*
 * Can be used in the afterRequest section of your index.ts file to check each http response for errors.
 * Your request can provide a message prefix for any errors with prefixErrorMessageWith in the header
 * Your request can return the response instead of an error for a specific status code with dontThrowErrorForStatus
 * or for a specific Facebook Error code with dontThrowErrorForCode
 * https://developers.facebook.com/docs/graph-api/using-graph-api/error-handling
 */
interface IWithErrorMessage {
  prefixErrorMessageWith?: string;
  disableMiddlewareErrorChecking?: boolean;
  dontThrowErrorForStatus?: number;
}

interface IWithError {
  error: { message: string; error_user_title: string; error_user_msg: string };
}

const genericErrorMessage = `Oops! Something went wrong. Meta may be having issues with their API - please try again later.`;

export const checkForErrors = (response: HttpResponse, z: ZObject) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const headers = response.request.headers as IWithErrorMessage | undefined;

  if (headers?.disableMiddlewareErrorChecking == true) {
    response.skipThrowForStatus = true;
    return response;
  }
  if (headers?.dontThrowErrorForStatus && response.status === headers.dontThrowErrorForStatus) {
    response.skipThrowForStatus = true;
    return response;
  }

  let responseJson: IWithError;
  try {
    responseJson = z.JSON.parse(response.content);
  } catch (ex) {
    throw new Error(genericErrorMessage);
  }

  if (responseJson && responseJson.error && responseJson.error.message) {
    let standardMessage = `${headers?.prefixErrorMessageWith}. ${responseJson.error.message}`;
    if (responseJson.error.error_user_title) {
      standardMessage = `${standardMessage}: ${responseJson.error.error_user_title}`;
    }
    if (responseJson.error.error_user_msg) {
      standardMessage = `${standardMessage}: ${responseJson.error.error_user_msg}`;
    }
    throw new Error(standardMessage);
  }

  // generic fallback
  throw new Error(genericErrorMessage);
};
