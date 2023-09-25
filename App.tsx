import {CameraType} from 'expo-camera';
import CameraAV from './src';
import AudioContextProvider from './src/Context';
import {useCameraPermissions} from './src/utils';

const App = () => {
  const permissions = useCameraPermissions({audioPermissions: true});

  if (!permissions) {
    return null;
  }

  return (
    <AudioContextProvider>
      <CameraAV audioSourceList={true} type={CameraType.front} />
    </AudioContextProvider>
  );
};

export default App;
