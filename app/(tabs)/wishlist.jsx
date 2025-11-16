import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, StyleSheet ,TouchableOpacity} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";
import { Ionicons } from "@expo/vector-icons"; 
import { useTranslation } from "react-i18next";

export default function WishlistScreen() {
   const [favorites, setFavorites] = useState([]);
   const { darkMode } = useContext(ThemeContext);
   const { t, i18n } = useTranslation();
   const theme = darkMode ? darkTheme : lightTheme;
function fixImageSource(image) {
  if (typeof image === "number") {
    return image;
  }
  return { uri: image };
}


  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@favorites');
        const savedFavorites = jsonValue != null ? JSON.parse(jsonValue) : [];
        setFavorites(savedFavorites);
      } catch (e) {
        console.log(e);
      }
    };
    loadFavorites();

  }, []);
  const removeFavorite = async (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    await AsyncStorage.setItem("@favorites", JSON.stringify(updated));
  };


  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
<Image source={fixImageSource(item.image)} style={styles.image }/>    
   <View style={styles.info}> 

      <Text style={[styles.name, {color:theme.text}]}>{item.name}</Text>
      <Text style={[styles.desc, {color:theme.textSecondary}]}>{item.desc}</Text>

      {item.review ? <Text style={[styles.review, {color:"green"}]}>{item.review}</Text> : null}
    </View>
     <TouchableOpacity 
        style={styles.deleteBtn} 
        onPress={() => removeFavorite(item.id)}
      >
        <Ionicons name="trash" size={22} color="white" />
      </TouchableOpacity>
    </View>
  );

  
  return (
    
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{t("title")}</Text>
      {favorites.length === 0 ? (
      <Text style={[styles.empty, { color: theme.textSecondary }]}> {t("empty")}</Text>
  
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
        
      )}
    </View>
    
    
  );
  
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20},
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },
  empty: { fontSize: 18,marginTop:20,textAlign: "center"},
   card: { flexDirection: "row",padding: 12,borderRadius: 16, marginBottom: 16,shadowColor: "#000",shadowOpacity: 0.15,           
    shadowRadius: 6,elevation: 5,alignItems: "center",position: "relative"
  },
 image: {  width: 110, height: 110,borderRadius: 14,marginRight: 12 }, 
  name: { fontWeight: "bold", fontSize: 18 },
  desc: {marginTop: 4,fontSize: 14,fontStyle: "italic",width: "90%" },
  review: { marginTop: 6, fontSize: 14, fontWeight: "600"},
  deleteBtn: {position: "absolute",right: 12,bottom: 12,backgroundColor: "red",padding: 8,borderRadius: 10 }

});
