import { IButtonProps } from 'native-base';

type RemoveUnderscoreProps<T> = {
  [key in keyof T as key extends `_${string}` ? undefined : key]: T[key];
};

/**
 * Those props start with `_`, `style`, `accessibilityActions` in `native-base` package
 * cause `alert.slice.ts` Typescript to be infinite loop (due to Recursive Type) and hence
 * make Typescript intellisense to be very slow.
 */
type TextPropWithoutRecursiveType = Omit<
  RemoveUnderscoreProps<IButtonProps>,
  'style' | 'accessibilityActions'
>;

export interface ModalAction {
  label: string;
  onPress?: () => void;
  disableAutoClose?: boolean;
  disabled?: boolean;
  loading?: boolean;
  props?: TextPropWithoutRecursiveType;
}
