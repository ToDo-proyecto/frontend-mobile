import { signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebase";

export const logout = async () => {
  await signOut(auth);
  await AsyncStorage.removeItem("token");
};
