import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Mail } from 'lucide-react-native';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const { colors } = useTheme();

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
            <Mail size={48} color={colors.primary} />
          </View>
          
          <Text style={[styles.title, { color: colors.text }]}>Check Your Email</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            We've sent a password reset link to {email}
          </Text>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.buttonText}>Back to Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => setSent(false)}
          >
            <Text style={[styles.resendText, { color: colors.primary }]}>
              Didn't receive the email? Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={colors.text} />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Forgot Your Password?</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Enter your email address and we'll send you a link to reset your password
        </Text>
        
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text, 
                  borderColor: error ? '#EF4444' : colors.border 
                }
              ]}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={[styles.backToLoginText, { color: colors.primary }]}>
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  backToLoginButton: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '500',
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});