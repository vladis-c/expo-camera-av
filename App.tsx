import AudioContextProvider from './src/Context';
import CameraAV from './src';
import {useCameraPermissions} from './src/utils';

const App = () => {
  const permissions = useCameraPermissions();

  if (!permissions) {
    return null;
  }

  return (
    <AudioContextProvider>
      <CameraAV audioSourceList={false} />
    </AudioContextProvider>
  );
};

export default App;
