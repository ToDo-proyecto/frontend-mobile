import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#151718' }}>
        <ActivityIndicator color="#0a7ea4" size="large" />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)' : '/login'} />;
}
