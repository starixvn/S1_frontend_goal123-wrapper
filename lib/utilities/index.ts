import { Currency, currencyListMapper } from './constant';
import { getScaledSize } from './rn-helper';
import Clipboard from '@react-native-clipboard/clipboard';

export const NAVIGATION_HEIGHT = getScaledSize(50);
export const HEADER_HEIGHT = NAVIGATION_HEIGHT;

// Constant for Axios in ms
export const REFRESH_INTERVAL = 5000;

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function copyToClipboard(
  message: string,
  onCopied?: (msg: string) => void,
) {
  Clipboard.setString(message);
  onCopied && onCopied(message);
  // SimpleToast.show(t('common.copied', { message }), SimpleToast.SHORT);
}

export async function fetchCopiedText(): Promise<string> {
  const text = await Clipboard.getString();
  return text;
}

export function toCurrency(
  amount: number,
  currency: Currency = Currency.VND,
  options?: {
    symbol?: boolean;
    noDecimal?: boolean;
    forceDecimal?: boolean;
    skipThousandTruncate?: boolean;
    hideTruncatedThousand?: boolean;
  },
): string {
  if (!amount) amount = 0.0;
  const thousandSeperator = ',';
  const decimalDeliminator = '.';
  const decimalLength = 3;
  const currencySymbol = (currency ? currencyListMapper[currency] : '') ?? '';
  let multiplier = '';

  options = options || {};
  const {
    symbol = currency != null,
    noDecimal = false,
    forceDecimal = true,
    skipThousandTruncate = false,
    hideTruncatedThousand = true,
  } = options;

  // contain multiplier
  if (isThousandCurrency(currency) && !skipThousandTruncate) {
    amount = toDisplayAmount(amount, currency);

    if (!hideTruncatedThousand) multiplier = " ('000)";
  }

  const parts = amount.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeperator);

  let joined = parts[0];

  if (!noDecimal) {
    const decimalExist = parts.length > 1;
    let decimals = decimalExist
      ? parts[1].toString().substring(0, decimalLength)
      : '';

    if (forceDecimal && decimals.length < decimalLength) {
      let decimalRepresentator = '1';
      decimalRepresentator = Math.pow(
        10,
        decimalLength - decimals.length,
      ).toString();

      decimals = decimalRepresentator.replace('1', decimals);
      joined = `${parts[0]}${decimalDeliminator}${decimals}`;
    } else {
      joined = decimalExist
        ? `${parts[0]}${decimalDeliminator}${decimals}`
        : parts[0];
    }
  }

  if (multiplier) {
    joined += multiplier;
  }
  return symbol ? `${currencySymbol} ${joined}` : joined;
}

export function humanFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0KB';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (
    ((bytes / 1024 ** i) * 1).toFixed(2) +
    ' ' +
    ['B', 'KB', 'MB', 'GB', 'TB'][i]
  );
}

const thousandCurrency = [Currency.IDR, Currency.VND];
export function isThousandCurrency(currency: Currency) {
  return thousandCurrency.includes(currency);
}

export function toDisplayAmount(real = 0, currency: Currency): number {
  if (isThousandCurrency(currency)) {
    real = real / 1000;
  }
  // return Math.floor(real);
  return real;
}

export function toRealAmount(display: number, currency: Currency) {
  if (isThousandCurrency(currency)) {
    display = display * 1000;
  }

  return Math.floor(display);
}

export function sumAmountSafe(a: number, b: number): number {
  return (a * 1000 + b * 1000) / 1000;
}

export function isFalsyValue(val: unknown): boolean {
  return val === undefined || val === null || val === '';
}
