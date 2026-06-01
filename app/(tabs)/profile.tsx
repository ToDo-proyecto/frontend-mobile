import { View, Pressable, ScrollView, Alert, TouchableOpacity, Text as RNText } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { Text } from '@/components/ui/text';
import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/services/auth/logout';

export default function ProfileScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const name = user?.displayName ?? 'User';
  const email = user?.email ?? '';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out', style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151718' }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <RNText style={{ fontSize: 26, fontWeight: '800', color: '#ECEDEE', marginTop: 8, marginBottom: 28, lineHeight: 34, paddingTop: 4 }}>
          Profile
        </RNText>

        {/* Avatar card */}
        <View style={{
          backgroundColor: '#1E2122', borderRadius: 24,
          borderWidth: 1, borderColor: '#2D3235',
          padding: 24, alignItems: 'center', marginBottom: 24,
          shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15, shadowRadius: 12,
        }}>
          <View style={{
            width: 80, height: 80, borderRadius: 40,
            backgroundColor: '#0a7ea4', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14,
            shadowColor: '#0a7ea4', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3, shadowRadius: 10,
          }}>
            <RNText style={{ fontSize: 28, fontWeight: '800', color: 'white', lineHeight: 34, includeFontPadding: false } as any}>
              {initials}
            </RNText>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: '#ECEDEE', marginBottom: 4 }}>{name}</Text>
          <Text style={{ fontSize: 14, color: '#9BA1A6' }}>{email}</Text>
        </View>

        {/* Account section */}
        <SectionLabel>Account</SectionLabel>
        <Card>
          <Row icon="badge" label="Name" value={name} />
          <Divider />
          <Row icon="email" label="Email" value={email} last />
        </Card>

        {/* App section */}
        <SectionLabel>About</SectionLabel>
        <Card>
          <Row icon="info-outline" label="Version" value="1.0.0" />
          <Divider />
          <Row icon="code" label="Built with" value="Expo + Firebase" last />
        </Card>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.75}
          style={{
            borderWidth: 1, borderColor: '#EF4444',
            borderRadius: 22, paddingVertical: 16, alignItems: 'center',
            flexDirection: 'row', justifyContent: 'center', gap: 8,
            marginTop: 8,
          }}
        >
          <MaterialIcons name="logout" size={20} color="#EF4444" />
          <RNText style={{ color: '#EF4444', fontSize: 16, fontWeight: '700' }}>Log Out</RNText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <Text style={{
      fontSize: 12, color: '#9BA1A6', fontWeight: '700',
      textTransform: 'uppercase', letterSpacing: 0.8,
      marginBottom: 10, marginLeft: 4,
    }}>
      {children}
    </Text>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <View style={{
      backgroundColor: '#1E2122', borderRadius: 18,
      borderWidth: 1, borderColor: '#2D3235', marginBottom: 20,
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1, shadowRadius: 8, overflow: 'hidden',
    }}>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: '#2D3235', marginLeft: 52 }} />;
}

function Row({ icon, label, value, last }: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={{
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 16, paddingVertical: 14,
    }}>
      <View style={{
        width: 32, height: 32, borderRadius: 8, backgroundColor: '#2D3235',
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
      }}>
        <MaterialIcons name={icon} size={17} color="#9BA1A6" />
      </View>
      <Text style={{ fontSize: 15, color: '#9BA1A6', flex: 1 }}>{label}</Text>
      <Text style={{ fontSize: 14, color: '#ECEDEE', maxWidth: '55%', textAlign: 'right' }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
