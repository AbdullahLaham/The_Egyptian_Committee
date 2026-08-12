import { I18nManager, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import "@/global.css"
import { useEffect } from 'react';
export default function HomeScreen() {
  return <Redirect href="/(auth)/login" />
}

const styles = StyleSheet.create({});
