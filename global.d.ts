import React from 'react';
import {
  type CameraProps as ExpoCameraProps,
  Camera as ExpoCamera,
} from 'expo-camera';
import {Audio} from 'expo-av';

declare global {
  /** Expo Camera exported globally:
   * ```
   * class Camera extends ExpoCamera {}
   * ```
   */
  export class Camera extends ExpoCamera {}
  export type CameraProps = ExpoCameraProps;
  export type CameraAVProps = CameraProps & {
    children?: React.ReactNode;
    audioSourceList?: boolean;
    onShowAudioInputs?: (inputs: Audio.RecordingInput[]) => void;
  };
}
