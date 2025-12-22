import React, { useContext, useState, useEffect } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from "expo-router";
import ProfileOption from './ProfileOption';
import { auth1 as auth, db1 as db } from "../../firebase/firebaseConfig"
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../context/ThemeStyles';
import * as ImagePicker from "expo-image-picker";
import ConfirmModal from '../(components)/ConfirmModal';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
    const { user, loading, logout, setUser } = useAuth();
    const router = useRouter();
    const { darkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;

    //per modal
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [noticeModal, setNoticeModal] = useState({ visible: false, type: "success", message: "" });
    const [loadingModal, setLoadingModal] = useState(false);

    const showNotice = (type, message) => {
        setNoticeModal({ visible: true, type, message });
    };


    const handleNoticeClose = () => {
        setNoticeModal({ ...noticeModal, visible: false });
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            showNotice("error", "Permission to access media library is required!");
            return;
        }

        let results = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.5, base64: true,
        });

        if (!results.canceled) {
            const base64Img = `data:image/jpeg;base64,${results.assets[0].base64}`;
            await updatePhoto(base64Img);
        }
        
    };
    

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            showNotice("error", "Permission to access camera is required!");
            return;
        }

        let results = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.5, base64: true,
        });

        if (!results.canceled) {
            const base64Img = `data:image/jpeg;base64,${results.assets[0].base64}`;
            await updatePhoto(base64Img);
        };
    }

    const updatePhoto = async (base64Img) => {
        setLoadingModal(true);
        try {
            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, { photoURL: base64Img });

            setUser(prev => ({ ...prev, photoURL: base64Img }));

            setShowPhotoOptions(false);
            showNotice("success", "Image uploaded successfully!");
        } catch (err) {
            console.log(err);
            showNotice("error", "Failed to update image!");
        } finally {
            setLoadingModal(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
            router.push("/login")
        } catch (error) {
            showNotice("error", "Logout failed!");
        }
    };

    const removePhoto = async () => {
        setLoadingModal(true);
        const userRef = doc(db, "users", user.id);
        try {
            await updateDoc(userRef, { photoURL: "" });
            setUser(prev => ({ ...prev, photoURL: "" }));
            showNotice("success", "Photo removed successfully!");
        } catch (error) {
            console.log("Error removing photo:", error);
            showNotice("error", "Failed to remove photo!");
        } finally {
            setLoadingModal(false);
            setShowPhotoOptions(false);
        }
    };

useEffect(() => {
  if (!loading && !user) {
    router.replace("/login");
  }
}, [user, loading]);
if (loading) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
}

if (!user) {
  return null; 
}


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
            <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { backgroundColor: theme.icon }]}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: user.photoURL }} style={styles.image} />
                        <FontAwesome6 name="add" size={24} color="black" style={styles.addIcon} onPress={() => setShowPhotoOptions(true)} />
                    </View>
                </View>

                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.text }]}>Welcome {user.displayName ? user.displayName : user.email}</Text>
                    <Text style={[styles.bio, { color: theme.text }]}>{user.bio || "No bio yet"}</Text>
                </View>

                <ProfileOption title="Personal Information" iconName="person-outline" headerTitle="Personal Information" target="/(profile)/personalInfo" />
                <ProfileOption title="Reviews" iconName="star-outline" headerTitle="Reviews" target="/(profile)/reviews" />
                <ProfileOption title="Wishlist" iconName="heart-outline" headerTitle="Wishlist" target="/(tabs)/wishlist" />
                <ProfileOption title="Photos" iconName="images-outline" headerTitle="Photos" target="/(profile)/photos" />

                <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.icon }]} onPress={() => setShowLogoutModal(true)} activeOpacity={0.6} >
                    <Text style={styles.logoutBtnText}>Log Out</Text>
                </TouchableOpacity>
            </ScrollView>

            <ConfirmModal
                visible={showPhotoOptions}
                title="Profile Photo"
                onClose={() => setShowPhotoOptions(false)}
                buttons={[
                    { label: "Take Photo", color: "#6b63ff", onPress: takePhoto },
                    { label: "Choose from Gallery", color: "#6b63ff", onPress: pickImage },
                    { label: "Remove Photo", color: "#d9534f", onPress: removePhoto },
                    { label: "Cancel", color: "gray" }
                ]}
            />
            <ConfirmModal
                visible={showLogoutModal}
                title="Log Out"
                message="Are you sure you want to log out?"
                onClose={() => setShowLogoutModal(false)}
                buttons={[
                    { label: "Yes", color: "#d9534f", onPress: handleLogout },
                    { label: "Cancel", color: "gray" }
                ]}
            />
            <ConfirmModal
                visible={noticeModal.visible}
                type={noticeModal.type}
                message={noticeModal.message}
                onClose={handleNoticeClose}
                buttons={[{ label: "OK", color: "#6b63ff", onPress: handleNoticeClose }]}
            />
            {loadingModal && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#6b63ff" />
                    <Text style={{ marginTop: 10, color: theme.text }}>Processing...</Text>
                </View>
            )}
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        alignItems: "center",
        paddingVertical: 70,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderBottomWidth: 3,
        borderColor: "#5380b750",
        justifyContent: 'center',
        marginBottom: 100,
        overflow: 'visible',
    }, loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999
    }

    ,
    loadingText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    headerTop: {
        flexDirection: 'row',
        backgroundColor: "#cc0f0f",
        alignItems: 'center',
        gap: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    // image: {
    //     width: 150,
    //     height: 150,
    //     borderRadius: 1000,
    //     borderWidth: 1,
    //     borderColor: 'black',
    //     overflow: 'hidden'
    // },
    imageContainer: {
        position: 'absolute',
        bottom: -70,
        alignSelf: 'center',
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: 'black',
        backgroundColor: "#ffffff",
        elevation: 4
    },
    addIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 3,
        borderRadius: 15,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    button: {
        backgroundColor: "#6b63ff0",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
    },
    info: {
        alignItems: 'center',
        color: "#000",
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: 'center',
        marginBottom: 5,
    },
    bio: {
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.7,
    },
    infoIcon: {
        backgroundColor: "#ececff",
        padding: 8,
        borderRadius: 12,
    },
    logoutButton: {
        alignSelf: 'center',
        width: "90%",
        alignItems: 'center',
        borderRadius: 10,
        padding: 25,
        marginTop: 15,
        paddingHorizontal: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
});