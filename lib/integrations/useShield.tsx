import { SHIELD_KEY, SHIELD_SITE_ID } from '@env';
import { SettingActions, ShieldDeviceResult } from '@modules/setting';
import { useShieldRiskCheckMutation } from '@services/shield';
import { useEffect } from 'react';
import { Platform } from 'react-native';
// import Shield from 'react-native-shield';
import { useDispatch } from 'react-redux';
import { useAppSelector } from 'store';

export default function useShieldFraudDetection() {
  const [submitShieldResult] = useShieldRiskCheckMutation();

  const token = useAppSelector(state => state.user.token);
  const shield = useAppSelector(state => state.setting.setting.shield);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   Shield.initShield(
  //     SHIELD_SITE_ID,
  //     SHIELD_KEY,
  //     (r: ShieldDeviceResult | string) => {
  //       console.log('SHIELD SUCCESS', r);
  //       let result: ShieldDeviceResult =
  //         Platform.OS === 'android' && typeof r === 'string'
  //           ? JSON.parse(r)
  //           : r;

  //       dispatch(SettingActions.setShieldDeviceResult(result));
  //     },
  //     e => {
  //       console.log('SHEILD ERROR', e);
  //     },
  //   );
  // }, []);

  useEffect(() => {
    if (token && shield) submitShieldResult(shield);
  }, [token, shield, submitShieldResult]);

  return;
}
