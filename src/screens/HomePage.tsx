import { WEBSITE_DOMAIN_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { BackHandler, Linking, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import WebView from 'react-native-webview';
import Error from 'src/components/Error';

export const maintenanceUri = '/underMaintenance';

enum PostMessageType {
  NewWindow = 'NewWindow',
}

export const INJECTED_JAVASCRIPT = `
    setTimeout(() => {
    try {
      window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
      /*  User agreed to use VN only for APP. */
      // const getlocale=document.querySelectorAll(".language img")[0].alt;
      // window.ReactNativeWebView.postMessage(getlocale);

      ${
        Platform.OS === 'android'
          ? ` 
            if (typeof window.ReactNativeWebView !== "undefined") {
              window.open = function (url) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({
                    payload: url,
                    type: "${PostMessageType.NewWindow.toString()}",
                  })
                );
              };
            };
          `
          : ''
      }
    } catch(e){}
    },100);
    true;
  `;

export const depositURL = [
  'DepositReqOnlineBanking',
  'DepositReqMobilePay',
  'DepositReqBankAutoChannel',
  'DepositReqQRPay',
  'DepositReq',
];
const share = [
  'www.youtube.com',
  'www.tiktok.com',
  'line.naver.j',
  'twitter.com',
  'zalo.me',
];

const HomePage = () => {
  const webRef = useRef<WebView>(null);
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const navChange = () => {
    if (webRef.current) {
      webRef.current.injectJavaScript(INJECTED_JAVASCRIPT);
    }
  };

  const handleBackButtonPress = () => {
    try {
      webRef.current?.goBack();
      return true;
    } catch (err) {
      console.log('Error : ', err);
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, []);

  const socialShare = (link: string) => {
    const ShareList = [
      {
        icon: 'facebook',
        shareOptions: {
          message: '',
          url: link,
          social: Share.Social.FACEBOOK,
        },
      },
      {
        icon: 'wa.me',
        shareOptions: {
          message: '',
          url: link,
          social: Share.Social.WHATSAPP,
        },
      },
      {
        icon: 't.me',
        shareOptions: {
          title: 'Share via',
          message: `${link}`,
          social: Share.Social.TELEGRAM,
        },
      },
    ];
    ShareList.filter((i, index) => {
      const check = link.includes(i.icon);

      if (check) {
        return Share.shareSingle(i.shareOptions);
      }
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingTop: top, backgroundColor: '#141f33' }} />
      <WebView
        ref={webRef}
        source={{ uri: WEBSITE_DOMAIN_URL }}
        originWhitelist={['*']}
        sharedCookiesEnabled
        thirdPartyCookiesEnabled
        allowsFullscreenVideo={false}
        textZoom={100}
        scalesPageToFit
        mediaPlaybackRequiresUserAction
        bounces={false}
        javaScriptEnabled={true}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        injectedJavaScriptBeforeContentLoaded={INJECTED_JAVASCRIPT}
        javaScriptCanOpenWindowsAutomatically={true}
        webviewDebuggingEnabled
        // userAgent="Mozilla/5.0 (iPad; CPU OS 9_3_5 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G36 [FBAN/FBIOS;FBAV/238.0.0.50.115;FBBV/171859800;FBDV/iPad2,5;FBMD/iPad;FBSN/iPhone OS;FBSV/9.3.5;FBSS/1;FBID/tablet;FBLC/en_US;FBOP/5;FBRV/0;FBCR/]"
        onMessage={event => {
          try {
            const data = event.nativeEvent.data;
            if (data) {
              const parsed = JSON.parse(data);

              if (parsed.type === PostMessageType.NewWindow.toString()) {
                navigation.navigate('OtherPage', {
                  url: parsed.payload.startsWith('/')
                    ? WEBSITE_DOMAIN_URL + parsed.payload
                    : parsed.payload,
                });
              }

              //   if (parsed.type === "SyncLanguage") {
              //     dispatch(SettingActions.setLocale(parsed.payload));
              //   }

              //   if (parsed.type === "SyncCurrency") {
              //     dispatch(SettingActions.setCurrency(parsed.payload));
              //   }

              return;
            }
          } catch (e) {
            console.log('failed to handle onMessage', e);
          }
        }}
        onLoadEnd={syntheticEvent => {
          const { nativeEvent } = syntheticEvent;
          if (
            nativeEvent.url === WEBSITE_DOMAIN_URL + '/' ||
            nativeEvent.url.includes(maintenanceUri)
          ) {
          }
        }}
        onNavigationStateChange={e => {
          if (Platform.OS === 'ios') {
            navChange(e);
          }
        }}
        startInLoadingState={true}
        onLoadProgress={e => {
          if (Platform.OS === 'android' && e.nativeEvent.progress === 1) {
            navChange(e);
          }
        }}
        setSupportMultipleWindows={false}
        onShouldStartLoadWithRequest={e => {
          // about:blank, when h5 open window without url
          if (e.url === 'about:blank') return false;

          // Launcher page is dedicated to handle PG
          if (e.url.includes('launcher')) {
            navigation.navigate('OtherPage', { url: e.url });
            return false;
          }

          //   deposit checking
          const depositPage = depositURL.filter(i => e.url.includes(i));
          const errorPage = e.url.includes('error');
          //   share checking
          const checked = share.filter(i => {
            return e.url.includes(i);
          });
          const fb = e.url.includes('facebook');
          const whatsapp = e.url.includes('wa.me');
          const telegram = e.url.includes('t.me');
          const instagram = e.url.includes('instagram');
          const youtube = e.url.includes('youtube');
          const line = e.url.includes('line.me');
          const isShare =
            checked.length > 0 ||
            fb ||
            whatsapp ||
            telegram ||
            instagram ||
            youtube ||
            line;

          if (!isShare) {
            if (
              (e.url.startsWith(WEBSITE_DOMAIN_URL) &&
                depositPage.length <= 0 &&
                !errorPage) ||
              e.url === 'about:blank' ||
              e.url === 'about:srcdoc' ||
              e.url.startsWith('https://sc.detecas.com/') ||
              e.url.includes(maintenanceUri) ||
              e.url.startsWith('https://secure.livechatinc.com') ||
              e.url.startsWith('https://challenges.cloudflare.com')
            ) {
              return true;
            } else {
              navigation.navigate('OtherPage', { url: e.url });
              return false;
            }
          } else {
            if (checked.length > 0) {
              Linking.openURL(e.url);
              return false;
            } else {
              socialShare(e.url);
              return false;
            }
          }
        }}
        renderError={(errorDomain, errorCode, errorDesc) => {
          return (
            <Error
              errorCode={errorCode}
              errorDomain={errorDomain}
              errorDesc={errorDesc}
            />
          );
        }}
        onError={e => console.log(e)}
      />
      <View style={{ paddingTop: bottom, backgroundColor: '#141f33' }} />
    </View>
  );
};

export default HomePage;
