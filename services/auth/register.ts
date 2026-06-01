import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebase';

export const register = async (name: string, email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  const token = await userCredential.user.getIdToken();
  await AsyncStorage.setItem('token', token);
  return token;
};
