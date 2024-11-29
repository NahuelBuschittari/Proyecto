import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const DataAnalysis = () => {
  return (
    <View style={customStyles.container}>
      <Text style={customStyles.message}>
        📊 La sección de análisis de datos estará disponible próximamente.
      </Text>
      <Text style={customStyles.info}>
        Estamos trabajando en la integración con Power BI para mostrar insights detallados.
      </Text>
    </View>
  );
};

export default DataAnalysis;

// Estilos personalizados
const customStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  info: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

// const DataAnalysis = () => {
//   // URL del reporte de Power BI (puedes cambiar esto por tu enlace)
//   const powerBIUrl = 'https://app.powerbi.com/links/b3UsYyDeQg?ctid=a447b9c2-a213-4ec1-8103-3ea69a516a59&pbi_source=linkShare';

//   return (
//     <View style={customStyles.container}>
//       <WebView
//         source={{ uri: powerBIUrl }}
//         startInLoadingState={true} // Muestra el indicador mientras carga
//         renderLoading={() => (
//           <ActivityIndicator 
//             size="large" 
//             color={theme.colors.primary} 
//             style={customStyles.loading} 
//           />
//         )}
//         style={customStyles.webView}
//       />
//     </View>
//   );
// };

// export default DataAnalysis;

// // Estilos personalizados
// const customStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   webView: {
//     flex: 1,
//   },
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
