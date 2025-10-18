import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useSearchParams } from 'expo-router';

export default function DestinationDetails() {
  const params = useSearchParams();

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: params.img }} style={styles.image} />
      <Text style={styles.title}>{params.name}</Text>
      <Text style={styles.category}>{params.category}</Text>
      <Text style={styles.description}>{params.desc}</Text>
      <Text style={styles.rating}>Rating: {params.rating} ★</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#f8fafc', 
    padding: 16 },
  image: { 
    width: '100%', 
    height: 200, 
    borderRadius: 10, 
    marginBottom: 15 },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 5 },
  category: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 10 },
  description: { 
    fontSize: 16, 
    marginBottom: 10 },
  rating: { 
    fontSize: 16, 
    fontWeight: '600' },
});
