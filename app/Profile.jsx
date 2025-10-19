import React from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router';

const Profile = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>

                <StatusBar barStyle="light-content" />
                <View style={styles.header}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/150' }}
                            style={styles.image}
                        />
                        <FontAwesome6
                            name="add"
                            size={24}
                            color="black"
                            style={styles.addIcon}
                        />
                    </View>
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>Welcome User</Text>
                    <Text style={styles.phone}>Bio</Text>
                </View>
                <Link href="/PersonalInfo" asChild>
                    <TouchableOpacity
                        activeOpacity={0.5}
                        style={styles.AccountInfo}

                    >
                        <View style={styles.infoLeft}>
                            <Ionicons name="person-outline" size={24} color="black" />
                            <Text style={styles.sectionTitle}>Personal Information</Text>
                        </View>
                        <Feather style={styles.icon} name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                </Link>
                <Link href="/Reviews" asChild>
                    <TouchableOpacity activeOpacity={0.5} style={styles.AccountInfo}>
                        <View style={styles.infoLeft}>
                            <Ionicons style={styles.icon} name="star-outline" size={24} color="black" />
                            <Text style={styles.sectionTitle}>
                                Reviews</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                </Link>
                <Link href="/Wishlist" asChild>
                    <TouchableOpacity style={styles.AccountInfo}>
                        <View style={styles.infoLeft}>
                            <Ionicons style={styles.infoLeft} name="heart-outline" size={24} color="black" />
                            <Text style={styles.sectionTitle}>
                                Wishlist</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                </Link>
                <Link href="/Photos" asChild>
                    <TouchableOpacity style={styles.AccountInfo}>
                        <View style={styles.infoLeft}>
                            <Ionicons style={styles.infoLeft} name="images-outline" size={24} color="black" />
                            <Text style={styles.sectionTitle}>
                                Photos</Text>
                        </View>
                        <Feather name="chevron-right" size={24} color="black" />
                    </TouchableOpacity>
                </Link>
            </ScrollView>
            <TouchableOpacity style={styles.logoutButton}
                activeOpacity={0.6} >
                <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f8ff",
        flex: 1
    },
    header: {
        alignItems: "center",
        backgroundColor: "#6b63ff73",
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
        alignItems: 'center',
        gap: 10,
        marginBottom: 30,
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
        backgroundColor: "#ffffff54",
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
        borderRadius: 15,
        padding: 5,
        boxShadow: "4px 0 0 4 5",
        elevation: 5,
    },
    button: {
        backgroundColor: "#6b63ff",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
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
    AccountInfo: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },

    infoLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    infoIcon: {
        backgroundColor: "#ececff",
        padding: 8,
        borderRadius: 12,
    },

    sectionTitle: {
        padding: 10,
        fontWeight: "600",
        fontSize: 16,
        color: "#333",
    },
    logoutButton: {
        alignSelf: 'center',
        width: "350",
        alignItems: 'center',
        borderRadius: 10,
        elevation: 6,
        padding: 25,
        paddingHorizontal: 100,
        backgroundColor: '#deb9ff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 3,

    },
});