import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  FetchBaseQueryError,
  retry,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

const rawBaseQuery = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,
    prepareHeaders: headers => {
      return headers;
    },
  });

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, state, extraOptions) => {
  const baseUrl = 'https://jsonplaceholder.typicode.com/';

  const response = await rawBaseQuery(baseUrl)(args, state, extraOptions);
  return response;
};

const baseQueryWithRetry = retry(baseQuery, {maxRetries: 0});

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  tagTypes: [],
  endpoints: () => ({}),
});
