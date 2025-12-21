import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, Animated ,Alert, Image } from "react-native";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { useTranslation } from "react-i18next";
import * as Linking from "expo-linking";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scheduleLocalNotification } from "../../utils/localNotifications";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

// Importojmë Auth dhe DB nga app1 dhe db2
import { auth1, db2 } from "../../firebase/firebaseConfig";

export default function Details() {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const toastAnim = useRef(new Animated.Value(100)).current;
  const [user, setUser] = useState(auth1.currentUser); // përdoruesi aktual

  // Dëgjimi i ndryshimeve të autentikimit
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth1, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);

    Animated.timing(toastAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
  };

  const addToFavorites = useCallback(async (destination) => {
    if (!user) {  
     
      Alert.alert("Login Required", "You need to login first!");
      return;
    }

    try {
      const q = query(
        collection(db2, "favorites"),
        where("destinationId", "==", destination.id),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        showToast(`${destination.name} is already in Wishlist`, "error");
        return;
      }

      await addDoc(collection(db2, "favorites"), {
        userId: user.uid,
        destinationId: destination.id,
        name: destination.name,
        image: destination.image.uri || destination.image,
        desc: destination.desc,
        timestamp: new Date(),
      });

      showToast(`${destination.name} added to Wishlist!`, "success");
      console.log("Favorite saved in Firestore ✅");
    } catch (e) {
      console.log("Error adding favorite:", e);
      showToast("Failed to add favorite", "error");
    }
  }, [user]);

  const sendReview = useCallback(async (destination, review, setReview) => {
    if (!user) {  
      Alert.alert("Login Required", "You need to login first!");
      return;
    }

    if (!review.trim()) {
      showToast(t("details.review.alert.empty"), "error");
      return;
    }

    try {
      await addDoc(collection(db2, "reviews"), {
        userId: user.uid,
        destinationId: destination.id,
        name: destination.name,
        review: review,
        description: destination.desc,
        timestamp: new Date(),
      });

      setReview("");
      showToast(t("details.review.alert.success"), "success");
      console.log("Review saved in Firestore ✅");
    } catch (e) {
      console.log("Error sending review:", e);
      showToast("Failed to add review", "error");
    }
  }, [user, t]);

  const openInMap = useCallback((lat, lng) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url);
  }, []);

  const DestinationsItem = React.memo(({ item, index, theme, sendReview, addToFavorites, openInMap }) => {
    const [review, setReview] = useState("");
    const fadeAnim = useRef(new Animated.Value(0)).current;  
    const scaleAnim = useRef(new Animated.Value(0.8)).current; 

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 150, 
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          delay: index * 150,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          flex: 1,
          margin: 5,
          backgroundColor: theme.card,
          borderRadius: 10,
          padding: 10,
          minHeight: 380,
          justifyContent: "space-between",
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }], 
        }}
      >
        <View style={{ width: "100%" }}>
          <Image
            source={item.image}
            style={{ width: "100%", height: 150, borderRadius: 10 }}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={200}   
          />

          <Text style={{ marginTop: 8, fontWeight: "bold", color: theme.text, textAlign: "center" }}>
            {item.name}
          </Text>
          <Text
            style={{
              fontStyle: "italic",
              color: theme.textSecondary,
              textAlign: "center",
              marginVertical: 5,
            }}
            numberOfLines={3}
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
                textAlignVertical: "top", 
                minHeight: 40, 
                maxHeight: 120, 
                fontSize: 14,
              }}
              placeholder={t("details.review.placeholder")}
              placeholderTextColor={theme.placeholder}
              value={review}
              onChangeText={setReview}
              multiline={true}             
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

          <TouchableOpacity onPress={() => openInMap(item.lat, item.lng)} style={{ marginTop: 8, marginBottom: 10 }}>
            <Text style={{ color: theme.link, textDecorationLine: "underline", textAlign: "center" }}>
              {t("details.map.view")}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => addToFavorites(item)}
          activeOpacity={0.7}
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
      </Animated.View>
    );
  });

  const [destinations, setDestinations] = useState([
    { id: "1", name: "Budva, Montenegro", image: require("../../assets/Explore-Destinations/budva.jpg"), desc: "A beautiful coastal city in Montenegro known for its beaches and historic old town.", lat: 42.2929, lng: 18.8403 },
    { id: "2", name: "Zermatt, Switzerland", image: require("../../assets/Explore-Destinations/Zermatt.jpg"), desc: "The Alpine car-free town famous for skiing, hiking, and stunning views of the Matterhorn.", lat: 46.0207, lng: 7.7491 },
    { id: "3", name: "Venice, Italy", image: require("../../assets/Explore-Destinations/Venice.jpg"), desc: "A breathtaking view of Venice, the city of canals, colorful buildings, and iconic gondolas.", lat: 45.4408, lng: 12.3155 },
    { id: "4", name: "Blue Eye, Albania", image: require("../../assets/Explore-Destinations/blue-eye.webp"), desc: "The “Blue Eye” in Albania is a crystal-clear spring with vibrant blue and green waters.", lat: 39.9204, lng: 20.1883 },
    { id: "5", name: "Aurora, Iceland", image: require("../../assets/Explore-Destinations/Aurora.jpg"), desc: "The aurora borealis lights up the sky above Ion Adventure Hotel in Iceland.", lat: 64.1500, lng: -21.9400 },
    { id: "6", name: "Jinhae, South Korea", image: require("../../assets/Explore-Destinations/Jinhae.jpg"), desc: "Famous for its cherry blossoms, turning the city pink every spring.", lat: 35.1494, lng: 128.6597 },
    { id: "7", name: "Harbor Island, Bahamas", image: require("../../assets/Explore-Destinations/Bahamas.jpg"), desc: "A serene beach with soft pink sand and turquoise waters.", lat: 25.5000, lng: -76.6310 },
    { id: "8", name: "Rugova Canyon, Kosovo", image: require("../../assets/Explore-Destinations/Rugova.jpg"), desc: "A fascinating canyon with impressive rock formations and natural beauty.", lat: 42.6761, lng: 20.2534 },
    { id: "9", name: "Test", image: require("../../assets/Explore-Destinations/Rugova.jpg"), desc: "A fascinating canyon with impressive rock formations and natural beauty.", lat: 42.6761, lng: 20.2534 },
    { id: "20", name: "Test1", image: require("../../assets/Explore-Destinations/Rugova.jpg"), desc: "A fascinating canyon with impressive rock formations and natural beauty.", lat: 42.6761, lng: 20.2534 },
  ]);

  useEffect(() => {
    const checkNewDestinations = async () => {
      try {
        const seenIds = await AsyncStorage.getItem("seenDestinations");
        let seenArray = seenIds ? JSON.parse(seenIds) : [];

        const newDestinations = destinations.filter(d => !seenArray.includes(d.id));

        for (const dest of newDestinations) {
          await scheduleLocalNotification(
            "New Destination Added 🗺️",
            `${dest.name} is now available on Explore!`
          );
        }

        if (newDestinations.length > 0) {
          const updatedSeenIds = [...seenArray, ...newDestinations.map(d => d.id)];
          await AsyncStorage.setItem("seenDestinations", JSON.stringify(updatedSeenIds));
        }
      } catch (e) {
        console.log("Error checking new destinations:", e);
      }
    };

    checkNewDestinations();
  }, [destinations]);

  const filteredDestinations = React.useMemo(() => {
    return destinations.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [destinations, searchText]);

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: theme.background }}>
      <Text style={{ fontSize: 24, textAlign: "center", fontWeight: "bold", marginBottom: 15, textDecorationLine: "underline", color: theme.text }}>
        {t("details.title")}
      </Text>

      <TextInput
        placeholder={t("details.search.placeholder")}
        placeholderTextColor={theme.placeholder}
        value={searchText}
        onChangeText={setSearchText}
        style={{ borderWidth: 1, borderColor: theme.border, backgroundColor: theme.inputBackground, borderRadius: 8, padding: 8, marginBottom: 15 }}
      />

      <FlatList
        data={filteredDestinations}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item, index }) => (
          <DestinationsItem
            item={item}
            index={index}
            theme={theme}
            sendReview={sendReview}
            addToFavorites={addToFavorites}
            openInMap={openInMap}
          />
        )}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
        removeClippedSubviews={true}  
        updateCellsBatchingPeriod={50}
        showsVerticalScrollIndicator={false}
      />

      {toastMessage ? (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
            padding: 15,
            backgroundColor: toastType === "success" ? "green" : "red",
            borderRadius: 8,
            alignItems: "center",
            transform: [{ translateY: toastAnim }],
            zIndex: 999,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>{toastMessage}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}
