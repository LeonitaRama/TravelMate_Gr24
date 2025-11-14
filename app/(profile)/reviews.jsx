import { db2 as db } from '../../firebase/firebaseConfig'; // <-- db2 përdoret për Explore
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                const reviewsArray = [];
                querySnapshot.forEach(doc => {
                    reviewsArray.push({ id: doc.id, ...doc.data() });
                });
                setReviews(reviewsArray);
            } catch (e) {
                console.log('Error fetching reviews:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text>Loading reviews...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {reviews.length === 0 ? (
                    <View style={styles.center}>
                        <Text style={styles.text}>No reviews yet</Text>
                    </View>
                ) : (
                    reviews.map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            <Text style={styles.title}>{review.name}</Text>
                            <Text style={styles.desc}>{review.review}</Text>
                            <Text style={styles.date}>{new Date(review.timestamp.seconds * 1000).toLocaleString()}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Reviews;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8ff" },
    scroll: { padding: 20 },
    text: { fontSize: 20, color: '#666' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    reviewCard: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    title: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
    desc: { fontSize: 14, marginBottom: 5 },
    date: { fontSize: 12, color: '#999' },
});
