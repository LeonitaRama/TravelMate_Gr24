import React, { useState, useContext } from 'react'
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../context/ThemeStyles';
import { auth1 as auth, db1 as db } from "../../firebase/firebaseConfig";
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from 'firebase/auth';
import ConfirmModal from '../(components)/ConfirmModal';


const PersonalInfo = () => {
    const { user, setUser } = useAuth();
    const [fullName, setFullName] = useState(user?.displayName || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: "",
        message: "",
        buttons: []
    });


    const router = useRouter();
    const { darkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;

    const handleSave = async () => {
        if (!user) return;
        setLoading(true);
        try {
            await updateProfile(auth.currentUser, {
                displayName: fullName,
            });

            const userRef = doc(db, "users", user.id);
            await updateDoc(userRef, {
                displayName: fullName,
                bio: bio,
                phone: phone,
                updatedAt: new Date().toISOString(),
            });

            setUser({
                ...user,
                displayName: fullName,
                bio: bio,
                phone: phone
            });
            setModalConfig({
                title: "Success",
                message: "Profile updated successfully!",
                buttons: [
                    {
                        label: "OK",
                        color: "#6b63ff",
                        onPress: () => router.back()
                    }
                ]
            });
            setModalVisible(true);


        } catch (error) {
            setModalConfig({
                title: "Error",
                message: "Failed to update profile:\n" + error.message,
                buttons: [
                    {
                        label: "Close",
                        color: "#ff4d4d"
                    }
                ]
            });
            setModalVisible(true);

        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <ScrollView contentContainerStyle={[styles.scroll, { backgroundColor: theme.background }]}>


                {/* //fix this add modal when saved changes to confirm the data were saved */}
                <View style={[styles.forma, { backgroundColor: theme.background }]}>

                    <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.card }]}
                        placeholder="Your name"
                        placeholderTextColor={darkMode ? "#999" : "#666"}
                        value={fullName}
                        onChangeText={setFullName}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>Bio</Text>
                    <TextInput
                        style={[styles.input, { height: 90 }, { backgroundColor: theme.card }]}
                        placeholder="Write something about you..."
                        multiline
                        placeholderTextColor={darkMode ? "#999" : "#666"}
                        value={bio}
                        onChangeText={setBio}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.card, color: darkMode ? "#999" : "#666" }]}
                        value={email}
                        editable={true}
                        placeholderTextColor={darkMode ? "#999" : "#666"}
                    />

                    <Text style={[styles.label, { color: theme.text }]}>Phone Number</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.card, color: theme.text }]}
                        placeholderTextColor={darkMode ? "#999" : "#666"}
                        placeholder="+383 44 000 000"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone} />

                    <TouchableOpacity style={[styles.saveButton, loading && styles.disabledButton]}
                        onPress={handleSave}
                        disabled={loading}
                    >
                        <Text style={styles.saveText}> {loading ? "Saving..." : "Save Changes"}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <ConfirmModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                buttons={modalConfig.buttons}
                onClose={() => setModalVisible(false)}
            />

        </SafeAreaView>
    )
}

export default PersonalInfo

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
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
        borderRadius: 10,
        borderBottomColor:"#83b6f1ff",
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
        paddingVertical: 15,
        backgroundColor:"#83b6f1ff",
        borderRadius: 12,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
});