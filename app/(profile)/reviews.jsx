import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const Reviews = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.center}>
                    <Text style={styles.text}>No reviews yet</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Reviews;

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

