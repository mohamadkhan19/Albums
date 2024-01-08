import React, {useState, useEffect} from 'react';
import {View, Text, SectionList, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AlbumsScreen = () => {
  const [users, setUsers] = useState([]);
  const [albumsByUser, setAlbumsByUser] = useState({});
  const [deletedAlbums, setDeletedAlbums] = useState([]);
  const navigation = useNavigation();

  // Fetch user data and albums data
  useEffect(() => {
    // Fetch user data
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(usersData => {
        setUsers(usersData);
        // Fetch albums data for each user
        const albumPromises = usersData.map(user =>
          fetch(
            `https://jsonplaceholder.typicode.com/albums?userId=${user.id}`,
          ).then(response => response.json()),
        );
        Promise.all(albumPromises).then(albumsData => {
          const albumsByUserObj = {};
          usersData.forEach((user, index) => {
            albumsByUserObj[user.id] = albumsData[index];
          });
          setAlbumsByUser(albumsByUserObj);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDeleteAlbum = (userId, albumId) => {
    // Update deletedAlbums state in memory
    setDeletedAlbums(prevDeletedAlbums => [
      ...prevDeletedAlbums,
      {userId, albumId},
    ]);
  };

  const handleAlbumPress = (userId, albumId) => {
    // Navigate to the photos screen with the selected albumId
    navigation.navigate('PhotoScreen', {userId, albumId});
  };

  const renderAlbumItem = ({item, section}) => (
    <TouchableOpacity
      onPress={() => handleAlbumPress(section.userId, item.id)}
      onLongPress={() => handleDeleteAlbum(section.userId, item.id)}>
      <View
        style={{padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
        <Text style={{fontSize: 18}}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );

  // Filter out deleted albums before rendering
  const filteredAlbums = userId =>
    albumsByUser[userId]?.filter(
      album =>
        !deletedAlbums.some(a => a.userId === userId && a.albumId === album.id),
    ) || [];

  // Transform data into sections
  const sections = users.map(user => ({
    title: user.name ? `${user.name}'s Albums` : 'Loading...',
    userId: user.id,
    data: filteredAlbums(user.id),
  }));

  return (
    <View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id.toString() + index}
        renderSectionHeader={({section: {title}}) => (
          <Text style={{fontSize: 20, textAlign: 'center', padding: 16}}>
            {title}
          </Text>
        )}
        renderItem={renderAlbumItem}
      />
    </View>
  );
};

export default AlbumsScreen;
