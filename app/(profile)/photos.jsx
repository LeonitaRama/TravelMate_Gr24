import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, {useContext} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../../context/ThemeContext';
import { lightTheme, darkTheme } from '../../context/ThemeStyles';

const Photos = () => {
    const { darkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;
    return (
        <SafeAreaView style={[styles.container, {backgroundColor:theme.background}]}>
            <ScrollView contentContainerStyle={[styles.scroll, {backgroundColor:theme.background}]}>
                <View style={[styles.center, {backgroundColor:theme.background}]}>

                    <Text style={[styles.text, {color:theme.textSecondary}]}>No photos taken yet</Text>
                    <Ionicons name="images-outline" size={48} color="#888" style={{ marginBottom: 12 }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Photos;

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
    text: {
        fontSize: 20,
        color: '#666',
    }, center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});