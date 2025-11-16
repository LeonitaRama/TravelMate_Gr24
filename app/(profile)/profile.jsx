import React, { useContext, useState, useEffect } from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, ScrollView, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from "expo-router";
import ProfileOption from './ProfileOption';
import { auth1 as auth } from "../../firebase/firebaseConfig"
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../context/ThemeStyles';
import { signOut } from 'firebase/auth';
import ConfirmModal from '../(components)/ConfirmModal';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const router = useRouter();
    const { darkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                router.replace("/login")
            }
        });

        return () => unsubscribe()
    }, [])

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.replace("/login");
        } catch (error) {
            console.log('error', error);
        }
    }

    if (!user) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading user info...</Text>
            </View>
        )
    }



    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
            <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.background }]}>
                <View style={[styles.header, { backgroundColor: theme.icon }]}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: user.photoURL || 'https://loremfaces.net/96/id/.jpg' }}
                            style={styles.image}
                        />
                        
                        <FontAwesome6
                            name="add"
                            size={24}
                            color="black"
                            style={styles.addIcon}
                            onPress={() => setShowPhotoOptions(true)}
                        />
                    </View>
                </View>

                <View style={styles.info}>
                    <Text style={[styles.name, { color: theme.text }]}>Welcome {user.displayName ? user.displayName : user.email}</Text>
                    <Text style={[styles.phone, { color: theme.text }]}>{user.bio || ""}</Text>
                </View>

                <ProfileOption title="Personal Information" iconName="person-outline" headerTitle="Personal Information" target="/(profile)/personalInfo" />
                <ProfileOption title="Reviews" iconName="star-outline" headerTitle="Reviews" target="/(profile)/reviews" />
                <ProfileOption title="Wishlist" iconName="heart-outline" headerTitle="Wishlist" target="/(tabs)/wishlist" />
                <ProfileOption title="Photos" iconName="images-outline" headerTitle="Photos" target="/(profile)/photos" />

            <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.icon }]} onPress={() => setShowLogoutModal(true)}
                activeOpacity={0.6} >
                <Text style={styles.logoutBtnText}>Log Out</Text>
            </TouchableOpacity>
                </ScrollView>
<ConfirmModal
    visible={showPhotoOptions}
    title="Profile Photo"
    onClose={() => setShowPhotoOptions(false)}
    buttons={[
        { label: "Take Photo", color: "#6b63ff", onPress: () => console.log("camera here") },
        { label: "Choose from Gallery", color: "#6b63ff", onPress: () => console.log("gallery here") },
        { label: "Remove Photo", color: "#d9534f", onPress: () => console.log("delete here") },
        { label: "Cancel", color: "gray" }
    ]}
/>
<ConfirmModal
    visible={showLogoutModal}
    title="Log Out"
    message="A jeni i sigurt që doni të dilni?"
    onClose={() => setShowLogoutModal(false)}
    buttons={[
        { label: "Dil", color: "#d9534f", onPress: handleLogout },
        { label: "Anulo", color: "gray" }
    ]}
/>
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
    image: {
        width: 150,
        height: 150,
        borderRadius: 1000,
        borderWidth: 1,
        borderColor: 'black',
        overflow: 'hidden'
    },
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
        fontSize: 20,
        fontWeight: "bold",
    },

    infoIcon: {
        backgroundColor: "#ececff",
        padding: 8,
        borderRadius: 12,
    },
    logoutButton: {
        alignSelf: 'center',
        width: "350",
        alignItems: 'center',
        borderRadius: 10,
        padding: 25,
        paddingHorizontal: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
});