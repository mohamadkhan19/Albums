import {useEffect, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import {setAlbumsByUser, setUsers} from '../store/albums/albumSlice';
import {useGetAlbumsQuery, useGetUsersQuery} from '../services/api';

interface User {
  id: number;
  name: string;
}

// ... (Assuming you have the Album type defined)

const useFetchAlbumsForUsers = () => {
  const dispatch = useDispatch();
  const {data: usersData} = useGetUsersQuery();

  const fetchAlbumsForUsers = useCallback(async () => {
    if (usersData) {
      dispatch(setUsers(usersData));

      const albumPromises = usersData.map(async user => {
        const {data: albumsData} = await useGetAlbumsQuery(user.id);

        // The 'data' property is a promise
        // You can await it to get the actual data
        const resolvedAlbumsData = await albumsData;

        return {userId: user.id, albums: resolvedAlbumsData};
      });

      const albumsDataList = await Promise.all(albumPromises);

      const albumsByUserObj: Record<number, Album[]> = {};
      albumsDataList.forEach(({userId, albums}) => {
        albumsByUserObj[userId] = albums;
      });

      dispatch(setAlbumsByUser(albumsByUserObj));
    }
  }, [dispatch, usersData]);

  useEffect(() => {
    fetchAlbumsForUsers();
  }, [fetchAlbumsForUsers]);

  return {fetchAlbumsForUsers};
};

export default useFetchAlbumsForUsers;
