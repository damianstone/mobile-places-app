import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, View, TouchableOpacity } from 'react-native';

import ENV from '../../env';

const MapPreview = (props) => {
  const { location } = props;

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    if (location) {
      setImagePreviewUrl(
        `https://maps.googleapis.com/maps/api/staticmap?center=${location.lat},${location.lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:A%7C${location.lat},${location.lng}&key=${ENV.googleApiKey}`
      );
    }
  }, [location]);

  return (
    <TouchableOpacity onPress={props.pressed}>
      <View style={{ ...styles.mapPreview, ...props.style }}>
        {imagePreviewUrl ? (
          <Image
            source={{
              uri: imagePreviewUrl,
            }}
            style={styles.image}
          />
        ) : (
          props.children
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapPreview: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default MapPreview;
