import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AppState } from 'react-native';
import codePush, {
  DownloadProgress,
  LocalPackage,
  RemotePackage,
} from 'react-native-code-push';

type Props = {
  children: ReactNode;
};

type CodePushState = {
  progress?: number;
  status?: codePush.SyncStatus;
  localPackage?: LocalPackage;
  downloadedPackage?: LocalPackage;
  remotePackage?: RemotePackage;
  isCodePushSkipAble: boolean;
  isCodePushReady: boolean;
  downloadRemotePackage: (
    pckg: RemotePackage,
    mode?: codePush.InstallMode,
  ) => Promise<LocalPackage | undefined>;
};

export const CodePushContext = createContext<CodePushState>({
  downloadRemotePackage: () => Promise.resolve(undefined),
  isCodePushSkipAble: false,
  isCodePushReady: false,
});

export default function CodePushProvider({ children }: Props) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<codePush.SyncStatus>(
    codePush.SyncStatus.CHECKING_FOR_UPDATE,
  );
  const [remotePackage, setRemotePackage] = useState<RemotePackage>();
  const [localPackage, setLocalPackage] = useState<LocalPackage>();
  const [downloadedPackage, setDownloadedPackage] = useState<LocalPackage>();

  function onDownloadProgress({ totalBytes, receivedBytes }: DownloadProgress) {
    console.log('downloading', receivedBytes, '/ ', totalBytes);
    setProgress(receivedBytes / totalBytes);
  }

  async function downloadRemotePackage(
    pckg: RemotePackage,
    installMode?: codePush.InstallMode,
  ): Promise<LocalPackage | undefined> {
    try {
      const _installMode =
        installMode ??
        (pckg.isMandatory
          ? codePush.InstallMode.IMMEDIATE
          : codePush.InstallMode.ON_NEXT_RESTART);
      setStatus(codePush.SyncStatus.DOWNLOADING_PACKAGE);

      const downloaded = await pckg.download(onDownloadProgress);
      downloaded.install(_installMode);

      setDownloadedPackage(downloaded);
      if (_installMode === codePush.InstallMode.ON_NEXT_RESTART) {
        setStatus(codePush.SyncStatus.AWAITING_USER_ACTION);
      }

      return downloaded;
    } catch (e) {
      console.log('Code Push Download Interupted');
      setProgress(0);
      setStatus(codePush.SyncStatus.UNKNOWN_ERROR);
    }
  }

  async function retrieveCurrentPackage() {
    try {
      const pckg = await codePush.getUpdateMetadata();
      if (pckg) setLocalPackage(pckg);
    } catch (e) {
      console.log('retrieveCurrentPackage error', e);
    }
  }

  async function codePushChecking() {
    if (__DEV__) return setStatus(codePush.SyncStatus.UP_TO_DATE);
    try {
      const latestPackage = await codePush.checkForUpdate();
      console.log('Latest Package : ', latestPackage);
      if (latestPackage) {
        setRemotePackage(latestPackage);
        downloadRemotePackage(latestPackage);

        /* https://github.com/Microsoft/cordova-plugin-code-push/issues/48#issuecomment-167138400 */
        if (latestPackage.isMandatory) {
          return;
        }
      } else setStatus(codePush.SyncStatus.UP_TO_DATE);
    } catch (e) {
      console.log('codePushChecking error', e);
      setStatus(codePush.SyncStatus.UNKNOWN_ERROR);
    }
  }

  function init() {
    retrieveCurrentPackage();
    codePushChecking();
  }

  useEffect(() => {
    codePush.notifyAppReady();

    try {
      init();
    } catch (e) {
      console.log('codePushChecking error', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Handle retry when on download error */
  useEffect(() => {
    if (status === codePush.SyncStatus.UNKNOWN_ERROR) {
      if (remotePackage) {
        const retry = setTimeout(
          () => downloadRemotePackage(remotePackage),
          3000,
        );

        const subscription = AppState.addEventListener(
          'change',
          nextAppState => {
            if (nextAppState === 'active') {
              downloadRemotePackage(remotePackage);
              console.log('App has come to the foreground!');
            }
          },
        );

        /* This will execute each time status changed */
        return () => {
          console.log('clearing codepush subscription');
          subscription.remove();
          clearTimeout(retry);
        };
      } else {
        const retry = setTimeout(() => init(), 3000);

        return () => clearTimeout(retry);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, remotePackage]);

  // Prevent direct children to rerender whenver code push state updated
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const MemoizedChildren = useMemo(() => children, []);
  const isCodePushSkipAble = !!(remotePackage && !remotePackage.isMandatory);
  return (
    <CodePushContext.Provider
      value={{
        progress,
        status,
        localPackage,
        remotePackage,
        downloadedPackage,
        downloadRemotePackage,
        isCodePushSkipAble,
        isCodePushReady:
          status === codePush.SyncStatus.UP_TO_DATE || isCodePushSkipAble,
      }}>
      {MemoizedChildren}
    </CodePushContext.Provider>
  );
}

export function useCodePush() {
  return useContext(CodePushContext);
}
