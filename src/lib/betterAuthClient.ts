import { createAuthClient } from "better-auth/client";
import { expoClient } from "@better-auth/expo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";

// In-memory cache for synchronous access
// The expoClient sometimes calls getItem synchronously
const memoryCache: Record<string, string> = {};

// Hydrate cache from AsyncStorage on module load
AsyncStorage.getAllKeys().then(keys => {
  const relevantKeys = keys.filter(k => k.startsWith("signifiya-auth"));
  if (relevantKeys.length > 0) {
    AsyncStorage.multiGet(relevantKeys).then(pairs => {
      pairs.forEach(([key, value]) => {
        if (value !== null) {
          memoryCache[key] = value;
        }
      });
    });
  }
});

// Storage adapter with sync cache + async persistence
const storage = {
  getItem: (key: string): string | null => {
    return memoryCache[key] ?? null;
  },
  setItem: (key: string, value: string): void => {
    memoryCache[key] = value;
    AsyncStorage.setItem(key, value).catch(console.error);
  },
};

// Create the official Better Auth client with Expo plugin
export const authClient = createAuthClient({
  baseURL: BASE_URL,
  plugins: [
    expoClient({
      scheme: "signifiya",
      storagePrefix: "signifiya-auth",
      storage,
    }),
  ],
});
