import { ExpoPushMessage } from 'expo-server-sdk';

export type SendPushOptions = Omit<ExpoPushMessage, 'to' | 'sound' | 'channelId'> & { pushTokens: string[] };
