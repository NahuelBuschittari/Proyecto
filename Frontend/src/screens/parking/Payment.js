import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Clipboard } from 'react-native';
import { styles } from '../../styles/SharedStyles';
import { theme } from '../../styles/theme';

const PaymentScreen = () => {
  const paymentInfo = {
    bankName: 'Banco Nacional',
    accountHolder: 'Estacionamiento S.A.',
    accountNumber: '123456789',
    cbu: '0123456789012345678901',
    alias: 'PARKING.PAGO.SA',
    currency: 'Pesos Argentinos',
  };

  const copyToClipboard = (text, label) => {
    Clipboard.setString(text);
    alert(`${label} copiado al portapapeles`);
  };

  const renderInfoRow = (label, value) => (
    <View style={customStyles.infoRow}>
      <Text style={customStyles.infoLabel}>{label}</Text>
      <TouchableOpacity 
        style={customStyles.copyButton}
        onPress={() => copyToClipboard(value, label)}
      >
        <Text style={customStyles.infoValue}>{value}</Text>
        <Text style={customStyles.copyText}>Copiar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView 
      contentContainerStyle={[
        styles.container, 
        { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg }
      ]}
    >
      <View style={customStyles.headerSection}>
        <Text style={styles.title}>Información de Pago</Text>
        <Text style={customStyles.description}>
          Realiza una transferencia bancaria utilizando los siguientes datos:
        </Text>
      </View>

      <View style={styles.card}>
        {renderInfoRow('Banco', paymentInfo.bankName)}
        {renderInfoRow('Titular', paymentInfo.accountHolder)}
        {renderInfoRow('Número de Cuenta', paymentInfo.accountNumber)}
        {renderInfoRow('CBU', paymentInfo.cbu)}
        {renderInfoRow('Alias', paymentInfo.alias)}
        {renderInfoRow('Moneda', paymentInfo.currency)}
      </View>

      <View style={customStyles.warningSection}>
        <Text style={customStyles.warningText}>
          Importante: Verifica los datos antes de realizar la transferencia.
        </Text>
      </View>
    </ScrollView>
  );
};

export default PaymentScreen;

const customStyles = StyleSheet.create({
  headerSection: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  description: {
    textAlign: 'center',
    color: theme.colors.secondary,
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.normal,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: theme.typography.fontSize.normal,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
    flex: 1,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: theme.typography.fontSize.normal,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  copyText: {
    color: theme.colors.secondary,
    fontSize: theme.typography.fontSize.small,
    textDecorationLine: 'underline',
  },
  warningSection: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
  },
  warningText: {
    color: theme.colors.primary,
    textAlign: 'center',
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
  },
});