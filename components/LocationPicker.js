import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import * as Location from "expo-location";

import MapPreview from "./UI/MapPreview";
import Colors from "../constants/colors";

const LocationPicker = (props) => {
  const { onLocationPicked } = props;

  const [pickedLocation, setPickedLocation] = useState();
  const [isFetching, setIsFetching] = useState(false);

  const mapPickedLocation = props.navigation.getParam("location");

  useEffect(() => {
    if (mapPickedLocation) {
      setPickedLocation(mapPickedLocation);
      onLocationPicked(mapPickedLocation);
    }
  }, [mapPickedLocation, onLocationPicked]);

  const verifyPermissions = async () => {
    const result = await Location.getForegroundPermissionsAsync();
    //console.log(result);
    if (!result.granted) {
      const askPermissions = await Location.requestForegroundPermissionsAsync();
      if (!askPermissions.granted) {
        Alert.alert(
          "Insufficient Permissions!",
          "You need to grant Location permissions to be able to access your location",
          [{ text: "Okay" }]
        );
        return false;
      }
    }
    return true;
  };

  const getLocationHandler = async () => {
    setIsFetching(true);
    const hasPermissions = await verifyPermissions();
    if (!hasPermissions) {
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: 3,
      });
      // console.log("loc", location);

      setPickedLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      props.onLocationPicked({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    } catch (err) {
      Alert.alert(
        "Could not fetch location!",
        "Please try again later or pick a location on the map.",
        [{ text: "Okay" }]
      );
    }
    setIsFetching(false);
  };

  const pickLocationHandler = () => { // go to map
    props.navigation.navigate("Map");
  };

  return (
    <View style={styles.locationPicker}>
      <MapPreview
        location={pickedLocation}
        style={styles.preview}
        pressed={pickLocationHandler}
      >
        <Text style={{ marginVertical: 5 }}>No Location chosen yet!</Text>
        {isFetching ? (
          <ActivityIndicator size="large" color={Colors.accent} />
        ) : (
          <Button
            title="Get User Location 📍"
            color={Colors.primary}
            onPress={getLocationHandler}
          />
        )}
      </MapPreview>
      <Button
        title="Pick on Map"
        color={Colors.primary}
        onPress={pickLocationHandler}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  locationPicker: {
    marginBottom: 15,
  },
  preview: {
    marginBottom: 10,
    width: "100%",
    height: 200,
    borderColor: "#ccc",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
});

export default LocationPicker;
