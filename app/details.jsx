import React from "react";
import { View, Text, Image } from "react-native";
export default function Details(){
    return(
        <View style={{ flex: 1, alignItems: "center", marginTop: 50 }}>

            <Image
          source={{ uri: "https://content.r9cdn.net/rimg/dimg/e2/9f/a0069cbb-city-7228-16bdc8cb53f.jpg?width=1366&height=768&xhint=2335&yhint=1945&crop=true&watermarkposition=lowerright" }}
        style={{ width: 300, height: 200 }}
        />
        <Text style={{marginTop: 10, fontSize: 16, textAlign: "center"}}>
                    Budva, a beautiful coastal city in Montenegro known for its beaches and historic old town.

        </Text>
        </View>
    )

}
