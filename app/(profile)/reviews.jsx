import { db2 as db } from '../../firebase/firebaseConfig'; 
import { collection, getDocs, query, orderBy, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import React, { useEffect, useState, useContext,useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity,Animated} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../context/ThemeStyles';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState('');
    const { darkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success"); 
    const toastAnim = useRef(new Animated.Value(100)).current; 

    const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);

    Animated.timing(toastAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
    }).start(() => {
        setTimeout(() => {
            Animated.timing(toastAnim, {
                toValue: 100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }, 2000);
    });
};

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

   
    const deleteReview = async (id) => {
        try {
            const reviewRef = doc(db, 'reviews', id);
            await deleteDoc(reviewRef);
            
            setReviews(prev => prev.filter(r => r.id !== id));
            showToast("Review deleted successfully", "success"); 
            console.log("Deleted review with ID:", id);
        } catch (error) {
            console.log("Error deleting review:", error);
            showToast("Failed to delete review", "error");
        }
    };

    
 const handleDelete = (id) => {
    deleteReview(id);
};

    
    const handleUpdate = async (id) => {
        if (!editingText.trim()) return  showToast("Review cannot be empty", "error");
        try {
            const reviewRef = doc(db, 'reviews', id);
            await updateDoc(reviewRef, { review: editingText });
            setReviews(prev => prev.map(r => r.id === id ? { ...r, review: editingText } : r));
            setEditingId(null);
            setEditingText('');
            showToast("Review updated successfully", "success");
        } catch (e) {
            console.log("Error updating review:", e);
           showToast("Error updating review", "error");
        }
    };

    const renderReview = (item) => {
        const dateString = item.timestamp ? new Date(item.timestamp.seconds * 1000).toLocaleString() : '';
        return (
            <View key={item.id} style={[styles.reviewCard, {backgroundColor:theme.card}]}>
                <Text style={[styles.title, {color:theme.text}]}>{item.name}</Text>

                {editingId === item.id ? (
                    <>
                        <TextInput
                            style={[styles.input, {color:theme.text}]}
                            value={editingText}
                            onChangeText={setEditingText}
                        />
                        <TouchableOpacity onPress={() => handleUpdate(item.id)} style={styles.button}>
                            <Text style={[styles.buttonText, {color:theme.button}]}>Save</Text>
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
                                style={[styles.button, { marginRight: 5 }, {backgroundColor:theme.button}]}
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
            <SafeAreaView style={[styles.container, {backgroundColor:theme.background}]}>
                <View style={[styles.center, {backgroundColor:theme.background}]}>
                    <Text>Loading reviews...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={[styles.container, {backgroundColor:theme.background}]}>
                <View style={[styles.center, {backgroundColor:theme.background}]}>
                    <Text>{error}</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, {backgroundColor:theme.background}]}>
            <ScrollView contentContainerStyle={[styles.scroll, {backgroundColor:theme.background}]}>
                {reviews.length === 0 ? (
                    <View style={[styles.center, {backgroundColor:theme.background}]}>
                        <Text style={styles.text}>No reviews yet</Text>
                    </View>
                ) : (
                    reviews.map(renderReview)
                )}
            </ScrollView>
                {toastMessage ? (
      <Animated.View
        style={{
          position: "absolute",
          bottom: 30,
          left: 20,
          right: 20,
          padding: 15,
          backgroundColor: toastType === "success" ? "green" : "red",
          borderRadius: 8,
          alignItems: "center",
          transform: [{ translateY: toastAnim }],
          zIndex: 999,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>{toastMessage}</Text>
      </Animated.View>
    ) : null}
        </SafeAreaView>
    );
};

export default Reviews;

const styles = StyleSheet.create({
    container: { flex: 1 },
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
