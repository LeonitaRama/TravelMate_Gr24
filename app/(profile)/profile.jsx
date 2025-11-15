import React, {useContext} from 'react'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image, StyleSheet, Text, View, StatusBar, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from "expo-router";
import ProfileOption from './ProfileOption';
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../context/ThemeStyles';



const Profile = () => {
    
    const router = useRouter();
    const { darkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <SafeAreaView style={[styles.container,{backgroundColor:theme.background}]}>
            <ScrollView contentContainerStyle={[styles.scroll, {backgroundColor:theme.background}]}>
                <View style={[styles.header,{backgroundColor:theme.header}]}>

                {/* //fix this to save the  image of user logged in if logs in with facebook */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: 'https://loremfaces.net/96/id/.jpg' }}
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
                    <Text style={[styles.name, {color:theme.text}]}>Welcome User</Text>
                    <Text style={[styles.phone, {color:theme.text}]}>Bio</Text>
                </View>

                <ProfileOption title="Personal Information" iconName="person-outline" headerTitle="Personal Information" target="/(profile)/personalInfo" />
                <ProfileOption title="Reviews" iconName="star-outline" headerTitle="Reviews" target="/(profile)/reviews" />
                <ProfileOption title="Wishlist" iconName="heart-outline" headerTitle="Wishlist" target="/(tabs)/wishlist" />
                <ProfileOption title="Photos" iconName="images-outline" headerTitle="Photos" target="/(profile)/photos" />
                </ScrollView>

                {/* fix logout button */}
            <TouchableOpacity style={[styles.logoutButton, {backgroundColor:theme.icon}]}
                activeOpacity={0.6} >
                <Text style={styles.logoutBtnText}>Logout</Text>
            </TouchableOpacity>
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
        backgroundColor: "#6b63ff73",
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
        elevation: 6,
        padding: 25,
        paddingHorizontal: 100,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.7,
        shadowRadius: 3,
    },
});