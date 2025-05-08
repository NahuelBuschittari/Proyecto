import React, { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, ScrollView, Platform, Alert } from "react-native";
import { styles } from "../../styles/SharedStyles";
import CustomButton from "../../components/CustomButton";
import { theme } from "../../styles/theme";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from '../../context/AuthContext';
import { API_URL } from '../../context/constants';


const RatingStars = ({ rating, setRating }) => {
    return (
        <View style={styles2.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                    key={star}
                    name={star <= rating ? "star" : "star-outline"}
                    size={30}
                    color={theme.colors.primary}
                    onPress={() => setRating(star)}
                />
            ))}
        </View>
    );
};

const CharacteristicRating = ({ title, rating, setRating }) => (
    <View style={styles2.characteristicContainer}>
        <Text style={styles2.characteristicTitle}>{title}</Text>
        <RatingStars rating={rating} setRating={setRating} />
    </View>
);

const Review = ({ navigation, route }) => {
    const [ratings, setRatings] = useState({
        security: 0,
        cleanliness: 0,
        lighting: 0,
        accessibility: 0,
        service: 0,
    });
    const [comment, setComment] = useState("");

    const inputRef = useRef(null);
    const scrollViewRef = useRef(null);

    const { user, authTokens } = useAuth();
    const { reviewId } = route.params;

    const handleFocus = () => {
        setTimeout(() => {
            inputRef.current?.measureLayout(
                scrollViewRef.current,
                (x, y) => {
                    scrollViewRef.current?.scrollTo({ y, animated: true });
                }
            );
        }, 300);
    };

    const handleSubmit = async () => {
        try {
            const token = authTokens.access;
            const reviewData = {
                id_review: reviewId,
                security: ratings.security,
                cleanliness: ratings.cleanliness,
                lighting: ratings.lighting,
                accessibility: ratings.accessibility,
                service: ratings.service,
                comment: comment,
            };

            const response = await fetch(`${API_URL}/reviews/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al actualizar la reseña');
            }
            Alert.alert('Reseña registrada', 'Tu reseña ha sido registrada correctamente. Gracias por tu opinión.', [{ text: 'Aceptar', onPress: () => navigation.goBack() }]);
            console.log('Review actualizada correctamente:', data.message);
        } catch (error) {
            console.log('Error en la actualización:', error.message);
        }
    };



    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0} 
            style={{ flex: 1 }}
        >
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={[styles.container, { justifyContent: "flex-start" }]}>
                    <Text style={styles.title}>Evaluar Estacionamiento</Text>

                    <CharacteristicRating
                        title="Seguridad"
                        rating={ratings.security}
                        setRating={(value) =>
                            setRatings((prev) => ({ ...prev, security: value }))
                        }
                    />
                    <CharacteristicRating
                        title="Limpieza"
                        rating={ratings.cleanliness}
                        setRating={(value) =>
                            setRatings((prev) => ({ ...prev, cleanliness: value }))
                        }
                    />
                    <CharacteristicRating
                        title="Iluminación"
                        rating={ratings.lighting}
                        setRating={(value) =>
                            setRatings((prev) => ({ ...prev, lighting: value }))
                        }
                    />
                    <CharacteristicRating
                        title="Facilidad de acceso"
                        rating={ratings.accessibility}
                        setRating={(value) =>
                            setRatings((prev) => ({ ...prev, accessibility: value }))
                        }
                    />
                    <CharacteristicRating
                        title="Atención del personal"
                        rating={ratings.service}
                        setRating={(value) =>
                            setRatings((prev) => ({ ...prev, service: value }))
                        }
                    />

                    <Text style={styles2.commentTitle}>
                        Comentarios adicionales (opcional)
                    </Text>
                    <TextInput
                        ref={inputRef}
                        onFocus={handleFocus}
                        style={styles2.commentInput}
                        multiline
                        numberOfLines={4}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Escribe tu comentario aquí..."
                    />

                    <CustomButton
                        text="Enviar reseña"
                        onPress={handleSubmit}
                        type="PRIMARY"
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles2 = StyleSheet.create({
    starsContainer: {
        flexDirection: "row",
        gap: theme.spacing.sm,
        justifyContent: "center",
    },
    characteristicContainer: {
        width: "100%",
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        alignItems: "center",
    },
    characteristicTitle: {
        fontSize: theme.typography.fontSize.normal,
        marginBottom: theme.spacing.sm,
        color: theme.colors.text,
    },

    commentTitle: {
        fontSize: theme.typography.fontSize.normal,
        marginBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        color: theme.colors.text,
    },
    commentInput: {
        width: "90%",
        height: 150, // Aumentado de 100 a 150
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
        textAlignVertical: "top",
    },
});

export default Review;
