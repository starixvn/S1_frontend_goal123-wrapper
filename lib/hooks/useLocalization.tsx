import vi from '../../src/assets/locales/vn.json';
import { tolgee } from '@integrations/tolgee';
import { localizationApi } from '@services/localizationApi';
import {
  CombinedOptions,
  DefaultParamType,
  TolgeeProvider,
  TolgeeStaticData,
  TranslationKey,
  TreeTranslationsData,
  useTranslate,
} from '@tolgee/react';
import { sleep } from '@utilities';
import { LANGUAGE_CODE } from '@utilities/constant';
import { Scope, TranslateOptions } from 'i18n-js';
import React, { ReactNode, useCallback } from 'react';
import store, { useAppSelector } from 'store';

export type Translate = (scope: Scope, options?: TranslateOptions) => string;

interface LocalizationProviderProps {
  children: ReactNode;
  locale: LANGUAGE_CODE;
  i18n: {
    translate: Translate;
  };
}

export function getLanguageFetcher(
  locale: LANGUAGE_CODE,
  fallbackTranslation: TreeTranslationsData,
) {
  return async () => {
    // This is to ensure redux provider run 1 frame first before executing api
    await sleep(0);
    try {
      const resp = await store
        .dispatch(
          localizationApi.endpoints.translations.initiate({
            locale,
          }),
        )
        .unwrap();

      return resp[locale];
    } catch (e) {
      console.log('Failed to get language', e);
      return fallbackTranslation;
    }
  };
}

function useTolgeeTranslate() {
  const { t: tolgeeT, isLoading } = useTranslate();

  const t = useCallback(
    (key: TranslationKey, placeholders?: CombinedOptions<DefaultParamType>) => {
      return tolgeeT(
        key,
        isLoading ? ' ' : key, // render empty string if no translation available / while being downloaded
        placeholders,
      );
    },
    [isLoading, tolgeeT],
  );

  return { t };
}

export function prepareTolgeeStaticDataByNamespace(
  fallbackTranslation: TreeTranslationsData,
): TolgeeStaticData {
  const staticData: Record<
    LANGUAGE_CODE,
    ReturnType<typeof getLanguageFetcher>
  > = {};

  Object.values(LANGUAGE_CODE).forEach(locale => {
    staticData[`${locale}`] = getLanguageFetcher(locale, fallbackTranslation);
  });

  return staticData;
}

tolgee.addStaticData(prepareTolgeeStaticDataByNamespace(vi));

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({
  children,
}) => {
  return <TolgeeProvider tolgee={tolgee}>{children}</TolgeeProvider>;
};

export default function useLocalization() {
  return useTolgeeTranslate();
}

export const LocalizationProviderRedux = ({ children }: { children: any }) => {
  const locale = useAppSelector(s => s.setting.setting.locale);
  if (!tolgee.isRunning()) {
    tolgee.changeLanguage(locale); // load initial language
  }

  return (
    <TolgeeProvider
      tolgee={tolgee}
      options={{
        useSuspense: false, // prevents render blocking before tolgee done downloading translation
      }}>
      {children}
    </TolgeeProvider>
  );
};
