import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../components/UI/HeaderButton";
import Colors from "../constants/colors";

const MapScreen = (props) => {
  const initialLocation = props.navigation.getParam("initialLocation");
  const isReadOnly = props.navigation.getParam("readOnly");

  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [markerCoords, setMarkerCoords] = useState();

  const mapRegion = {
    latitude: initialLocation ? initialLocation.lat : 37.78, // describes a point
    longitude: initialLocation ? initialLocation.lng : -122.43,
    latitudeDelta: 0.0922, // delta describies a surface
    longitudeDelta: 0.0421,
  };

  // Store de coordenates when the user press the map
  const selectLocationHandler = (event) => {
    //console.log("map", event.nativeEvent);
    if (isReadOnly) {
      return;
    }

    setSelectedLocation({
      lat: event.nativeEvent.coordinate.latitude,
      lng: event.nativeEvent.coordinate.longitude,
    });
  };

  // Save the choose location and then return to the new place screen
  const savePlaceHandler = useCallback(() => {
    if (!selectedLocation) { // if the user havent selected any location "save won't work"
      // could show an alert
      return;
    }

    props.navigation.navigate("NewPlace", {
      location: selectedLocation,
    });
  }, [selectedLocation]);

  // set save location as a param
  useEffect(() => {
    props.navigation.setParams({
      savePlace: savePlaceHandler,
    });
  }, [savePlaceHandler]);

  // Set latitude and logitude when the user mark (choose) a place in the map
  useEffect(() => {
    if (selectedLocation) {
      setMarkerCoords({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      });
    }
  }, [selectedLocation]);

  return (
    <MapView
      region={mapRegion}
      style={styles.map}
      onPress={selectLocationHandler}
    >
      {markerCoords && (
        <Marker title="Picked Location" coordinate={markerCoords}></Marker>
      )}
    </MapView>
  );
};

MapScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("savePlace");
  const isReadOnly = navData.navigation.getParam("readOnly");

  return {
    headerTitle: "Map",
    headerRight: isReadOnly ? undefined : () => ( // if readonly not a button save
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Save"
          iconName={Platform.OS === "android" ? "md-save" : "save-outline"}
          color={Platform.OS === "android" ? "white" : Colors.primary}
          onPress={() => {
            submitFn();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapScreen;
