import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { styles } from "../../styles/SharedStyles";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { theme } from "../../styles/theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';

const DriverProfile = ({ navigation }) => {
    const { user, authTokens, logout} = useAuth();
    const [userData, setUserData] = useState({
        name: "",
        surname: "",
        email: "",
        birthDate: "",
    });

    const [showPicker, setShowPicker] = useState(false);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_URL}/driver/${user.id}/profile`, {
                    headers: {
                        Authorization: `Bearer ${authTokens.access}`,
                    }
                });
                const data = await response.json();
                setUserData({
                    name: data.nombre,
                    surname: data.apellido,
                    email: data.email,
                    birthDate: new Date(data.fecha_nacimiento).toLocaleDateString(),
                });
                setDate(new Date(data.fecha_nacimiento));
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile();
    }, []);

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

    const handleSave = async () => {
        try {
            const response = await fetch(`${API_URL}/driver/${user.id}/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authTokens.access}`,
                },
                body: JSON.stringify({
                    nombre: userData.name,
                    apellido: userData.surname,
                    fecha_nacimiento: date.toISOString().split('T')[0],
                }),
            });

            if (response.ok) {
                navigation.goBack();
            } else {
                console.error('Error al actualizar perfil');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
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
                editable={false}
                style={{backgroundColor: '#e0e0e0'}} 
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
