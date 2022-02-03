import React, { useState, Fragment } from 'react';
import { View, Button, Text, StyleSheet, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import Colors from '../constants/colors';

const ImageSelector = (props) => {
  const [imageUri, setImageUri] = useState('');

  const verifyPermissions = async () => {
    const result = await ImagePicker.getCameraPermissionsAsync();
    //console.log(result);
    if (!result.granted) {
      const askPermissions = await ImagePicker.requestCameraPermissionsAsync();
      if (!askPermissions.granted) {
        Alert.alert(
          'Insufficient Permissions!',
          'You need to grant Camera permissions to be able to take pictures',
          [{ text: 'Okay' }]
        );
        return false;
      }
    }
    return true;
  };

  const takeImageHandler = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }
    //launchCameraAsync -> to open the gallery
    const image = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    // console.log("img", image);

    setImageUri(image.uri);
    props.onImageTaken(image.uri);
  };

  const selectImageHandler = async () => {
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }
    //launchCameraAsync -> to open the gallery
    const image = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.5,
    });
    // console.log("img", image);

    setImageUri(image.uri);
    props.onImageTaken(image.uri);
  };

  return (
    <View style={styles.imagePicker}>
      <View style={styles.imagePreview}>
        {imageUri ? (
          <Image style={styles.image} source={{ uri: imageUri }} />
        ) : (
          <Fragment>
            <Text style={{ marginBottom: 10 }}>No Image picked yet.</Text>
            <View style={{flexDirection: 'row'}}>
              <Button
                title='Take Picture 📸'
                color={Colors.primary}
                onPress={() => {
                  takeImageHandler();
                }}
              />
              <Button
                title='Gallery 🖼️'
                color={Colors.primary}
                onPress={() => {
                  selectImageHandler();
                }}
              />
            </View>
          </Fragment>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imagePicker: {
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ImageSelector;
