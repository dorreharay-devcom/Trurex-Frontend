import { Redirect, useGlobalSearchParams } from 'expo-router';
import { Routes } from '~/shared/config/routes';

export default function TabsRootRedirect() {
  const params = useGlobalSearchParams();
  return <Redirect href={{ pathname: Routes.Main, params }} />;
}
