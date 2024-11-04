import { NotoSans, NotoSansBold } from './NotoSans';
import { NovaIcons } from './NovaIcon';
import { useFonts } from 'expo-font';
import React, { ReactNode, createContext } from 'react';

const FontContext = createContext<boolean>(false);

type Props = {
  children: ReactNode;
};
const FontProvider = ({ children }: Props) => {
  const [fontsLoaded] = useFonts({
    [NotoSans.name]: NotoSans.file,
    [NotoSansBold.name]: NotoSansBold.file,
    [NovaIcons.name]: NovaIcons.file,
  });

  return (
    <FontContext.Provider value={fontsLoaded}>
      {fontsLoaded ? children : null}
    </FontContext.Provider>
  );
};

export default FontProvider;
