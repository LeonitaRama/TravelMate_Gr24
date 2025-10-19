import React from 'react'
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { useState } from 'react';

const PersonalInfo = () => {
    const [fullName, setFullName] = useState('Leonita Rama');
    const [bio, setBio] = useState('Traveler | Explorer | Dreamer');
    const [email, setEmail] = useState('example@email.com');
    const [phone, setPhone] = useState('+383 44 000 000');
const router = useRouter();
const handleSave = () => {
    alert(`Saved: \nName: ${fullName}\nBio: ${bio}\nEmail: ${email}\nPhone: ${phone}`);
router.push('/Profile');  
};

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <View style={styles.header}>
                    <Link href="../Profile">
                        <Ionicons name="chevron-back" size={26} color="black" />
                    </Link>
                    <Text style={styles.headerTitle}>Personal Information</Text>
                </View>

                <View style={styles.forma}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your name"
                    />
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, { height: 90 }]}
                        placeholder="Write something about you..."
                        multiline
                    />
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="example@email.com"
                        keyboardType="email-address"
                    />

                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="+383 44 000 000"
                        keyboardType="phone-pad" />
                    <View style={styles.pickerWrapper}>

                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default PersonalInfo

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
    // forsma: {
    //     backgroundColor: '#fff',
    //     padding: 20,
    //     borderRadius: 20,
    //     shadowColor: '#000',
    //     shadowOffset: { width: 0, height: 3 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 5,
    //     elevation: 5,
    // },
    label: {
        fontWeight: '600',
        marginTop: 15,
        marginBottom: 6,
    },
    input: {
        backgroundColor: "#fff",
        borderBottomWidth: 3,
        borderBottomColor: "#6b63ff73",
        borderRadius: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    saveButton: {
        marginTop: 30,
        backgroundColor: "#6b63ff73",
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});