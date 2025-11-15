import { db2 as db } from '../../firebase/firebaseConfig'; // db2 përdoret për Explore
import { collection, getDocs, query, orderBy, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');

    // Fetch reviews nga Firestore
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const q = query(collection(db, 'reviews'), orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(q);
                const reviewsArray = [];
                querySnapshot.forEach(docSnap => {
                    reviewsArray.push({ id: docSnap.id, ...docSnap.data() });
                });
                setReviews(reviewsArray);
            } catch (e) {
                console.log('Error fetching reviews:', e);
                setError("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Delete review nga Firestore
    const deleteReview = async (id) => {
        try {
            const reviewRef = doc(db, 'reviews', id);
            await deleteDoc(reviewRef);
            // Hiq review nga state menjëherë
            setReviews(prev => prev.filter(r => r.id !== id));
            Alert.alert("Review deleted successfully");
            console.log("Deleted review with ID:", id);
        } catch (error) {
            console.log("Error deleting review:", error);
            Alert.alert("Failed to delete review");
        }
    };

    // Confirm para delete
    const handleDelete = (id) => {
        Alert.alert(
            "Delete Review",
            "Are you sure you want to delete this review?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => deleteReview(id) }
            ]
        );
    };

    // Update review
    const handleUpdate = async (id) => {
        if (!editingText.trim()) return Alert.alert("Review cannot be empty");
        try {
            const reviewRef = doc(db, 'reviews', id);
            await updateDoc(reviewRef, { review: editingText });
            setReviews(prev => prev.map(r => r.id === id ? { ...r, review: editingText } : r));
            setEditingId(null);
            setEditingText('');
            Alert.alert("Review updated successfully");
        } catch (e) {
            console.log("Error updating review:", e);
            Alert.alert("Error updating review");
        }
    };

    const renderReview = (item) => {
        const dateString = item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : '';
        return (
            <View key={item.id} style={styles.reviewCard}>
                <Text style={styles.title}>{item.name}</Text>

                {editingId === item.id ? (
                    <>
                        <TextInput
                            style={styles.input}
                            value={editingText}
                            onChangeText={setEditingText}
                        />
                        <TouchableOpacity onPress={() => handleUpdate(item.id)} style={styles.button}>
                            <Text style={styles.buttonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setEditingId(null); setEditingText(''); }}
                            style={[styles.button, { backgroundColor: '#aaa' }]}
                        >
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <Text style={styles.desc}>{item.review}</Text>
                        <Text style={styles.date}>{dateString}</Text>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <TouchableOpacity
                                onPress={() => { setEditingId(item.id); setEditingText(item.review); }}
                                style={[styles.button, { marginRight: 5 }]}
                            >
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                                style={[styles.button, { backgroundColor: '#f55' }]}
                            >
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text>Loading reviews...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.center}>
                    <Text>{error}</Text>
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
                    reviews.map(renderReview)
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Reviews;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f8f8ff" },
    scroll: { padding: 20 },
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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 8,
        marginBottom: 5
    },
    button: {
        backgroundColor: '#3399ff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 5
    },
    buttonText: { color: 'white', fontWeight: 'bold' },
});
