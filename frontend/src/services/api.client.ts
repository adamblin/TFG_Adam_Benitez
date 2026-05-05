import { Platform } from 'react-native';
import Constants from 'expo-constants';

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '');
}

function getExpoHostUri() {
  const fromExpoConfig = Constants.expoConfig?.hostUri;
  const fromManifest2 = (Constants as unknown as { manifest2?: { extra?: { expoClient?: { hostUri?: string } } } })
    .manifest2?.extra?.expoClient?.hostUri;
  const fromManifest = (Constants as unknown as { manifest?: { debuggerHost?: string } }).manifest
    ?.debuggerHost;

  return fromExpoConfig ?? fromManifest2 ?? fromManifest;
}

function inferBaseUrl() {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return normalizeBaseUrl(envUrl);
  }

  const hostUri = getExpoHostUri();
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host) {
      return `http://${host}:3000`;
    }
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  return 'http://localhost:3000';
}

const BASE_URL = inferBaseUrl();

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...(init?.headers ?? {}),
  };

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message ?? data?.error ?? 'Request failed';
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }

  return data as T;
}

export function getApiBaseUrl() {
  return BASE_URL;
}
