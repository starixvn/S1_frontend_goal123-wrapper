import { getFontSize, getScaledSize } from '@utilities/rn-helper';
import { NotoSans, NotoSansBold } from 'lib/fonts/NotoSans';
import { extendTheme } from 'native-base';

export const BASE_STYLE = {
  fontSize: getFontSize(14),
  inputHeight: getScaledSize(40),
  containerPadding: {
    vertical: getScaledSize(16),
    top: getScaledSize(16),
    bottom: getScaledSize(16),
    horizontal: getScaledSize(8),
    left: getScaledSize(8),
    right: getScaledSize(8),
  },
  containerMargin: {
    vertical: getScaledSize(16),
    top: getScaledSize(16),
    bottom: getScaledSize(16),
    horizontal: getScaledSize(8),
    left: getScaledSize(8),
    right: getScaledSize(8),
  },
};

const sizeGenerator = () => {
  const sizeList = [
    0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20, 24, 32,
    40, 48, 56, 64, 72, 80, 88, 96,
  ];

  let sizeObj: { [index: string]: number } = { '0': 0 };
  sizeList.forEach((s: number) => {
    sizeObj[s.toString()] = getScaledSize(s * 4);
  });
  return sizeObj;
};

const sizes = sizeGenerator();

const customTheme = extendTheme({
  fontConfig: {
    [NotoSans.name]: {
      400: {
        normal: NotoSans.name,
      },
      700: {
        normal: NotoSansBold.name,
      },
    },
  },
  fonts: {
    [NotoSans.name]: NotoSans.name,
  },
  colors: {
    primary: {
      50: '#bfc9da',
      100: '#97bfe6',
      130: '#aeccff',
      150: '#adccff',
      170: '#62adff',
      200: '#75a3d9',
      300: '#4f85e4',
      350: '#1e85ec',
      370: '#007aff',
      400: '#64789b',
      450: '#4a5b80',
      470: '#455c83',
      500: '#4263a6',
      550: '#4e6ca8',
      600: '#284985',
      650: '#1d3662',
      700: '#052561',
      750: '#1f3258',
      800: '#1f2e4d',
      900: '#0e0d2f',
    },
    secondary: {
      200: '#ecf3fd',
      300: '#ffd34f',
      500: '#fab617',
      800: '#664b00',
    },
    error: {
      200: '#620a0f',
      400: '#d83b35',
      500: '#f43f5e',
      550: '#ea2329',
      600: '#ff0000',
    },
    info: {
      400: '#fab617',
      500: '#f5ac23',
      600: '#f58e23',
      650: '#ff7600',
      700: '#f77900',
    },
    grey: {
      50: '#e2e2e2',
      100: '#bfc0c3',
      200: '#b2b2b2',
      300: '#e8eaed',
      400: '#e7e7e7',
      500: '#6f7a8e',
      527: '#d5d5d5',
      565: '#909090',
      600: '#666666',
      650: '#858585',
      700: '#8d8d8d',
    },
    muted: {
      50: '#f2f4f7',
    },
    green: {
      300: '#259076',
    },
    dark: {
      100: '#272829',
      500: '#272727',
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: 'dark',
  },
  components: {
    Text: {
      baseStyle: {
        color: '#1f2e4d',
        fontFamily: NotoSans.name,
        fontSize: BASE_STYLE.fontSize,
      },
    },
    Button: {
      baseStyle: {
        color: 'white',
      },
      variants: {
        solid: ({ colorScheme, theme }) => {
          switch (colorScheme) {
            case 'primary': {
              return {
                bg: '#1e85ec',
                _text: {
                  color: 'white',
                },
              };
            }
            case 'secondary': {
              return {
                bg: theme.colors.secondary['500'],
                _text: {
                  color: 'white',
                },
                _pressed: {
                  bg: theme.colors.secondary['800'],
                },
              };
            }
            case 'darkBlue': {
              return {
                bg: theme.colors.primary['700'],
                _text: {
                  color: 'white',
                },
                _pressed: {
                  bg: theme.colors.primary['500'],
                },
              };
            }
            case 'white': {
              return {
                bg: '#ffffff',
                _text: {
                  color: 'white',
                },
                _pressed: {
                  bg: theme.colors.grey['100'],
                },
              };
            }
          }
        },
      },
      sizes: {
        md: {
          _text: {
            fontSize: BASE_STYLE.fontSize,
          },
        },
      },
    },
    Icon: {
      baseStyle: {},
      sizes: {
        md: 5,
      },
      defaultProps: {
        color: 'primary.400',
      },
    },
    IconButton: {
      baseStyle: {},
      defaultProps: {},
      variants: {
        unstyled: {
          borderRadius: 999,
        },
        solid: ({ colorScheme, theme }) => {
          if (colorScheme === 'secondary')
            return {
              bg: theme.colors.secondary['500'],
              _text: {
                color: 'white',
              },
              _pressed: {
                bg: '#664b00',
                _icon: {
                  color: 'white',
                },
              },
            };
        },
      },
      sizes: {},
    },
    ModalHeader: {
      baseStyle: {
        py: '3',
        pl: '3',
        pr: 12,
        backgroundColor: '#284985',
      },
    },
    ModalBody: {
      baseStyle: {
        _text: {
          color: '#052561',
        },
      },
    },
    ModalContent: {
      baseStyle: {
        backgroundColor: '#eaf1ff',
        rounded: 'sm',
      },
    },
    ModalFooter: {
      baseStyle: {
        backgroundColor: '#eaf1ff',
      },
    },
    ModalCloseButton: {
      baseStyle: {
        right: '3',
        top: '2',
      },
    },
    Badge: {
      baseStyle: {
        px: '1.5',
      },
      defaultProps: {},
      variants: {
        subtle: {
          bg: 'primary.350',
          borderRadius: 4,
        },
      },
      sizes: {},
    },
  },
  sizes,
  space: sizes,
});

// https://docs.nativebase.io/typescript
// 2. Get the type of the CustomTheme
type CustomThemeType = typeof customTheme;

// 3. Extend the internal NativeBase Theme
declare module 'native-base' {
  interface ICustomTheme extends CustomThemeType {}
}

export default customTheme;
