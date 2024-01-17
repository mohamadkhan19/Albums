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

interface User {
  id: number;
  name: string;
}

interface Album {
  id: number;
  userId: number;
  title: string;
}

const AlbumsScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [albumsByUser, setAlbumsByUser] = useState<{[key: number]: Album[]}>(
    {},
  );
  const [deletedAlbums, setDeletedAlbums] = useState<
    {userId: number; albumId: number}[]
  >([]);
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
        backgroundColor: '#DF6E57',
      },
      headerTintColor: 'white',
    });
  }, [navigation]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then((usersData: User[]) => {
        setUsers(usersData);
        const albumPromises = usersData.map(user =>
          fetch(
            `https://jsonplaceholder.typicode.com/albums?userId=${user.id}`,
          ).then(response => response.json()),
        );
        Promise.all(albumPromises).then(albumsData => {
          const albumsByUserObj: {[key: number]: Album[]} = {};
          usersData.forEach((user, index) => {
            albumsByUserObj[user.id] = albumsData[index];
          });
          setAlbumsByUser(albumsByUserObj);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleDeleteAlbum = (userId: number, albumId: number) => {
    setDeletedAlbums(prevDeletedAlbums => [
      ...prevDeletedAlbums,
      {userId, albumId},
    ]);
  };

  const resetData = () => {
    setDeletedAlbums([]);
  };

  const handleAlbumPress = (userId: number, albumId: number, title: string) => {
    navigation.navigate('PhotoScreen', {userId, albumId, title});
  };

  const filteredAlbums = (userId: number): Album[] =>
    albumsByUser[userId]?.filter(
      album =>
        !deletedAlbums.some(a => a.userId === userId && a.albumId === album.id),
    ) || [];

  const sections = users.map(user => ({
    title: user.name ? `${user.name}'s Albums` : 'Loading...',
    userId: user.id,
    data: filteredAlbums(user.id),
  }));

  const renderAlbumItem = ({
    item,
    section,
  }: {
    item: Album;
    section: {userId: number};
  }) => {
    const shouldWrapText = item.title.length > 20;

    return (
      <View style={styles.albumContainer}>
        <TouchableOpacity
          onPress={() => handleAlbumPress(item.userId, item.id, item.title)}>
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
    borderRadius: 10,
    marginHorizontal: 8,
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
