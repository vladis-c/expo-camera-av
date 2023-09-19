import {useRef} from 'react';
import {StyleSheet} from 'react-native';
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
  const cameraProps = omit(props, ['children']) as CameraProps;
  const {children, audioSourceList} = props;

  const cameraRef = useRef<Camera>(null);
  const audioIsPrepared = useAudioState(!!audioSourceList);

  // if user wants to enable audio source select,
  // then we check for audio and do not render camera before Audio is setup
  if (audioSourceList && !audioIsPrepared) {
    return null;
  }

  return (
    <ExpoCamera style={styles.camera} ref={cameraRef} {...cameraProps}>
      {children}
    </ExpoCamera>
  );
};

export default CameraAV;
