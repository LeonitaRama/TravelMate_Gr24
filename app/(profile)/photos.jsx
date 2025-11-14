import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Photos = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.center}>

                    <Text style={styles.text}>No photos taken yet</Text>
                    <Ionicons name="images-outline" size={48} color="#888" style={{ marginBottom: 12 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Photos;

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
    }, center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});