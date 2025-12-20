import React, { useContext } from 'react'
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from '../../context/ThemeStyles';

const ConfirmModal = ({ visible,
    title = "Notice",
    message,
    buttons = [],
    onClose }) => {

    const defaultButtons = buttons.length ? buttons : [{ label: "OK", color: "#6b63ff", onPress: onClose }];

    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const theme = darkMode ? darkTheme : lightTheme;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={[styles.overlay, { backgroundColor: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)' }]}>
                <View style={[styles.box, { backgroundColor: theme.card, borderColor: theme.border }]}>

                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                    {message && <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>}

                    <View>
                        {(buttons.length ? buttons : [{ label: "OK", color: "#6b63ff", onPress: onClose }]).map((btn, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.button, { backgroundColor: btn.color || theme.button }]}
                                onPress={() => {
                                    btn.onPress && btn.onPress();
                                    onClose && onClose();
                                }}
                            >
                                <Text style={[styles.btnText, { color: '#fff' }]}>{btn.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default ConfirmModal

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)"
    }
    , box: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20
    }
    , title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10
    }
    , message: {
        fontSize: 16,
        marginBottom: 20
    }
    , button: {
        padding: 12,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center"
    }, btnText: {
        color: "#fff",
        fontSize: 16
    }
})