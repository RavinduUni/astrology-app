import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Ionicons } from '@expo/vector-icons';

export default function CosmicInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  icon,        // emoji or character icon
  rightIcon,   // right side icon component or emoji
  onRightIconPress,
  error,
  style,
  inputStyle,
  editable = true,
  onPress,     // if set, makes the whole field a pressable (for pickers)
  multiline = false,
  numberOfLines = 1,
}) {
  const [focused, setFocused] = useState(false);
  const [secureVisible, setSecureVisible] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.border, Colors.borderGold],
  });

  const isSecure = secureTextEntry && !secureVisible;

  const content = (
    <Animated.View
      style={[
        styles.container,
        { borderColor },
        error && styles.containerError,
        !editable && styles.containerDisabled,
        style,
      ]}
    >
      {icon ? (
        <Text style={styles.iconLeft}>{icon}</Text>
      ) : null}

      {onPress ? (
        <Text
          style={[
            styles.input,
            inputStyle,
            !value && styles.placeholder,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
      ) : (
        <TextInput
          style={[styles.input, inputStyle, multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={Typography.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          multiline={multiline}
          numberOfLines={numberOfLines}
          selectionColor={Colors.gold}
        />
      )}

      {secureTextEntry ? (
        <TouchableOpacity
          onPress={() => setSecureVisible(!secureVisible)}
          style={styles.rightIconWrap}
        >
          <Text style={styles.iconRight}>{secureVisible ? <Ionicons name="eye" color={Colors.goldLight} size={18} /> : <Ionicons name="eye-off" color={Colors.goldLight} size={18} />}</Text>
        </TouchableOpacity>
      ) : rightIcon ? (
        <TouchableOpacity
          onPress={onRightIconPress}
          style={styles.rightIconWrap}
          disabled={!onRightIconPress}
        >
          <Text style={styles.iconRight}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : null}
    </Animated.View>
  );

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          {content}
        </TouchableOpacity>
      ) : (
        content
      )}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    ...Typography.label,
    marginBottom: 8,
    color: Colors.textSecondary,
  },
  container: {
    height: Layout.inputHeight,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusMd,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  containerError: {
    borderColor: Colors.danger,
  },
  containerDisabled: {
    opacity: 0.6,
  },
  iconLeft: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    ...Typography.inputText,
    color: Colors.white,
  },
  placeholder: {
    color: Typography.inputPlaceholder,
  },
  multiline: {
    height: 'auto',
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  rightIconWrap: {
    padding: 4,
    marginLeft: 8,
  },
  iconRight: {
    fontSize: 16,
  },
  error: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: 5,
    marginLeft: 4,
  },
});