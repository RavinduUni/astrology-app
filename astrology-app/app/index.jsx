import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: check auth state here
  return <Redirect href="/auth/login" />;
}