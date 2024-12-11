import React, { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { styles } from "../../styles/SharedStyles";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { theme } from "../../styles/theme";
import DateTimePicker from "@react-native-community/datetimepicker";

const DriverProfile = ({ navigation }) => {
    const [userData, setUserData] = useState({
        name: "Juan",
        surname: "Pérez",
        email: "juan@example.com",
        birthDate: "01/01/1990",
    });

    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleInputChange = (key, value) => {
        setUserData((prev) => ({ ...prev, [key]: value }));
    };

    const toggleDatepicker = () => {
        setShowPicker(!showPicker);
    };

    const onChange = ({ type }, selectedDate) => {
        if (type === "set") {
            const currentDate = selectedDate || date;
            setDate(currentDate);
            handleInputChange("birthDate", currentDate.toLocaleDateString());
        }
        toggleDatepicker();
    };

    const handleSave = () => {
        console.log("Guardando cambios:", userData);
        navigation.goBack();
    };

    const handleLogout = () => {
        console.log("Cerrando sesión");
        navigation.navigate("Login");
    };

    return (
        <View style={[styles.container, { justifyContent: "flex-start" }]}>
            <Text style={styles.title}>Perfil</Text>

            <Text style={styles.upperInputText}>Nombre</Text>
            <CustomInput
                value={userData.name}
                setValue={(value) => handleInputChange("name", value)}
                placeholder="Introduce tu nombre"
            />

            <Text style={styles.upperInputText}>Apellido</Text>
            <CustomInput
                value={userData.surname}
                setValue={(value) => handleInputChange("surname", value)}
                placeholder="Introduce tu apellido"
            />

            <Text style={styles.upperInputText}>Fecha de nacimiento</Text>
            <Pressable
                onPress={toggleDatepicker}
                style={{ width: "100%", alignItems: "center" }}
            >
                <TextInput
                    value={userData.birthDate}
                    editable={false}
                    onPressIn={toggleDatepicker}
                    style={styles2.input}
                />
            </Pressable>
            {showPicker && (
                <DateTimePicker
                    mode="date"
                    display="default"
                    value={date}
                    onChange={onChange}
                />
            )}

            <Text style={styles.upperInputText}>Email</Text>
            <CustomInput
                value={userData.email}
                setValue={(value) => handleInputChange("email", value)}
                placeholder="nombre@ejemplo.com"
                keyboardType="email-address"
            />

            <View style={styles2.buttonContainer}>
                <CustomButton
                    text="Guardar cambios"
                    onPress={handleSave}
                    type="PRIMARY"
                />
                <CustomButton
                    text="Cerrar sesión"
                    onPress={handleLogout}
                    type="TERTIARY"
                />
            </View>
        </View>
    );
};

const styles2 = StyleSheet.create({
    input: {
        backgroundColor: theme.colors.background,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.sm,
        width: "80%",
        color: theme.colors.text,
    },
    buttonContainer: {
        width: "100%",
        marginTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.md,
        alignItems: "center",
        gap: theme.spacing.md,
    },
});

export default DriverProfile;
