import { Translate } from '@hooks/useLocalization';
import { SplashScreenTask } from '@hooks/useSplashScreen';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface SplashScreenContext {
  dispatch: any;
  t: Translate;
  navigation: any;
  showAlert: any;
}

export interface SplashScreenHandler {
  result: boolean;
  handler?: () => void;
}

export function useSplashScreenTaskResolver<ParamType, ReturnType>(
  hook: (args: ParamType) => ReturnType,
  hookParams?: ParamType,
) {
  const hookValue = hook(hookParams);
  const [result, setResult] = useState<SplashScreenHandler>();

  const resolver = useRef<
    (value: SplashScreenHandler | PromiseLike<SplashScreenHandler>) => void
  >();

  const promise = useRef<Promise<SplashScreenHandler>>();

  useEffect(() => {
    promise.current = new Promise<SplashScreenHandler>(r => {
      resolver.current = r;
    });
  }, []);

  useEffect(() => {
    if (result && resolver.current) {
      resolver.current(result);
    }
  }, [result]);

  const promiseFactory = useCallback<SplashScreenTask>(
    () => async () => {
      return promise.current;
    },
    [],
  );

  return {
    hookValue,
    resolve: setResult,
    promise,
    promiseFactory,
  };
}
