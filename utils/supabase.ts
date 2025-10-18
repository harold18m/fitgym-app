
import 'react-native-url-polyfill/auto'
import 'react-native-get-random-values'
import { createClient, processLock } from '@supabase/supabase-js'
import { Platform } from 'react-native'

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY!

let storage: any = undefined
if (Platform.OS !== 'web') {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  storage = {
    getItem: (key: string) => AsyncStorage.getItem(key),
    setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
    removeItem: (key: string) => AsyncStorage.removeItem(key),
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
})
