import store, { persistor } from './store';
import { LocalizationProviderRedux } from '@hooks/useLocalization';
import useNotification from '@hooks/useNotification';
import CodePushProvider from '@integrations/codePush/CodePushProvider';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from '@utilities/rootNavigationRef';
import FontProvider from 'lib/fonts/FontProvider';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import HomePage from 'src/screens/HomePage';
import OtherPage from 'src/screens/OtherPage';
import SplashScreen from 'src/screens/SplashScreen';

Orientation.lockToPortrait();

export type RootStackParamList = {
  SplashScreen: undefined;
  HomePage: undefined;
  OtherPage: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaProvider>
      <CodePushProvider>
        <FontProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <AppContext />
            </PersistGate>
          </Provider>
        </FontProvider>
      </CodePushProvider>
    </SafeAreaProvider>
  );
};

const AppContext = () => {
  useNotification();

  // Register background handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    // no op
  });

  // useEffect(() => {
  //   messaging().subscribeToTopic('ALL');
  // }, []);

  // useEffect(() => {
  //   subscribeNotification(locale);
  // }, [locale]);

  return (
    <LocalizationProviderRedux>
      <View style={styles.container}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} />
            <Stack.Screen name="HomePage" component={HomePage} />
            <Stack.Screen name="OtherPage" component={OtherPage} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </LocalizationProviderRedux>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
