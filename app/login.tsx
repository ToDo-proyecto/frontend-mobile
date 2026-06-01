import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable,
  TextInput, View, ScrollView, Text as RNText, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { FirebaseError } from 'firebase/app';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/services/auth/login';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-credential':  'Incorrect email or password',
  'auth/user-not-found':      'No account found with that email',
  'auth/wrong-password':      'Incorrect password',
  'auth/invalid-email':       'Invalid email address',
  'auth/too-many-requests':   'Too many attempts. Please try again later',
};

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof FirebaseError
        ? (FIREBASE_ERRORS[err.code] ?? 'Failed to sign in')
        : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#151718' }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: 24,
            justifyContent: 'center',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: 'center', marginBottom: 40 }}>
            <View style={{
              width: 72, height: 72, borderRadius: 22,
              backgroundColor: '#0a7ea4',
              alignItems: 'center', justifyContent: 'center',
              shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.45, shadowRadius: 16, elevation: 12,
              marginBottom: 20,
            }}>
              <MaterialIcons name="check-circle" size={36} color="white" />
            </View>
            <RNText style={{ fontSize: 26, fontWeight: '800', color: '#ECEDEE', marginBottom: 6, lineHeight: 34 }}>
              Welcome back
            </RNText>
            <RNText style={{ fontSize: 15, color: '#9BA1A6' }}>
              Sign in to your account
            </RNText>
          </View>

          {/* Form card */}
          <View style={{
            backgroundColor: '#1E2122', borderRadius: 24,
            borderWidth: 1, borderColor: '#2D3235',
            padding: 24, gap: 16,
            shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2, shadowRadius: 12,
          }}>
            {/* Email */}
            <View>
              <Text style={{ fontSize: 12, color: '#9BA1A6', fontWeight: '700', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Email
              </Text>
              <View style={{
                backgroundColor: '#252729', borderWidth: 1, borderColor: '#2D3235',
                borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                flexDirection: 'row', alignItems: 'center', gap: 10,
              }}>
                <MaterialIcons name="email" size={18} color="#4A5258" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#4A5258"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                  style={{ color: '#ECEDEE', fontSize: 15, flex: 1 }}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={{ fontSize: 12, color: '#9BA1A6', fontWeight: '700', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Password
              </Text>
              <View style={{
                backgroundColor: '#252729', borderWidth: 1, borderColor: '#2D3235',
                borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
                flexDirection: 'row', alignItems: 'center', gap: 10,
              }}>
                <MaterialIcons name="lock" size={18} color="#4A5258" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#4A5258"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  style={{ color: '#ECEDEE', fontSize: 15, flex: 1 }}
                />
                <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={10}>
                  <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color="#4A5258" />
                </Pressable>
              </View>
            </View>

            {error && (
              <View style={{
                backgroundColor: '#EF444420', borderRadius: 12, borderWidth: 1,
                borderColor: '#EF4444', paddingHorizontal: 14, paddingVertical: 12,
                flexDirection: 'row', alignItems: 'center', gap: 8,
              }}>
                <MaterialIcons name="error-outline" size={16} color="#EF4444" />
                <Text style={{ color: '#EF4444', fontSize: 13, flex: 1 }}>{error}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.75}
              style={{
                backgroundColor: '#0a7ea4',
                borderRadius: 22,
                paddingVertical: 17,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 4,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading
                ? <Spinner size="small" color="white" />
                : <RNText style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Login  →</RNText>
              }
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28, gap: 4 }}>
            <Text style={{ color: '#9BA1A6', fontSize: 14 }}>Don't have an account?</Text>
            <Pressable onPress={() => router.push('/register' as never)} hitSlop={8}>
              <Text style={{ color: '#0a7ea4', fontSize: 14, fontWeight: '700' }}>Register</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
