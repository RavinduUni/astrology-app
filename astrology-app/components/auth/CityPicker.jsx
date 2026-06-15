import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Ionicons } from '@expo/vector-icons';

const POPULAR_CITIES = [
  { name: 'Colombo', country: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Kandy', country: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Galle', country: 'Sri Lanka', flag: '🇱🇰' },
  { name: 'Jaffna', country: 'Sri Lanka', flag: '🇱🇰' },
];

export default function CityPicker({ visible, onClose, onSelect }) {
  const [query, setQuery] = useState('');

  const filtered = POPULAR_CITIES.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.country.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (city) => {
    onSelect(city);
    onClose();
    setQuery('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}><Ionicons name="location-outline" size={18} color={Colors.goldLight} />  Select Birth City</Text>

        {/* Search input */}
        <View style={styles.searchWrap}>
          <Text style={styles.searchIcon}><Ionicons name="search-outline" size={18} color={Colors.goldLight} /></Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city..."
            placeholderTextColor={Colors.textMuted}
            value={query}
            onChangeText={setQuery}
            selectionColor={Colors.gold}
          />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(item, i) => `${item.name}-${i}`}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={styles.cityItem}
              activeOpacity={0.7}
            >
              <Text style={styles.cityFlag}>{item.flag}</Text>
              <View style={styles.cityInfo}>
                <Text style={styles.cityName}>{item.name}</Text>
                <Text style={styles.cityCountry}>{item.country}</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: Colors.borderGold,
    maxHeight: '75%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    ...Typography.h4,
    textAlign: 'center',
    marginBottom: 16,
    color: Colors.textGold,
    paddingHorizontal: 24,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 24,
    marginBottom: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.white,
  },
  list: {
    paddingHorizontal: 24,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  cityFlag: {
    fontSize: 22,
    marginRight: 14,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.white,
  },
  cityCountry: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
  },
});