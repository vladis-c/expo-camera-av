import {useRef} from 'react';
import {StyleSheet} from 'react-native';

import {omit} from './src/utils';
import AudioContextProvider, {useAudioState} from './src/Context';

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const App = (props: AppProps) => {
  const cameraProps = omit(props, ['children']) as CameraProps;
  const children = props.children;

  const cameraRef = useRef<Camera>(null);
  const [audioIsPrepared, setAudioIsPrepared] = useAudioState();

  return (
    <AudioContextProvider>
      <Camera style={styles.camera} ref={cameraRef} {...cameraProps}>
        {children}
      </Camera>
    </AudioContextProvider>
  );
};

export default App;
