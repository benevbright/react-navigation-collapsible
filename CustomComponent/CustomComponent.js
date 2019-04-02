import React from 'react';

import {
  Animated,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { withOrientation, SafeAreaView } from 'react-navigation';
import { HeaderStyleInterpolator } from '../../node_modules/react-navigation-stack';

const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : 0;

const getAppBarHeight = (isLandscape) => {
  let res;
  if (Platform.OS === 'ios') {
    if (isLandscape && !Platform.isPad) {
      res = 32;
    } else {
      res = 44;
    }
  } else {
    res = 56;
  }
  return res;
};


const platformContainerStyles = Platform.select({
  android: {
    elevation: 4,
  },
  ios: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#A7A7AA',
  },
  default: {},
});

const DEFAULT_BACKGROUND_COLOR = '#FFF';

const styles = StyleSheet.create({
  container: {
    backgroundColor: DEFAULT_BACKGROUND_COLOR,
    ...platformContainerStyles,
  },
  flexOne: {
    flex: 1,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  left: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  right: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  // eslint-disable-next-line react-native/no-unused-styles
  title: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
  },
  transparentContainer: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    ...platformContainerStyles,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    elevation: 0,
  },
});

class Header extends React.PureComponent {
  static get HEIGHT() {
    return APPBAR_HEIGHT + STATUSBAR_HEIGHT;
  }

  static defaultProps = {
    layoutInterpolator: HeaderStyleInterpolator.forLayout,
  };

  render() {
    const {
      scene, isLandscape, layoutInterpolator, children,
    } = this.props;
    const { options } = scene.descriptor;
    const { headerStyle = {} } = options;
    const headerStyleObj = StyleSheet.flatten(headerStyle);
    const appBarHeight = getAppBarHeight(isLandscape);
    const {
      ...safeHeaderStyle
    } = headerStyleObj;
    // TODO: warn if any unsafe styles are provided
    const containerStyles = [
      options.headerTransparent
        ? styles.transparentContainer
        : styles.container,
      { height: appBarHeight },
      safeHeaderStyle,
    ];

    const { headerForceInset } = options;
    const forceInset = headerForceInset || {
      top: 'always',
      bottom: 'never',
      horizontal: 'always',
    };

    return (
      <Animated.View
        style={[
          layoutInterpolator(this.props),
          Platform.OS === 'ios' && !options.headerTransparent
            ? {
              backgroundColor:
                safeHeaderStyle.backgroundColor || DEFAULT_BACKGROUND_COLOR,
            }
            : null,
        ]}
      >
        <SafeAreaView forceInset={forceInset} style={containerStyles}>
          <View style={styles.flexOne}>{children}</View>
        </SafeAreaView>
      </Animated.View>
    );
  }
}


export default withOrientation(Header);
