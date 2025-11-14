import React, {useState,useContext} from "react";
import { View, Text, Image,Button} from "react-native";
import { FlatList } from "react-native";
 import { TouchableOpacity } from "react-native";
import { ThemeContext, ThemeProvider } from "../../context/ThemeContext";
import { TextInput } from "react-native";
import {Link} from "expo-router"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../../firebase/firebaseConfigExplore";
import { collection, addDoc } from "firebase/firestore";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";

export default function Details(){
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
    alert("Review sent ✅");
    console.log("Review saved in Firestore ✅");
    setReview(""); // pastron input-in pas dërgimit
  } catch (e) {
    console.log("Error sending review:", e);
  }
};



    const DestinationsItem=({item})=>{
    const [review, setReview] = useState("");
return(
 <View style={{marginBottom: 20,alignItems: "center", backgroundcolor:theme.card, }}>
  <Image source={item.image } style={{width: 150, height: 170,alignItems: "center",}} />
 <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ marginTop: 10, textAlign: "center", fontWeight: "bold", color:theme.text }}>
        {item.name}  
      </Text>

   <Text style={{ marginTop: 5, textAlign: "center", width: 150,fontStyle:"italic", color:theme.textSecondary}}>{item.desc}
   </Text>
   </View>

   <View
  style={{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  }}
>
  <TextInput
    style={{
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor:theme.inputBackground,
      color:theme.text,
      borderColor: "gray",
      borderRadius: 8,
      padding: 5,
      flex: 1,
      backgroundColor: "white",
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
      backgroundColor: "theme.button",
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
    }}
  >
    <Text style={{ color: theme.buttonText, fontWeight: "bold" }}>📩</Text>
  </TouchableOpacity>
</View>


<TouchableOpacity 
  onPress={() => addToFavorites(item, review)}
  style={{
    backgroundColor: theme.button,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center"
  }}
>
  <Text style={{ color: theme.buttonText, fontWeight: "bold" }}>
    Add to Favorites
  </Text>
</TouchableOpacity>

   <Link href="/location" style={{ color: theme.link, textDecorationLine: "underline" }}>
    View in Map
  </Link>
  <Link href="/tickets" style={{ color: theme.link2, textDecorationLine: "underline", fontWeight: "bold" }}>
    Get Tickets
  </Link>

  </View>

  
);

  };
 const [destinations, setDestinations] = useState([
    { id: "1",name:"Budva, Montenegro", image:require("../../assets/Explore-Destinations/budva.jpg"), desc: "A beautiful coastal city in Montenegro known for its beaches and historic old town." },
    { id: "2", name:"Zermatt, Switzerland",image:require("../../assets/Explore-Destinations/Zermatt.jpg"), desc: "The Alpine car-free town famous for skiing, hiking, and stunning views of the Matterhorn." },
    { id: "3", name:"Venice, Italy",image:require("../../assets/Explore-Destinations/Venice.jpg"), desc: "A breathtaking view of Venice, the city of canals, colorful buildings, and iconic gondolas." },
    { id: "4",name:"Blue Eye, Albania" ,image:require("../../assets/Explore-Destinations/blue-eye.webp"), desc: "The “Blue Eye” in Albania is a crystal-clear spring with vibrant blue and green waters." },
    { id: "5", name:"Aurora, Iceland",image:require("../../assets/Explore-Destinations/Aurora.jpg"), desc: "The aurora borealis lights up the sky above Ion Adventure Hotel in Iceland." },
    { id: "6", name:"Jinhae, South Korea",image:require("../../assets/Explore-Destinations/Jinhae.jpg"), desc: "Famous for its cherry blossoms, turning the city pink every spring." },
    { id: "7", name:"Harbor Island, Bahamas",image:require("../../assets/Explore-Destinations/Bahamas.jpg"), desc: "A serene beach with soft pink sand and turquoise waters." },
    { id: "8", name:"Rugova Canyon, Kosovo",image:require("../../assets/Explore-Destinations/Rugova.jpg"), desc: "A fascinating canyon with impressive rock formations and natural beauty."  },
  ]);
      return(
      <View  style={{ padding: 30 , flex: 1,backgroundColor:theme.background}}>
        <Text style={{fontSize:24,textAlign:"center",fontWeight:"bold",marginTop:5,marginBottom:15,textDecorationLine: "underline", color:theme.text}}>
       Explore Destinations
        </Text>

 <TextInput
        placeholder="Search destination"
        placeholderTextColor={theme.placeholder}
        value={searchText}
        onChangeText={setSearchText}
        style={{ borderWidth: 1, borderColor:theme.border,backgroundColor: theme.background, borderRadius: 8, padding: 5, marginBottom: 15 }}
      />

<FlatList
data={destinations.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase())
  )}
keyExtractor={(item)=>item.id}
numColumns={2}
columnWrapperStyle={{justifyContent:"space-between"}}
renderItem={({ item }) => <DestinationsItem item={item} />}

/>
        
      
        </View>
      
       
    )

}
