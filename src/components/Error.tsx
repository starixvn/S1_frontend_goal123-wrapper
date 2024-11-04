import React from 'react';
import { Text, View } from 'react-native';
import { WebViewProps } from 'react-native-webview';

type WebViewRenderErrorType = NonNullable<WebViewProps['renderError']>;
type WebViewError = Parameters<WebViewRenderErrorType>;

interface ErrorProps {
  errorDomain: WebViewError[0];
  errorCode: WebViewError[1];
  errorDesc: WebViewError[2];
}

const Error = (props: ErrorProps) => {
  const { errorCode, errorDesc } = props;

  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: '100%',
        width: '100%',
      }}>
      <Text style={{ textAlign: 'justify' }}>System Error</Text>

      <View
        style={{
          alignItems: 'center',
          marginTop: 20,
        }}>
        <Text>Error Code: {errorCode}</Text>
        <Text>Error Code: {errorDesc}</Text>
      </View>
    </View>
  );
};

export default Error;
