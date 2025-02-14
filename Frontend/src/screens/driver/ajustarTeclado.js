import { KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRef } from "react";

const inputRef = useRef(null);
const scrollViewRef = useRef(null);

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
            <View>
                <TextInput
                    ref={inputRef}
                    onFocus={handleFocus}
                />
            </View>
        </ScrollView>
    </KeyboardAvoidingView>
);


