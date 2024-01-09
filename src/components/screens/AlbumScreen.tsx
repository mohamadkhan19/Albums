import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const AlbumsScreen = () => {
  const [users, setUsers] = useState([]);
  const [albumsByUser, setAlbumsByUser] = useState({});
  const [deletedAlbums, setDeletedAlbums] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Albums',
      headerRight: () => (
        <TouchableOpacity onPress={resetData}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      ),
      headerTitleAlign: Platform.OS === 'android' ? 'center' : 'left',
      headerStyle: {
        backgroundColor: '#DF6E57', // Set your desired background color
      },
      headerTintColor: 'white',
    });
  }, [navigation]);

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

  const resetData = () => {
    setDeletedAlbums([]); // Reset the deleted albums
  };

  const handleAlbumPress = (userId, albumId) => {
    // Navigate to the photos screen with the selected albumId
    navigation.navigate('PhotoScreen', {userId, albumId});
  };

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

  const renderAlbumItem = ({item, section}) => {
    const shouldWrapText = item.title.length > 20;

    return (
      <View style={styles.albumContainer}>
        <TouchableOpacity onPress={() => handleAlbumPress(item.id)}>
          <Text
            style={{
              fontSize: 18,
              flexWrap: shouldWrapText ? 'wrap' : 'nowrap',
              color: 'black',
            }}>
            {item.title}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteAlbum(section.userId, item.id)}
          style={styles.deleteIconContainer}>
          <Text style={styles.deleteIcon}>&times;</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.id.toString() + index}
        renderSectionHeader={({section: {title}}) => (
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              padding: 16,
              color: 'black',
            }}>
            {title}
          </Text>
        )}
        renderItem={renderAlbumItem}
      />
    </View>
  );
};

export default AlbumsScreen;

const styles = StyleSheet.create({
  albumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 10,
    margin: 8,
    backgroundColor: 'white',
  },
  deleteIconContainer: {
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 20,
    color: 'red',
  },
  sectionHeader: {
    fontSize: 20,
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#DF6E57',
    color: 'white',
    borderRadius: 10, // Set border radius for rounded corners
    marginHorizontal: 8, // Add margin for spacing
  },
  resetButton: {
    position: 'absolute',
    top: 20,
    right: 16,
  },
  resetButtonText: {
    fontSize: 16,
    color: 'white',
  },
});
