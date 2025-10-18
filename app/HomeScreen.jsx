import React, { useState, useRef } from 'react';
import { ImageBackground } from 'react-native';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  Animated
} from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const destinations = [
    { id: '1', name: 'Paris', img:require( '../assets/Paris.jpg'), category: 'City', description: 'City of Lights, famous for the Eiffel Tower, cafes, and art museums.', rating: 4.8 },
    { id: '2', name: 'Tokyo', img:require('../assets/tokyo.jpg'), category: 'City', description: 'Vibrant city blending tradition and technology, famous for sushi and temples.', rating: 4.7 },
    { id: '3', name: 'New York', img:require('../assets/NYC.jpg'), category: 'City', description: 'The Big Apple, known for Times Square, Broadway, and iconic skyline.', rating: 4.9 },
    { id: '4', name: 'Bali', img:require('../assets/bali.jpg'), category: 'Beach', description: 'Tropical paradise with sandy beaches, lush jungles, and vibrant culture.', rating: 4.8 },
    { id: '5', name: 'Sydney', img:require('../assets/sydney.jpg'), category: 'City', description: 'Iconic harbor city with stunning beaches and the famous Sydney Opera House.', rating: 4.7 },
    { id: '6', name: 'Maldives', img:require('../assets/Maldives.jpg'), category: 'Beach', description: 'Crystal clear waters, white sand beaches, and luxurious resorts.', rating: 4.9 },
    { id: '7', name: 'Nepal', img:require('../assets/Nepal.jpg'), category: 'Adventure', description: 'Mountain trekking, Himalayan views, and thrilling adventure activities.', rating: 4.9 },
    { id: '8', name: 'Amazon Rainforest', img:require('../assets/AmazonRainforest.jpg'), category: 'Adventure', description: 'Explore the largest rainforest in the world, wildlife, and river cruises.', rating: 4.8 },
    { id: '9', name: 'Iceland', img:require('../assets/iceland.jpg'), category: 'Adventure', description: 'Glaciers, volcanoes, geysers, and northern lights experiences.', rating: 4.9 },
    { id: '10', name: 'Rome', img:require('../assets/rome.jpg'), category: 'City', description: 'Ancient city with Colosseum, Vatican, and rich cultural heritage.', rating: 4.8 },
  ];

  const categories = [
    { id: 'c1', name: 'Beach', emoji: '🌴', color: '#f59e0b' },
    { id: 'c2', name: 'Adventure', emoji: '🌄', color: '#10b981' },
    { id: 'c3', name: 'City', emoji: '🏙️', color: '#3b82f6' },
  ];

  const filteredDestinations = destinations.filter(dest => {
    const matchCategory = selectedCategory ? dest.category === selectedCategory : true;
    const matchQuery = dest.name.toLowerCase().includes(query.toLowerCase());
    return matchCategory && matchQuery;
  });

  const handleCategoryPress = (categoryName) => {
    setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
  };

  const handleSeeMore = (destination) => {
    Alert.alert(
      destination.name,
      `${destination.description}\nCategory: ${destination.category}\nRating: ${destination.rating} ★`,
      [{ text: "Close" }]
    );
  };

 const renderCarouselItem = ({ item, index }) => {
  const inputRange = [
    (index - 1) * width * 0.7,
    index * width * 0.7,
    (index + 1) * width * 0.7,
  ];
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.9, 1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      {/* Nëse item.img është require() ose uri, kjo funskionon */}
      <Image 
        source={typeof item.img === 'string' ? { uri: item.img } : item.img} 
        style={styles.cardImage} 
      />
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.categoryLabel}>{item.category}</Text>
      <Text style={styles.rating}>
        {'★'.repeat(Math.floor(item.rating)) + '☆'.repeat(5 - Math.floor(item.rating))}
      </Text>
      <TouchableOpacity onPress={() => handleSeeMore(item)} style={styles.seeMoreBtn}>
        <Text style={styles.seeMoreText}>See More</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};


  return (
  <ScrollView contentContainerStyle={styles.scrollContent}>
    <ImageBackground
      source={require('../assets/egypt.jpg')}
      style={styles.headerBackground}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <Text style={styles.title}>Welcome to TravelMate 🌍</Text>
      <Text style={styles.subtitle}>Find your next adventure!</Text>

      <TextInput
        style={styles.search}
        placeholder="Search destinations..."
        value={query}
        onChangeText={setQuery}
      />
    </ImageBackground>

    
    <View style={styles.contentSection}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              { backgroundColor: item.name === selectedCategory ? '#000' : item.color },
            ]}
            onPress={() => handleCategoryPress(item.name)}
          >
            <Text style={styles.categoryText}>{item.emoji} {item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Destinations</Text>
      <Animated.FlatList
        data={filteredDestinations}
        horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={width * 0.7}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={renderCarouselItem}
      />
    </View>
  </ScrollView>
);

}

const styles = StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: '#f8fafc', 
     padding: 16 },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    marginTop: 20, 
    textAlign: 'center' },
  subtitle: {
    fontSize: 16, 
    color: '#555', 
    textAlign: 'center',
    marginBottom: 20 },
  search: { 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    padding: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1', 
    marginBottom: 20 },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '600', 
    marginVertical: 10 },
  categoryCard: { 
    padding: 15, 
    borderRadius: 10, 
    marginRight: 10 },
  categoryText: { 
    color: '#fff', 
    fontWeight: '600' },
  card: { marginRight: 10, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    overflow: 'hidden',
    width: width * 0.7, 
    alignItems: 'center', 
    paddingBottom: 10 },
  cardImage: { 
    width: '100%', 
    height: 140 },
  cardText: { 
    paddingTop: 8, 
    fontWeight: '600', 
    fontSize: 16 },
  categoryLabel: { 
    fontSize: 12, 
    color: '#555', 
    marginBottom: 5 },
  rating: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: '#f59e0b', 
    marginBottom: 5 
  },
  seeMoreBtn: { 
    marginTop: 5 
  },
  seeMoreText: { 
    color: '#fff', 
    fontWeight: '600', 
    textAlign: 'center',
     backgroundColor: '#1e40af', 
     padding: 8, 
     borderRadius: 5 },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#f8fafc',
  },
  headerBackground: {
    padding: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#f1f5f9',
    textAlign: 'center',
    marginBottom: 15,
  },
  search: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    width: '90%',
    marginTop: 10,
    marginBottom: 20,
  },
  contentSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  overlay: {
  ...StyleSheet.absoluteFillObject,
  backgroundColor: 'rgba(0, 0, 0, 0.55)',
},


});
