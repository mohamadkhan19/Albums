import {createSlice} from '@reduxjs/toolkit';

const photoSlice = createSlice({
  name: 'photos',
  initialState: {
    photos: [],
    allPhotos: [],
  },
  reducers: {
    setPhotos: (state, action) => {
      state.photos = action.payload;
    },
    setAllPhotos: (state, action) => {
      state.allPhotos = action.payload;
    },
  },
});

export const {setPhotos, setAllPhotos} = photoSlice.actions;
export default photoSlice.reducer;
