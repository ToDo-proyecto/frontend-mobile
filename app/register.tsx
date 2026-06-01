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
import { register } from '@/services/auth/register';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/invalid-email':        'Invalid email address',
  'auth/weak-password':        'Password must be at least 6 characters',
};

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof FirebaseError
        ? (FIREBASE_ERRORS[err.code] ?? 'Failed to create account')
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
            paddingTop: insets.top + 16,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 28, alignSelf: 'flex-start' }}
          >
            <View style={{
              width: 36, height: 36, borderRadius: 12,
              backgroundColor: '#1E2122', borderWidth: 1, borderColor: '#2D3235',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <MaterialIcons name="arrow-back-ios" size={16} color="#9BA1A6" style={{ marginLeft: 4 }} />
            </View>
            <Text style={{ color: '#9BA1A6', fontSize: 15 }}>Back</Text>
          </Pressable>

          {/* Header */}
          <View style={{ marginBottom: 32, paddingTop: 8 }}>
            <RNText style={{ fontSize: 28, fontWeight: '800', color: '#ECEDEE', marginBottom: 6, lineHeight: 36 }}>
              Create account
            </RNText>
            <RNText style={{ fontSize: 15, color: '#9BA1A6' }}>
              Start managing your tasks today
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
            <Field label="Name" value={name} onChange={setName} placeholder="Your name"
              icon="person" autoCapitalize="words" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com"
              icon="email" keyboard="email-address" />
            <Field label="Password" value={password} onChange={setPassword} placeholder="Min. 6 characters"
              icon="lock" secure showPw={showPassword} onTogglePw={() => setShowPassword(v => !v)} />
            <Field label="Confirm Password" value={confirm} onChange={setConfirm} placeholder="Repeat your password"
              icon="lock" secure showPw={showPassword} onTogglePw={() => setShowPassword(v => !v)}
              returnKey="done" onSubmit={handleRegister} />

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
              onPress={handleRegister}
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
                : <RNText style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Create Account  →</RNText>
              }
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 28, gap: 4 }}>
            <Text style={{ color: '#9BA1A6', fontSize: 14 }}>Already have an account?</Text>
            <Pressable onPress={() => router.back()} hitSlop={8}>
              <Text style={{ color: '#0a7ea4', fontSize: 14, fontWeight: '700' }}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

type FieldProps = {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; icon: any; keyboard?: any;
  autoCapitalize?: any; secure?: boolean;
  showPw?: boolean; onTogglePw?: () => void;
  returnKey?: any; onSubmit?: () => void;
};

function Field({ label, value, onChange, placeholder, icon, keyboard, autoCapitalize, secure, showPw, onTogglePw, returnKey, onSubmit }: FieldProps) {
  return (
    <View>
      <Text style={{ fontSize: 12, color: '#9BA1A6', fontWeight: '700', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
        {label}
      </Text>
      <View style={{
        backgroundColor: '#252729', borderWidth: 1, borderColor: '#2D3235',
        borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14,
        flexDirection: 'row', alignItems: 'center', gap: 10,
      }}>
        <MaterialIcons name={icon} size={18} color="#4A5258" />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#4A5258"
          secureTextEntry={secure && !showPw}
          keyboardType={keyboard ?? 'default'}
          autoCapitalize={autoCapitalize ?? 'none'}
          autoCorrect={false}
          returnKeyType={returnKey ?? 'next'}
          onSubmitEditing={onSubmit}
          style={{ color: '#ECEDEE', fontSize: 15, flex: 1 }}
        />
        {secure && (
          <Pressable onPress={onTogglePw} hitSlop={10}>
            <MaterialIcons name={showPw ? 'visibility-off' : 'visibility'} size={20} color="#4A5258" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
