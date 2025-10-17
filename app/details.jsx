import React, {useState} from "react";
import { View, Text, Image,ScrollView} from "react-native";
import { FlatList } from "react-native";
import { TextInput } from "react-native";
export default function Details(){
  const DestinationsItem=({image,desc})=>{
    const [review, setReview] = useState("");
return(
 <View style={{ width: "48%", marginBottom: 20 }}>
  <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />
   <Text style={{ marginTop: 10, fontSize: 16, textAlign: "center", width: 150 }}>{desc}

   </Text>
   <TextInput style={{borderWidth:1,borderColor:"gray", borderRadius: 8,marginTop: 8, padding: 5, width: 150,fontSize: 14,}}
   placeholder="Write a review"
   value={review}
   onChangeText={setReview}
   />
  </View>
);
  };
 const [destinations, setDestinations] = useState([
    { id: "1", image: "https://content.r9cdn.net/rimg/dimg/e2/9f/a0069cbb-city-7228-16bdc8cb53f.jpg", desc: "Budva, a beautiful coastal city in Montenegro known for its beaches and historic old town." },
    { id: "2", image: "https://d2rdhxfof4qmbb.cloudfront.net/wp-content/uploads/20180807165922/Zermatt.jpg", desc: "Car-free town famous for skiing, hiking, and stunning views of the Matterhorn." },
    { id: "3", image: "https://embracesomeplace.com/wp-content/uploads/2019/06/DSC02512.jpg", desc: "A breathtaking view of Venice, the city of canals, colorful buildings, and iconic gondolas." },
    { id: "4", image: "https://eia476h758b.exactdn.com/wp-content/uploads/2023/12/Blue-eye-spring-near-Sarande-Albania.jpeg", desc: "The “Blue Eye” in Albania is a crystal-clear spring with vibrant blue and green waters." },
    { id: "5", image: "https://www.thetimes.com/imageserver/image/%2Fmethode%2Ftimes%2Fprod%2Fweb%2Fbin%2F4bdd2c05-3e74-47d7-8f82-b3cd8d343bd4.jpg", desc: "The aurora borealis lights up the sky above Ion Adventure Hotel in Iceland." },
    { id: "6", image: "https://apassionandapassport.com/wp-content/uploads/2024/07/jinhae-cherry-blossom-festival-korea-020-750x563.jpg", desc: "Famous for its cherry blossoms, turning the city pink every spring." },
    { id: "7", image: "https://sheiswanderlust.com/wp-content/uploads/2020/06/Pink-sand-beach-harbor-island-bahamas-uai-561x421.jpg", desc: "A serene beach with soft pink sand and turquoise waters." },
  ]);
      return(
      <View  style={{ padding: 20 , flex: 1 }}>
        <Text style={{fontSize:24,textAlign:"center",marginBottom:20,fontWeight:"bold"}}>
          Destinations Details
        </Text>

<FlatList
data={destinations}
keyExtractor={(item)=>item.id}
numColumns={2}
columnWrapperStyle={{justifyContent:"space-between"}}
renderItem={({ item }) => <DestinationsItem image={item.image} desc={item.desc} />}

/>
        
      
        </View>
      
       
    )

}
