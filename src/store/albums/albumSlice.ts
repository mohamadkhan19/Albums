import {createSlice} from '@reduxjs/toolkit';

const albumsSlice = createSlice({
  name: 'albums',
  initialState: {
    users: [],
    albumsByUser: {},
    deletedAlbums: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setAlbumsByUser: (state, action) => {
      state.albumsByUser = action.payload;
    },
    setDeletedAlbums: (state, action) => {
      state.deletedAlbums = action.payload;
    },
  },
});

export const {setUsers, setAlbumsByUser, setDeletedAlbums} =
  albumsSlice.actions;
export default albumsSlice.reducer;
