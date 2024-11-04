import useLocalization from '@hooks/useLocalization';
import useSplashScreen from '@hooks/useSplashScreen';
import { useCodePush } from '@integrations/codePush/CodePushProvider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { isTabletRatio, space } from '@utilities/rn-helper';
import { RootStackParamList } from 'App';
import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { default as CodePush } from 'react-native-code-push';
import { getVersion } from 'react-native-device-info';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useDispatch } from 'react-redux';
import CodePushUpdateBar from 'src/components/CodePushUpdateBar';
import { checkVersionUpdated } from 'src/utilities/splashScreenChecks';

type Props = NativeStackScreenProps<RootStackParamList, 'SplashScreen'>;

function SplashScreen({ navigation }: Props) {
  const currentVersion = getVersion();
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const {
    status: codePushStatus,
    progress,
    isCodePushReady,
    isCodePushSkipAble,
  } = useCodePush();

  const showCodePushDownload =
    !isCodePushSkipAble &&
    codePushStatus === CodePush.SyncStatus.DOWNLOADING_PACKAGE;

  const { status: splashScreenReady } = useSplashScreen(
    {
      mandatorySync: [checkVersionUpdated],
    },
    isCodePushReady,
    {
      minWaitTime: 1000,
      context: {
        dispatch,
        t,
        navigation,
      },
    },
  );

  useEffect(() => {
    console.log('SPLASHSCREEN - Ready', splashScreenReady);
    if (splashScreenReady)
      navigation.reset({ index: 0, routes: [{ name: 'HomePage' }] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashScreenReady]);

  return (
    <ImageBackground
      style={styles.root}
      imageStyle={styles.imageBackground}
      source={require('src/assets/images/splash.jpg')}>
      {/* <ForceUpdateModal isVisible={forceUpdate} detail={forceUpdateDetail} /> */}
      {/* <Image source={require('assets/images/main_logo.png')} /> */}
      <View style={styles.noteStyle}>
        <Text
          style={{
            paddingBottom: space * 2,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {t('splashScreen.dear')}
        </Text>
        <Text
          style={{ textAlign: 'justify', fontWeight: 'bold', color: 'white' }}>
          {t('splashScreen.note')}
        </Text>
      </View>

      {showCodePushDownload && (
        <CodePushUpdateBar progress={progress} style={styles.codePush} />
      )}
      <Text style={styles.cornerLabel}>{currentVersion}</Text>
    </ImageBackground>
  );
}

export default SplashScreen;

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  codePush: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginHorizontal: isTabletRatio() ? '30%' : '20%',
    bottom: 14,
  },
  cornerLabel: {
    position: 'absolute',
    bottom: getBottomSpace() || 10,
    right: getBottomSpace() || 10,
    fontWeight: 'bold',
    opacity: 0.8,
    color: 'white',
  },
  noteStyle: {
    position: 'absolute',
    top: '17%',
    paddingHorizontal: space * 8,
  },
  imageBackground: {
    resizeMode: 'cover',
    height: '100%',
  },
});
