import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ActivityIndicator 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
    const baseStyles = [styles.button, styles[size]];
    
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
    const baseStyles = [styles.buttonText, styles[`${size}Text`]];
    
    if (variant === 'secondary') {
      return [...baseStyles, styles.secondaryText];
    }
    
    return baseStyles;
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[...getButtonStyles(), disabled && styles.disabled, style]}
      >
        <LinearGradient
          colors={disabled ? ['#cccccc', '#999999'] : ['#FF6B35', '#FF8E53']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={[...getTextStyles(), textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[...getButtonStyles(), disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'secondary' ? '#FF6B35' : '#ffffff'} 
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
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    // Gradient handled in component
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  dangerButton: {
    backgroundColor: '#DC3545',
  },
  disabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '600',
    color: '#ffffff',
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
    color: '#FF6B35',
  },
});

export default Button;