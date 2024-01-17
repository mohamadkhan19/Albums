import React, {useEffect, useLayoutEffect, useState} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {setAllPhotos, setPhotos} from '../../store/photos/photoSlice';
import {useGetAllPhotosQuery, useGetPhotosQuery} from '../../services/api';

interface Photo {
  id: number;
  thumbnailUrl: string;
}

interface RootState {
  photos: {
    photos: Photo[];
    allPhotos: Photo[];
  };
}

interface RouteParams {
  albumId?: number;
}

const PhotosScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {data: photosData} = useGetPhotosQuery();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const {albumId, title} = route.params as RouteParams;
  const {photos, allPhotos} = useSelector((state: RootState) => state.photos);
  const {data: allPhotosData} = useGetAllPhotosQuery(albumId);

  useEffect(() => {
    if (photosData) {
      dispatch(setPhotos(photosData as Photo[]));
    }

    if (allPhotosData) {
      dispatch(setAllPhotos(allPhotosData as Photo[]));
    }
  }, [dispatch, photosData, allPhotosData]);

  const toggleShowAllPhotos = () => {
    setShowAllPhotos(prevShowAllPhotos => !prevShowAllPhotos);
  };

  const renderPhotoItem = ({item}: {item: Photo}) => (
    <View style={styles.photoContainer}>
      <Image source={{uri: item.thumbnailUrl}} style={styles.photo} />
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: showAllPhotos ? 'All Photos' : title,
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
        data={showAllPhotos ? allPhotos : photos}
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
  headerButton: {
    padding: 10,
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
