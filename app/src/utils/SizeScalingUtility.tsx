import {
  scale as smScale,
  verticalScale as smVerticalScale,
  moderateScale as smModerateScale,
} from 'react-native-size-matters';
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const MIN_FACTOR = 0.85;   
const MAX_FACTOR = 1.35;  
const guard = (val: number, base: number) => {
  const factor = val / base;
  const clampedFactor = Math.min(Math.max(factor, MIN_FACTOR), MAX_FACTOR);
  return base * clampedFactor;
};

export const horizontalScale = (size: number) => {
  const scaled = smScale(size);
  return guard(scaled, size);
};

export const verticalScale = (size: number) => {
  const scaled = smVerticalScale(size);
  return guard(scaled, size);
};

export const textScale = (size: number, factor: number = 0.5) => {
  const scaled = smModerateScale(size, factor);
  return guard(scaled, size);
};

export const ms = (size: number, factor: number = 0.5) => smModerateScale(size, factor);

export const hairline = Math.max(1, PixelRatio.roundToNearestPixel(1));

export const HIT_SLOP_8 = { top: 8, right: 8, bottom: 8, left: 8 };

export const SCREEN = { w: SCREEN_W, h: SCREEN_H };