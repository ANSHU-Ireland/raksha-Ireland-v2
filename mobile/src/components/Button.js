import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';

const Button = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  disabled = false, 
  loading = false,
  variant = 'primary',
  size = 'medium'
}) => {
  const getButtonStyles = () => {
    const sizeStyle = size === 'small' ? styles.small : 
                     size === 'large' ? styles.large : 
                     styles.medium;
    
    const baseStyles = [styles.button, sizeStyle];
    
    if (variant === 'primary') {
      return [...baseStyles, styles.primaryButton];
    } else if (variant === 'secondary') {
      return [...baseStyles, styles.secondaryButton];
    } else if (variant === 'danger') {
      return [...baseStyles, styles.dangerButton];
    }
    
    return baseStyles;
  };

  const getTextStyles = () => {
    const sizeTextStyle = size === 'small' ? styles.smallText : 
                         size === 'large' ? styles.largeText : 
                         styles.mediumText;
    
    const baseStyles = [styles.buttonText, sizeTextStyle];
    
    if (variant === 'secondary') {
      return [...baseStyles, styles.secondaryText];
    }
    
    return baseStyles;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        ...getButtonStyles(), 
        disabled && styles.disabled, 
        style
      ]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'secondary' ? '#1a1a1a' : '#ffffff'} 
          size="small" 
        />
      ) : (
        <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  small: {
    height: 40,
    paddingHorizontal: 16,
  },
  medium: {
    height: 48,
    paddingHorizontal: 20,
  },
  large: {
    height: 56,
    paddingHorizontal: 24,
  },
  primaryButton: {
    backgroundColor: '#1a1a1a',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  dangerButton: {
    backgroundColor: '#c00',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'System',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  secondaryText: {
    color: '#1a1a1a',
  },
});

export default Button;