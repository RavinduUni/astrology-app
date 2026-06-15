import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EditProfileForm({ initialValues = {}, onSave, style }) {
  const [name, setName] = useState(initialValues.name || '');
  const [email, setEmail] = useState(initialValues.email || '');

  return (
    <View style={[styles.form, style]}>
      <Text style={styles.label}>Display Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="Your name" />

      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholderTextColor="rgba(255,255,255,0.3)" placeholder="your@email.com" keyboardType="email-address" />

      <TouchableOpacity style={styles.saveBtn} onPress={() => onSave?.({ name, email })}>
        <Text style={styles.saveTxt}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 8 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 10, marginBottom: 4 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 14,
  },
  saveBtn: {
    marginTop: 20,
    backgroundColor: '#FFD700',
    borderRadius: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveTxt: { color: '#0A0A1A', fontWeight: '700', fontSize: 15 },
});
