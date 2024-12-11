import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { styles } from "../../styles/SharedStyles";
import CustomButton from "../../components/CustomButton";
import { theme } from "../../styles/theme";
import Ionicons from "react-native-vector-icons/Ionicons";

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

const Review = ({ navigation }) => {
    const [ratings, setRatings] = useState({
        security: 0,
        cleanliness: 0,
        lighting: 0,
        accessibility: 0,
        service: 0,
    });
    const [comment, setComment] = useState("");

    const handleSubmit = () => {
        console.log("Ratings:", ratings);
        console.log("Comment:", comment);
        navigation.goBack();
    };

    return (
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
