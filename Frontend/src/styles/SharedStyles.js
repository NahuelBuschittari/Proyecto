import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 0.85,
    alignItems: 'center',
    justifyContent:'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },

  // Estilos de Título
  title: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
    color: theme.colors.primary,
  },

  // Contenedor para switch
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.sm,
    justifyContent: 'space-between',
    width: '100%',
  },

  // Placeholder para mapas o imágenes
  mapPlaceholder: {
    width: '100%',
    height: '70%',
    backgroundColor: theme.colors.border,
    textAlign: 'center',
    lineHeight: 200,
    marginVertical: theme.spacing.sm,
    color: theme.colors.primary,
  },

  // Contenedor de botones
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing.md,
  },

  // Estilos de Tarjeta
  card: {
    marginVertical: theme.spacing.sm,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    width: '100%',
  },

  // Título de Tarjeta
  cardTitle: {
    fontSize: theme.typography.fontSize.normal,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary,
  },

  // Contenedor de Grid
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
  },

  // Contenedor de Entrada de Precios
  priceInputContainer: {
    marginBottom: theme.spacing.sm,
  },

  // Etiquetas
  label: {
    marginBottom: theme.spacing.xs,
    fontSize: theme.typography.fontSize.normal,
    color: theme.colors.primary,
  },

  // Botón Deshabilitado
  buttonDisabled: {
    backgroundColor: theme.colors.secondary,
    opacity: 0.6,
  },

  // Texto de Enlace
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
    marginVertical: theme.spacing.sm,
  },

  // Texto de Error
  errorText: {
    color: 'red',
    fontSize: theme.typography.fontSize.small,
    marginBottom: theme.spacing.sm,
  },

  // Contenedor Centrado
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },

  // Contenedor Horizontal
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  forgotPassword: {
    color: '#394c74', // East Bay
    marginVertical: 10,
    textDecorationLine: 'underline',
  },
  signupButton: {
    backgroundColor: '#8ba4c1', // Nepal
  },
  signupButtonText: {
    color: '#0a0a0a', // Black
  },

  navigationButton:{
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    width: '40%',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  navigationButtonText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
  },
  summarySection: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 5
  },
  upperInputText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    alignSelf:'flex-start',
    paddingLeft:'15%',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Header fijo
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,

  },

  // Contenedor del contenido desplazable
  scrollContent: {
    alignContent:'center',
    padding: theme.spacing.xs,
    width:'100%',
    flexGrow: 1, // Asegura que el contenido ocupe el espacio necesario y permita scroll
  },

  // Footer fijo
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
});