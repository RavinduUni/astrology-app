import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Layout = {
  screenWidth: width,
  screenHeight: height,

  // Spacing
  padding: 20,
  paddingLg: 28,
  paddingSm: 12,
  paddingXs: 8,

  // Border radius
  radius: 16,
  radiusMd: 20,
  radiusLg: 24,
  radiusXl: 32,
  radiusFull: 999,

  // Component sizes
  cardPadding: 20,
  tabBarHeight: 88,
  inputHeight: 56,
  buttonHeight: 58,

  // Shadows
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 14,
  },
  shadowSm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  goldGlow: {
    shadowColor: '#C8973A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 14,
    elevation: 12,
  },
  indigoGlow: {
    shadowColor: '#3B4FD4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  purpleGlow: {
    shadowColor: '#6B4EFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
};