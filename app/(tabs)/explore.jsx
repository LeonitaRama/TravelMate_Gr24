import React, {useState,useContext} from "react";
import { View, Text, Image,Button,TouchableOpacity, TextInput, FlatList, ScrollView} from "react-native";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext";
import { db2 as db } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { Link } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker, UrlTile } from 'react-native-maps';
import { useTranslation } from "react-i18next";
import * as Linking from "expo-linking"; 

export default function Details() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;


   const addToFavorites = async (destination, review) => {
  try {
    const jsonValue = await AsyncStorage.getItem('@favorites');
    let favorites = jsonValue != null ? JSON.parse(jsonValue) : [];

    const exists = favorites.some(fav => fav.id === destination.id);
    if (!exists) {
    
      favorites.push({ ...destination, review });
      await AsyncStorage.setItem('@favorites', JSON.stringify(favorites));
      alert(t("details.favorites.added", { name: destination.name }));
    } else {
      alert(t("details.favorites.exists", { name: destination.name }))
    }

     console.log("Review saved in Firestore ✅");
  } catch (e) {
    console.log("Error adding favorite:",e);

  }
};


  const sendReview = async (destination, review, setReview) => {
    if (!review.trim()) {
      alert(t("details.review.alert.empty"));
      return;
    }
        try {
      await addDoc(collection(db, "reviews"), {
        destinationId: destination.id,
        name: destination.name,
        review: review,
        description: destination.desc,
        timestamp: new Date(),
      });
      setReview("");
      alert(t("details.review.alert.success"));
    console.log("Review saved in Firestore ✅");
    setReview(""); 
    } catch (e) {
      console.log("Error sending review:", e);
      alert(t("details.review.alert.error"));
    }
  };
 const openInMap = (lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  };

  // ✅ Harta me OpenStreetMap
  const MapComponent = ({ destinations }) => {
    return (
      <MapView
        style={{ width: '100%', height: 300, marginVertical: 10, borderRadius: 10 }}
        initialRegion={{
          latitude: destinations[0].lat,
          longitude: destinations[0].lng,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}
        mapType="standard"
      >
        <UrlTile
          urlTemplate="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {destinations.map((dest) => (
          <Marker
            key={dest.id}
            coordinate={{ latitude: dest.lat, longitude: dest.lng }}
            title={dest.name}
            description={dest.desc}
          />
        ))}
      </MapView>
    );
  };

  const DestinationsItem = ({ item }) => {
  const [review, setReview] = useState("");

  return (
    <View
      style={{
        flex: 1,
        margin: 5,
        backgroundColor: theme.card,
        borderRadius: 10,
        padding: 10,
        minHeight: 380, // siguron një lartësi minimale
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
      }}
    >
      <View style={{ width: "100%" }}>
        <Image
          source={item.image}
          style={{ width: "100%", height: 150, borderRadius: 10 }}
          resizeMode="cover"
        />

        <Text
          style={{
            marginTop: 8,
            fontWeight: "bold",
            color: theme.text,
            textAlign: "center",
          }}
        >
          {item.name}
        </Text>

        <Text
          style={{
            fontStyle: "italic",
            color: theme.textSecondary,
            textAlign: "center",
            marginVertical: 5,
          }}
          numberOfLines={3} // limiton tekstin në 3 rreshta
        >
          {item.desc}
        </Text>

        <View style={{ flexDirection: "row", width: "100%", marginTop: 5 }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: theme.border,
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
              backgroundColor: theme.inputBackground,
              color: theme.text,
            }}
            placeholder={t("details.review.placeholder")}
            placeholderTextColor={theme.placeholder}
            value={review}
            onChangeText={setReview}
          />
          <TouchableOpacity
            onPress={() => sendReview(item, review, setReview)}
            style={{
              marginLeft: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: theme.button,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={{ color: theme.buttonText, fontWeight: "bold" }}>📩</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => openInMap(item.lat, item.lng)}
          style={{ marginTop: 8, marginBottom: 10 }}
        >
          <Text
            style={{
              color: theme.link,
              textDecorationLine: "underline",
              textAlign: "center",
            }}
          >
              {t("details.map.view")}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => addToFavorites(item)}
        style={{
          backgroundColor: theme.button,
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderRadius: 8,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Text style={{ color: theme.buttonText, fontWeight: "bold", textAlign: "center" }}>
          ❤️ Add to Wishlist
        </Text>
      </TouchableOpacity>
    </View>
  );
};

       
  const [destinations, setDestinations] = useState([
    {
      id: "1",
      name: "Budva, Montenegro",
      image: require("../../assets/Explore-Destinations/budva.jpg"),
      desc: "A beautiful coastal city in Montenegro known for its beaches and historic old town.",
       lat: 42.2929,          
      lng: 18.8403,   
    },
    {
      id: "2",
      name: "Zermatt, Switzerland",
      image: require("../../assets/Explore-Destinations/Zermatt.jpg"),
      desc: "The Alpine car-free town famous for skiing, hiking, and stunning views of the Matterhorn.",
          lat: 46.0207,        
      lng: 7.7491,
    },
    {
      id: "3",
      name: "Venice, Italy",
      image: require("../../assets/Explore-Destinations/Venice.jpg"),
      desc: "A breathtaking view of Venice, the city of canals, colorful buildings, and iconic gondolas.",
      lat: 45.4408,         
      lng: 12.3155,   
    },
    {
      id: "4",
      name: "Blue Eye, Albania",
      image: require("../../assets/Explore-Destinations/blue-eye.webp"),
      desc: "The “Blue Eye” in Albania is a crystal-clear spring with vibrant blue and green waters.",
       lat: 39.9204,          
      lng: 20.1883, 

    },
    {
      id: "5",
      name: "Aurora, Iceland",
      image: require("../../assets/Explore-Destinations/Aurora.jpg"),
      desc: "The aurora borealis lights up the sky above Ion Adventure Hotel in Iceland.",
      lat: 64.1500,          
      lng: -21.9400,
    },
    {
      id: "6",
      name: "Jinhae, South Korea",
      image: require("../../assets/Explore-Destinations/Jinhae.jpg"),
      desc: "Famous for its cherry blossoms, turning the city pink every spring.",
      lat: 35.1494,          
      lng: 128.6597,   
    },
    {
      id: "7",
      name: "Harbor Island, Bahamas",
      image: require("../../assets/Explore-Destinations/Bahamas.jpg"),
      desc: "A serene beach with soft pink sand and turquoise waters.",
       lat: 25.5000,          
      lng: -76.6310,  
    },
    {
      id: "8",
      name: "Rugova Canyon, Kosovo",
      image: require("../../assets/Explore-Destinations/Rugova.jpg"),
      desc: "A fascinating canyon with impressive rock formations and natural beauty.",
      lat: 42.6761,      
      lng: 20.2534,  
    },
  ]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      <Text
        style={{
          fontSize: 24,
          textAlign: "center",
          fontWeight: "bold",
          marginBottom: 15,
          textDecorationLine: "underline",
          color: theme.text,
        }}
      >
        {t("details.title")}
      </Text>

      <TextInput
        placeholder={t("details.search.placeholder")}
        placeholderTextColor={theme.placeholder}
        value={searchText}
        onChangeText={setSearchText}
        style={{
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.inputBackground,
          borderRadius: 8,
          padding: 8,
          marginBottom: 15,
        }}
      />

      <FlatList
        data={destinations.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => <DestinationsItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
