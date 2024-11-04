import { BANNER_DOMAIN } from '@env';

export const currencyListMapper: { [key: number]: string } = {
  2: 'MYR',
  4: 'THB',
  13: 'RMB',
  15: 'IDR',
  51: 'VND',
};

export enum Currency {
  MYR = 2,
  THB = 4,
  RMB = 13,
  IDR = 15,
  VND = 51,
  CRYPTO = 96,
}

export enum LANGUAGE_CODE {
  ENGLISH = 'en',
  VIETNAM = 'vn',
}

// Promotion
export const STATUS_RUNNING = 1;
export const STATUS_CANCELLED = 2;
export const STATUS_FULFILLED = 4;
export const STATUS_TRANSFER_OUT = 5;

// Event ID
export const EventID = {
  luckySpin: 10,
  cnyAngPao: 13,
  dragonEgg: 16,
} as const;

// Maintenance
export const maintenanceGameTypeMapping = {
  All: 0,
} as const;

export const IMAGE_DOMAIN = `${BANNER_DOMAIN}/h5/img` as const;
export const IMAGE_DOMAIN_v4 = `${IMAGE_DOMAIN}/4.0` as const;
