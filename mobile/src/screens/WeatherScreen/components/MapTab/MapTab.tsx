import React, { useState, useEffect, useRef } from "react";
import { Dimensions, View, StyleSheet, Image } from "react-native";
import MapView, { Polygon, Marker } from "react-native-maps";
import { Text } from "react-native-paper";
import { Modalize } from 'react-native-modalize';
import { endpoints } from "../../../../api";
import { DEFAULT_REGION } from "../../../../constants/defaultRegion";
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export const MapTab = () => {
  const [geoJson, setGeoJson] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const modalizeRef = useRef(null);

  useEffect(() => {
    const loadGeoJson = async () => {
      try {
        const response = await fetch(endpoints.GEO_JSON_API);
        const data = await response.json();
        setGeoJson(data);
      } catch (error) {
        console.log(error);
      }
    };

    loadGeoJson();
  }, []);

  const handlePress = (event, feature) => {
    event.persist(); 

    const { coordinate } = event.nativeEvent;

    const currentWeather = feature?.properties?.weather?.current;
    if (currentWeather) {
      const { temp, feels_like, weather, wind_speed, humidity, visibility, uvi, pressure, clouds } = currentWeather;
      const weatherDescription = weather[0].description;
      const weatherIcon = weather[0].icon;

      setModalContent({
        title: feature.properties.shapeName,
        temp,
        feels_like,
        weatherDescription,
        weatherIcon,
        wind_speed,
        humidity,
        visibility,
        uvi,
        pressure,
        clouds,
        coordinate: `Lat: ${coordinate.latitude.toFixed(2)}, Lon: ${coordinate.longitude.toFixed(2)}`
      });

      modalizeRef.current?.open();
    }
  };

  const getPolygonColor = (feature) => {
    const temp = feature?.properties?.weather?.current?.temp;
  
    const startColor = { r: 70, g: 130, b: 180 }; // Blue
    const endColor = { r: 255, g: 0, b: 0 }; // Red
  
    const interpolateColor = (start, end, factor) => {
      const result = start + (end - start) * factor;
      return Math.round(result);
    };
  
    const getColorForTemperature = (temp) => {
      if (temp < 10) temp = 10;
      if (temp > 50) temp = 50;
      const factor = (temp - 10) / 40;
      const r = interpolateColor(startColor.r, endColor.r, factor);
      const g = interpolateColor(startColor.g, endColor.g, factor);
      const b = interpolateColor(startColor.b, endColor.b, factor);
      return `rgba(${r}, ${g}, ${b}, 0.8)`;
    };
  
    return getColorForTemperature(temp);
  };

  const renderGeoJson = () => {
    if (!geoJson) return null;

    return geoJson.features.map((feature, index) => {
      if (feature.geometry.type === "Polygon") {
        const coordinates = feature.geometry.coordinates[0].map(([longitude, latitude]) => ({
          latitude,
          longitude,
        }));

        const currentWeather = feature?.properties?.weather?.current;
        const fillColor = getPolygonColor(feature);
        const text = `${currentWeather.temp}°`;
        const centerCoordinate = coordinates.reduce(
          (prev, curr) => ({ latitude: prev.latitude + curr.latitude / coordinates.length, longitude: prev.longitude + curr.longitude / coordinates.length }),
          { latitude: 0, longitude: 0 }
        );

        return (
          <View key={index}>
            <Polygon
              coordinates={coordinates}
              strokeColor="blue"
              fillColor={fillColor}
              strokeWidth={1}
              tappable={true}
              onPress={(e) => handlePress(e, feature)}
            />
            <Marker
              coordinate={centerCoordinate}
              anchor={{ x: 0.5, y: 0.5 }}
            >
              <View style={styles.marker}>
                <Text>{text}</Text>
              </View>
            </Marker>
          </View>
        );
      }

      return null;
    });
  };

  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        initialRegion={DEFAULT_REGION}
      >
        {renderGeoJson()}
      </MapView>

      <Modalize ref={modalizeRef} snapPoint={400}>
        {modalContent && (
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <View style={styles.weatherContainer}>
              <Image source={{ uri: `https://openweathermap.org/img/wn/${modalContent.weatherIcon}@2x.png` }} style={styles.weatherIcon} />
              <Text style={styles.weatherDescription}>{modalContent.weatherDescription.charAt(0).toUpperCase() + modalContent.weatherDescription.slice(1)}</Text>
            </View>
            <View style={styles.weatherDetails}>
              {renderWeatherDetail("Temperature", `${modalContent.temp}°C`, "temperature-high")}
              {renderWeatherDetail("Feels Like", `${modalContent.feels_like}°C`, "thermometer-half")}
              {renderWeatherDetail("Wind Speed", `${modalContent.wind_speed} m/s`, "wind")}
              {renderWeatherDetail("Humidity", `${modalContent.humidity}%`, "tint")}
              {renderWeatherDetail("Visibility", `${modalContent.visibility} m`, "eye")}
              {renderWeatherDetail("UV Index", `${modalContent.uvi}`, "sun")}
              {renderWeatherDetail("Pressure", `${modalContent.pressure} hPa`, "tachometer-alt")}
              {renderWeatherDetail("Cloudiness", `${modalContent.clouds}%`, "cloud")}
            </View>
            <View style={styles.coordinateContainer}>
              <MaterialCommunityIcons name="map-marker" size={24} color="black" />
              <Text style={styles.coordinateText}>{modalContent.coordinate}</Text>
            </View>
          </View>
        )}
      </Modalize>
    </View>
  );
};

const renderWeatherDetail = (label, value, iconName) => (
  <View style={styles.weatherDetailRow}>
    <FontAwesome5 name={iconName} size={24} color="black" style={styles.weatherIcon} />
    <Text style={styles.weatherDetailText}>
      <Text style={styles.weatherDetailLabel}>{label}: </Text>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  weatherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  weatherIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  weatherDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  weatherDetails: {
    marginTop: 10,
  },
  weatherDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 5,
  },
  weatherDetailText: {
    fontSize: 16,
    // marginLeft: 5,
    flexShrink: 1,
  },
  weatherDetailLabel: {
    fontWeight: 'bold',
  },
  coordinateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  coordinateText: {
    fontSize: 16,
    marginLeft: 5,
  },
  marker: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
  },
});
