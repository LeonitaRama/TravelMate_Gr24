import React, {useState,useContext} from "react";
import { View, Text, Image,Button,TouchableOpacity, TextInput, FlatList, ScrollView} from "react-native";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext";
import { db } from "../../firebase/firebaseConfigExplore";
import { collection, addDoc } from "firebase/firestore";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { Link } from "expo-router";

export default function Details() {
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
      alert(`${destination.name} added to Wishlist!`);
    } else {
      alert(`${destination.name} is already in your Wishlist.`);
    }

     console.log("Review saved in Firestore ✅");
  } catch (e) {
    console.log("Error adding favorite:",e);

  }
};


  const sendReview = async (destination, review, setReview) => {
    if (!review.trim()) {
      alert("Please write a review before sending!");
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
      alert("Review sent ✅");
    console.log("Review saved in Firestore ✅");
    setReview(""); 
    } catch (e) {
      console.log("Error sending review:", e);
      alert("Error sending review!");
    }
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
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5, // Android shadow
        }}
      >
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
        >
          {item.desc}
        </Text>

        {/* Input dhe butoni për review */}
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
            placeholder="Write a review"
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

        {/* Links */}
        <View style={{ marginTop: 10, width: "100%" }}>
          <Link
            href="/location"
            style={{
              color: theme.link,
              textDecorationLine: "underline",
              textAlign: "center",
              marginBottom: 5,
            }}
          >
            View in Map
          </Link>
          <Link
            href="/tickets"
            style={{
              color: theme.link2,
              textDecorationLine: "underline",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Get Tickets
          </Link>
        </View>
      </View>
    );
  };

  const [destinations, setDestinations] = useState([
    {
      id: "1",
      name: "Budva, Montenegro",
      image: require("../../assets/Explore-Destinations/budva.jpg"),
      desc: "A beautiful coastal city in Montenegro known for its beaches and historic old town.",
    },
    {
      id: "2",
      name: "Zermatt, Switzerland",
      image: require("../../assets/Explore-Destinations/Zermatt.jpg"),
      desc: "The Alpine car-free town famous for skiing, hiking, and stunning views of the Matterhorn.",
    },
    {
      id: "3",
      name: "Venice, Italy",
      image: require("../../assets/Explore-Destinations/Venice.jpg"),
      desc: "A breathtaking view of Venice, the city of canals, colorful buildings, and iconic gondolas.",
    },
    {
      id: "4",
      name: "Blue Eye, Albania",
      image: require("../../assets/Explore-Destinations/blue-eye.webp"),
      desc: "The “Blue Eye” in Albania is a crystal-clear spring with vibrant blue and green waters.",
    },
    {
      id: "5",
      name: "Aurora, Iceland",
      image: require("../../assets/Explore-Destinations/Aurora.jpg"),
      desc: "The aurora borealis lights up the sky above Ion Adventure Hotel in Iceland.",
    },
    {
      id: "6",
      name: "Jinhae, South Korea",
      image: require("../../assets/Explore-Destinations/Jinhae.jpg"),
      desc: "Famous for its cherry blossoms, turning the city pink every spring.",
    },
    {
      id: "7",
      name: "Harbor Island, Bahamas",
      image: require("../../assets/Explore-Destinations/Bahamas.jpg"),
      desc: "A serene beach with soft pink sand and turquoise waters.",
    },
    {
      id: "8",
      name: "Rugova Canyon, Kosovo",
      image: require("../../assets/Explore-Destinations/Rugova.jpg"),
      desc: "A fascinating canyon with impressive rock formations and natural beauty.",
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
        Explore Destinations
      </Text>

      <TextInput
        placeholder="Search destination"
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
