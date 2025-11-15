import React from 'react'
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link, useRouter } from 'expo-router'
import { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../context/ThemeStyles';

const PersonalInfo = () => {
    const [fullName, setFullName] = useState('Leonita Rama');
    const [bio, setBio] = useState('Traveler | Explorer | Dreamer');
    const [email, setEmail] = useState('example@email.com');
    const [phone, setPhone] = useState('+383 44 000 000');

    const router = useRouter();
    const { darkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;
    
    const handleSave = () => {
        alert(`Saved: \nName: ${fullName}\nBio: ${bio}\nEmail: ${email}\nPhone: ${phone}`);
        router.push('/(profile)/profile');
    };

    return (
        <SafeAreaView style={[styles.container, {backgroundColor:theme.background}]}>
            <ScrollView contentContainerStyle={[styles.scroll, {backgroundColor:theme.background}]}>


                {/* //fix this add modal when saved changes to confirm the data were saved */}
                <View style={[styles.forma, {backgroundColor:theme.background}]}>
                    <Text style={[styles.label, {color:theme.text}]}>Full Name</Text>
                    <TextInput
                        style={[styles.input, {backgroundColor:theme.card}]}
                        placeholder="Your name"
                    />
                    <Text style={[styles.label, {color:theme.text}]}>Bio</Text>
                    <TextInput
                        style={[styles.input, { height: 90 }, {backgroundColor:theme.card}]}
                        placeholder="Write something about you..."
                        multiline
                    />
                    <Text style={[styles.label, {color:theme.text}]}>Email</Text>
                    <TextInput
                        style={[styles.input, {backgroundColor:theme.card}]}
                        placeholder="example@email.com"
                        keyboardType="email-address"
                    />

                    <Text style={[styles.label, {color:theme.text}]}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, {backgroundColor:theme.card}]}
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