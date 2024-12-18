import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#394c74',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    width: '100%',
    padding: 10, // Reducido de 10 a 8 para disminuir el tamaño del input
    marginVertical: 10, // Reducido de 10 a 5 para disminuir el espaciado vertical
    borderWidth: 1,
    borderColor: '#b1c8e7',
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    color: '#394c74',
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#b1c8e7',
    textAlign: 'center',
    lineHeight: 200,
    marginVertical: 10,
    color: '#394c74',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  card: {
    marginVertical: 10,
    padding: 20, // Reducido de 20 a 15 para disminuir el tamaño de la tarjeta
    borderWidth: 1,
    borderColor: '#8ba4c1',
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#394c74',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10, // Reducido de 10 a 5 para disminuir el espaciado entre los elementos
  },
  priceInputContainer: {
    marginBottom: 8, // Reducido de 10 a 8 para disminuir el espaciado entre entradas
  },
  label: {
    marginBottom: 3, // Reducido para ajustar el espaciado entre la etiqueta y el input
    fontSize: 16,
    color: '#394c74',
  },
  button: {
    backgroundColor: '#394c74',
    color: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#5f6f95',
  },
});
