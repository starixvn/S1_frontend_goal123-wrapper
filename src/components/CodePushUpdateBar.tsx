import useLocalization from '@hooks/useLocalization';
import ProgressBar from 'lib/components/ProgressBar';
import { IViewProps } from 'native-base/lib/typescript/components/basic/View/types';
import React from 'react';
import { Text, View } from 'react-native';

interface CodePushUpdateBar extends IViewProps {
  progress: number;
}

function CodePushUpdateBar<CodePushUpdateBar>({ progress = 0, ...rest }) {
  const percentage = Math.floor(progress * 100);

  const { t } = useLocalization();

  return (
    <View {...rest}>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: 12,
          marginBottom: 4,
        }}>{`${t('common.loading')} (${percentage}%)`}</Text>
      <View style={{ flexDirection: 'row' }}>
        <ProgressBar progress={progress} bgColor={'#c2c2c2'} color="#fab617" />
      </View>
    </View>
  );
}

export default CodePushUpdateBar;
