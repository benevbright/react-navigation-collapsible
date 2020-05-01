/* global global */

import { Platform, StatusBar } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const SAFEBOUNCE_HEIGHT_IOS = 300;
const SAFEBOUNCE_HEIGHT_ANDROID = 100;

let safeBounceHeight = Platform.select({
  ios: SAFEBOUNCE_HEIGHT_IOS,
  android: SAFEBOUNCE_HEIGHT_ANDROID,
});
const setSafeBounceHeight = (height: number) => {
  safeBounceHeight = height;
};
const getSafeBounceHeight = () => safeBounceHeight;

const getDefaultHeaderHeight = (isLandscape: boolean) => {
  if (Platform.OS === 'ios') {
    if (isLandscape && !Platform.isPad) {
      return 32;
    } else {
      return 44;
    }
  } else if (Platform.OS === 'android') {
    return 56;
  }
  return 0;
};
const getStatusBarHeight = (isLandscape: boolean) => {
  if (Platform.OS === 'ios') {
    if (isLandscape) return 0;
    return isIphoneX() ? 44 : 20;
  } else if (Platform.OS === 'android') {
    // @ts-ignore
    return global.Expo ? StatusBar.currentHeight : 0;
  } else return 0;
};
const getNavigationHeight = (isLandscape: boolean, headerHeight: number) => {
  return headerHeight + getStatusBarHeight(isLandscape);
};
const getScrollIndicatorInsetTop = (
  isLandscape: boolean,
  headerHeight: number
) => {
  if (Platform.OS === 'ios') {
    if (isIphoneX()) return getStatusBarHeight(isLandscape);
    else return headerHeight;
  }
  return headerHeight + getStatusBarHeight(isLandscape);
};

export {
  setSafeBounceHeight,
  getSafeBounceHeight,
  getDefaultHeaderHeight,
  getNavigationHeight,
  getStatusBarHeight,
  getScrollIndicatorInsetTop,
};
