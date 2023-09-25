import {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {Camera as ExpoCamera} from 'expo-camera';

import {useAudioState} from './Context';
import {omit} from './utils';

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CameraAV = (props: CameraAVProps) => {
  const {children, audioSourceList, onShowCameraInputs} = props;

  const cameraRef = useRef<Camera>(null);
  const {audioIsPrepared, audioInputs} = useAudioState(onShowCameraInputs);

  // if user wants to enable audio source select,
  // then we check for audio and do not render camera before Audio is setup
  if (audioSourceList && !audioIsPrepared && audioInputs.length === 0) {
    return null;
  }

  const cameraProps = omit(props, [
    'children',
    'onShowCameraInputs',
    'audioSourceList',
  ]) as CameraProps;

  return (
    <ExpoCamera style={styles.camera} ref={cameraRef} {...cameraProps}>
      {children}
    </ExpoCamera>
  );
};

export default CameraAV;
