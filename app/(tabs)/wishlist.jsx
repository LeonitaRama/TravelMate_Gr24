import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../context/ThemeStyles";

export default function WishlistScreen() {
  const [favorites, setFavorites] = useState([]);
   const { darkMode } = useContext(ThemeContext);
  const theme = darkMode ? darkTheme : lightTheme;


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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Image source={item.image} style={{ width: 150, height: 150 }} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.desc}>{item.desc}</Text>
      {item.review ? <Text style={styles.review}>Review: {item.review}</Text> : null}
    </View>
  );

  return (
    
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>❤️ Wishlist</Text>
      {favorites.length === 0 ? (
        <Text style={[styles.subtitle, { color: theme.text }]}>Your saved trips will appear here.</Text>
  
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  subtitle: { fontSize: 16, color: "gray" },
  item: { marginBottom: 20, alignItems: "center" },
  name: { fontWeight: "bold", fontSize: 16, marginTop: 5 },
  desc: { fontStyle: "italic", textAlign: "center", marginTop: 5, width: 200 },
  review: { marginTop: 5, color: "green", fontWeight: "bold" },
});
