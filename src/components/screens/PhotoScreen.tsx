import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

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

  return (
    <View style={styles.container}>
      <Text style={styles.navigationTitle}>
        {showAllPhotos ? 'All Photos' : photos.title}
      </Text>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Text style={styles.backButtonText}>&lt; Back</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={toggleShowAllPhotos}
        style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>(Star)</Text>
      </TouchableOpacity>
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
