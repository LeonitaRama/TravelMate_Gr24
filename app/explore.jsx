import React, {useState} from "react";
import { View, Text, Image} from "react-native";
import { FlatList } from "react-native";
import { TextInput } from "react-native";
import {Link} from "expo-router"
export default function Details(){
     const [searchText, setSearchText] = useState("");
    const DestinationsItem=({image,desc,name})=>{
    const [review, setReview] = useState("");
return(
 <View style={{marginBottom: 20,alignItems: "center" }}>
  <Image source={image } style={{width: 150, height: 170,alignItems: "center",}} />
 <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ marginTop: 10, textAlign: "center", fontWeight: "bold" }}>
        {name}  
      </Text>

   <Text style={{ marginTop: 5, textAlign: "center", width: 150,fontStyle:"italic"}}>{desc}
   </Text>
   </View>

   <TextInput style={{borderWidth:1,borderColor:"gray", borderRadius: 8,marginTop: 8, padding: 5, width: "100%"}}
   placeholder="Write a review"
   value={review}
   onChangeText={setReview}
   />

   <Link href="/location" style={{ color: "blue", textDecorationLine: "underline" }}>
    View in Map
  </Link>
  <Link href="/tickets" style={{ color: "green", textDecorationLine: "underline", fontWeight: "bold" }}>
    Get Tickets
  </Link>

  </View>

  
);

  };
 const [destinations, setDestinations] = useState([
    { id: "1",name:"Budva, Montenegro", image:require("../assets/Explore-Destinations/budva.jpg"), desc: "A beautiful coastal city in Montenegro known for its beaches and historic old town." },
    { id: "2", name:"Zermatt, Switzerland",image:require("../assets/Explore-Destinations/Zermatt.jpg"), desc: "The Alpine car-free town famous for skiing, hiking, and stunning views of the Matterhorn." },
    { id: "3", name:"Venice, Italy",image:require("../assets/Explore-Destinations/Venice.jpg"), desc: "A breathtaking view of Venice, the city of canals, colorful buildings, and iconic gondolas." },
    { id: "4",name:"Blue Eye, Albania" ,image:require("../assets/Explore-Destinations/blue-eye.webp"), desc: "The “Blue Eye” in Albania is a crystal-clear spring with vibrant blue and green waters." },
    { id: "5", name:"Aurora, Iceland",image:require("../assets/Explore-Destinations/Aurora.jpg"), desc: "The aurora borealis lights up the sky above Ion Adventure Hotel in Iceland." },
    { id: "6", name:"Jinhae, South Korea",image:require("../assets/Explore-Destinations/Jinhae.jpg"), desc: "Famous for its cherry blossoms, turning the city pink every spring." },
    { id: "7", name:"Harbor Island, Bahamas",image:require("../assets/Explore-Destinations/Bahamas.jpg"), desc: "A serene beach with soft pink sand and turquoise waters." },
    { id: "8", name:"Rugova Canyon, Kosovo",image:require("../assets/Explore-Destinations/Rugova.jpg"), desc: "A fascinating canyon with impressive rock formations and natural beauty."  },
  ]);
      return(
      <View  style={{ padding: 30 , flex: 1,backgroundColor: "#bcc5d7ff"}}>
        <Text style={{fontSize:24,textAlign:"center",fontWeight:"bold",marginTop:5,marginBottom:15,textDecorationLine: "underline"}}>
       Explore Destinations
        </Text>

 <TextInput
        placeholder="Search destination"
        value={searchText}
        onChangeText={setSearchText}
        style={{ borderWidth: 1, borderColor: "gray", borderRadius: 8, padding: 5, marginBottom: 15 }}
      />

<FlatList
data={destinations}
keyExtractor={(item)=>item.id}
numColumns={2}
columnWrapperStyle={{justifyContent:"space-between"}}
renderItem={({ item }) => <DestinationsItem image={item.image} name={item.name} desc={item.desc} />}

/>
        
      
        </View>
      
       
    )

}
