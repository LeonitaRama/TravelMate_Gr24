import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
const Wishlist = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Link href="../Profile">
                        <Ionicons name="chevron-back" size={26} color="black" />
                    </Link>
                    <Text style={styles.headerTitle}>Wishlist</Text>
                </View>
                <View style={styles.center}>
                    <Text style={styles.text}>Your saved trips will appear here.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Wishlist;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f8ff",
    },
    scroll: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    text: {
        fontSize: 20,
        color: '#666',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

