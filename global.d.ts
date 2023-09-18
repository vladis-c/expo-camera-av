import React from 'react';
import {
  type CameraProps as ExpoCameraProps,
  Camera as ExpoCamera,
} from 'expo-camera';

declare global {
  /** Expo Camera exported globally:
   * ```
   * class Camera extends ExpoCamera {}
   * ```
  */
  export class Camera extends ExpoCamera {}
  export type CameraProps = ExpoCameraProps;
  export type AppProps = CameraProps & {children: React.ReactNode};
}
