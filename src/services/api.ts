import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({baseUrl: 'https://jsonplaceholder.typicode.com/'}),
  endpoints: builder => ({
    getUsers: builder.query({
      query: () => 'users',
    }),
    getAlbums: builder.query({
      query: userId => `albums?userId=${userId}`,
    }),
    getPhotos: builder.query({
      query: () => 'photos',
    }),
    getAllPhotos: builder.query({
      query: (albumId: Number) => `photos?albumId=${albumId}`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetAlbumsQuery,
  useGetPhotosQuery,
  useGetAllPhotosQuery,
} = api;
