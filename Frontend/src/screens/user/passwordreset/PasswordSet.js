import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const PasswordSet = ({ route, navigation }) => {

 // const { userId, token } = route.params;
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  /*
  const [tokenValid, setTokenValid] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    validateToken();
  }, []);

  const validateToken = async () => {
    try {
      const response = await fetch(`YOUR_API_URL/validate-reset-token/${userId}/${token}/`);
      const data = await response.json();
      setTokenValid(data.valid);
    } catch (error) {
      Alert.alert('Error', 'El enlace no es válido o ha expirado');
      navigation.replace('Login');
    } finally {
      setValidating(false);
    }
  };
  */

  const validatePasswords = () => {
    const newErrors = {};

    if (passwords.newPassword.length < 8) {
      newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }else if (passwords.confirmPassword.length >= 8) {
      navigation.navigate('Login');}
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*
  const handleResetPassword = async () => {
    if (!validatePasswords()) return;

    try {
      setLoading(true);
      const response = await fetch(`YOUR_API_URL/reset-password/${userId}/${token}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: passwords.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }

      Alert.alert(
        'Éxito',
        'Tu contraseña ha sido restablecida correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Validando enlace...</Text>
      </View>
    );
  }

  if (!tokenValid) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enlace Inválido</Text>
        <Text style={styles.message}>
          El enlace de restablecimiento no es válido o ha expirado.
          Por favor, solicita uno nuevo.
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.replace('ForgotPassword')}
        >
          <Text style={styles.buttonText}>Solicitar Nuevo Enlace</Text>
        </TouchableOpacity>
      </View>
    );
  }
  */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restablecer Contraseña</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput
          style={[styles.input, errors.newPassword && styles.inputError]}
          secureTextEntry
          value={passwords.newPassword}
          onChangeText={(text) => 
            setPasswords(prev => ({...prev, newPassword: text}))
          }
          placeholder="Ingresa tu nueva contraseña"
          placeholderTextColor="#5f6f95"
        />
        {errors.newPassword && (
          <Text style={styles.errorText}>{errors.newPassword}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={[styles.input, errors.confirmPassword && styles.inputError]}
          secureTextEntry
          value={passwords.confirmPassword}
          onChangeText={(text) => 
            setPasswords(prev => ({...prev, confirmPassword: text}))
          }
          placeholder="Confirma tu nueva contraseña"
          placeholderTextColor="#5f6f95"
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={validatePasswords /*handleResetPassword*/} // Solo valida localmente
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0a0a0a',
    textAlign: 'center',
    marginBottom: 32,
  },
  message: {
    fontSize: 16,
    color: '#394c74',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#394c74',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8ba4c1',
    borderRadius: 8,
    padding: 12,
    color: '#0a0a0a',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#ff4444',
  },
  errorText: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: '#394c74',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#8ba4c1',
  },
  buttonText: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PasswordSet;
