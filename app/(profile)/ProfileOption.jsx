import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";

const ProfileOption = ({ title, iconName, target, iconLib = "Ionicons" }) => {
    const router = useRouter();

    const IconComponent =
        iconLib === "Ionicons" ? Ionicons :
            iconLib === "Feather" ? Feather : null;

    const handlePress = () => {
        router.push({
            pathname: target,
        });
    };

    return (
        <TouchableOpacity style={styles.AccountInfo} activeOpacity={0.6}
            onPress={handlePress}>
            <View style={styles.infoLeft}>
                <IconComponent name={iconName} size={24} color="black" />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <Feather name="chevron-right" size={24} color="black" />
        </TouchableOpacity>
    )
}

export default ProfileOption

const styles = StyleSheet.create({
    AccountInfo: {
        backgroundColor: "#fff",
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 18,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    infoLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    sectionTitle: {
        padding: 10,
        fontWeight: "600",
        fontSize: 16,
        color: "#333",
    },
});