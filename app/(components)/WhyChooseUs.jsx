import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import MapView, { UrlTile } from 'react-native-maps';
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

export default function WhyChooseUs() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  const API_KEY = "2b702f2d80a1e6f46b130cd012d53bbd";
  const CITY = "Pristina";
  const cityCoords = {
  latitude: 42.6677,
  longitude: 21.1662,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
      } else {
        setError(data.message || "Error fetching weather");
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("wtitle")}</Text>
      <Text style={styles.description}>
       {t("description")}
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureBox}>
          <Ionicons name="map" size={32} color="#4A5D73" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.featureTitle}>{t("local_expertise_title")}</Text>
            <Text style={styles.featureText}>{t("local_expertise_desc")}</Text>
          </View>
        </View>

       <View style={styles.featureBox}>
  <FontAwesome5 name="calendar-check" size={28} color="#4A5D73" />
  <View style={{ marginLeft: 10 }}>
    <Text style={styles.featureTitle}>{t("all_in_one_title")}</Text>
    <Text style={styles.featureText}>{t("all_in_one_desc")}</Text>
  </View>
</View>



        <View style={styles.featureBox}>
          <Ionicons name="headset" size={32} color="#4A5D73" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.featureTitle}>{t("support_title")}t</Text>
            <Text style={styles.featureText}>{t("support_desc")}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <FontAwesome5 name="smile" size={28} color="#4A5D73" />
          <Text style={styles.statNumber}>12k+</Text>
          <Text style={styles.statLabel}>{t("stat_travelers")}</Text>
        </View>

        <View style={styles.statItem}>
          <FontAwesome5 name="medal" size={28} color="#4A5D73" />
          <Text style={styles.statNumber}>10+ yrs</Text>
          <Text style={styles.statLabel}>{t("stat_experience")}</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="location-sharp" size={32} color="#4A5D73" />
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>{t("stat_destinations")}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.weatherBox} onPress={fetchWeather}>
        <MaterialIcons name="cloud" size={34} color="#4A5D73" />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.weatherTitle}>{t("weather_title")}</Text>
          <Text style={styles.weatherText}>
            Powered by OpenWeatherMap API{'\n'}{t("weather_desc")}
          </Text>

          {loading && <ActivityIndicator size="small" color="#0000ff" />}
          {error && <Text style={{ color: "red" }}>{error}</Text>}
          {weather && (
            <Text style={{ marginTop: 5 }}>
              {CITY}: {weather.main.temp}°C, {weather.weather[0].description}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      <MapView
  style={styles.map}
  initialRegion={cityCoords}
  mapType="standard" 
>
  <UrlTile
    urlTemplate={`https://openweathermap.org/weathermap`}
    zIndex={1}
    tileSize={256}
  />
</MapView>


    </View>
  );
}

const styles = StyleSheet.create({
  container: 
  {
   padding: 20 
  },

  title: 
  {
   fontSize: 22,
   fontWeight: "bold",
   color: "#222", 
   marginBottom: 10 
  },

  description: 
  { 
    fontSize: 15, 
    color: "#444", 
    lineHeight: 20, 
    marginBottom: 25 
  },

  featuresContainer: 
  { 
    gap: 15 
  },

  featureBox: 
  { 
    backgroundColor: "#E4EBF3", 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: "row", 
    alignItems: "center" 
  },
  featureTitle: 
  { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#333" 
  },
  featureText: 
  { 
    fontSize: 14, 
    color: "#555", 
    width: "85%" 
  },
  statsContainer: 
  { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginTop: 30, 
    marginBottom: 20 
  },
  statItem: 
  { 
    alignItems: "center" 
  },
  statNumber: 
  { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#111", 
    marginTop: 5 },
  statLabel: 
  { 
    fontSize: 13, 
    color: "#666" 
  },
  weatherBox: 
  { 
    flexDirection: "row", 
    backgroundColor: "#E5F0FF", 
    padding: 15, 
    borderRadius: 10, 
    marginVertical: 10, 
    alignItems: "center" 
  },
  weatherTitle: 
  { fontSize: 16, 
    fontWeight: "bold" 
  },
  weatherText: 
  { 
    fontSize: 12, 
    color: "#4A5D73" 
  },
  map: 
  {
  width: '100%',
  height: 300,   
  borderRadius: 10,
  marginTop: 10,
}
});
