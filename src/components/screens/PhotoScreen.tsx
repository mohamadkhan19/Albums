import React, {useState, useEffect, useLayoutEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const PhotosScreen = () => {
  const [photos, setPhotos] = useState([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const albumId = route.params?.albumId;

  useEffect(() => {
    // Fetch photos based on the selected album or all photos if showAllPhotos is true
    const url = showAllPhotos
      ? 'https://jsonplaceholder.typicode.com/photos'
      : `https://jsonplaceholder.typicode.com/photos?albumId=${albumId}`;

    fetch(url)
      .then(response => response.json())
      .then(photosData => setPhotos(photosData))
      .catch(error => console.error('Error fetching photos data:', error));
  }, [albumId, showAllPhotos]);

  const toggleShowAllPhotos = () => {
    setShowAllPhotos(prevShowAllPhotos => !prevShowAllPhotos);
  };

  const renderPhotoItem = ({item}) => (
    <View style={styles.photoContainer}>
      <Image source={{uri: item.thumbnailUrl}} style={styles.photo} />
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: showAllPhotos ? 'All Photos' : 'Album Title',
      headerTitleAlign: Platform.OS === 'android' ? 'center' : 'left',
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}>
          <Icon name={'arrow-left'} size={25} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={toggleShowAllPhotos}
          style={styles.headerButton}>
          <FontAwesomeIcon
            name={showAllPhotos ? 'star' : 'star-o'}
            size={25}
            color="white"
          />
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: '#DF6E57',
      },
      headerTintColor: 'white',
    });
  }, [navigation, showAllPhotos]);

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPhotoItem}
        contentContainerStyle={styles.photoList}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  navigationTitle: {
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 16,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  toggleButton: {
    position: 'absolute',
    top: 20,
    right: 16,
  },
  toggleButtonText: {
    fontSize: 16,
    color: 'blue',
  },
  photoList: {
    flexGrow: 1,
  },
  photoContainer: {
    flex: 1 / 3,
    margin: 4,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  photo: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default PhotosScreen;
