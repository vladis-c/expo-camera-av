import {useEffect, useState} from 'react';
import {Audio} from 'expo-av';
import {Camera as ExpoCamera} from 'expo-camera';

export const omit = <T extends object, K extends keyof T>(
  obj: T,
  props: K[],
  extraProps?: K[],
): Pick<T, Exclude<keyof T, K>> => {
  const result = {...obj};
  const finalProps = extraProps ? props.concat(extraProps) : props;
  finalProps.forEach(prop => {
    delete result[prop];
  });
  return result;
};

type CameraAVPermissions = {
  cameraPermissions?: boolean;
  microphonePermissions?: boolean;
  audioPermissions?: boolean;
};
/** props:
 * ```
 * cameraPermissions?: boolean; // default: true
 * microphonePermissions?: boolean // default: true
 * audioPermissions?: boolean; // default: false
 * ```
 */
export const useCameraPermissions = (props?: CameraAVPermissions): boolean => {
  const {
    audioPermissions = false,
    cameraPermissions = true,
    microphonePermissions = true,
  } = props as CameraAVPermissions;

  const [permissions, setPermissions] = useState<CameraAVPermissions>({});

  const handlePermissions = async () => {
    try {
      const cameraPermission = (
        await ExpoCamera.requestCameraPermissionsAsync()
      ).granted;
      const micPermission = (
        await ExpoCamera.requestMicrophonePermissionsAsync()
      ).granted;
      const audioPermission = (await Audio.requestPermissionsAsync()).granted;

      setPermissions({
        microphonePermissions: microphonePermissions && micPermission,
        cameraPermissions: cameraPermissions && cameraPermission,
        audioPermissions: audioPermissions && audioPermission,
      });
      
    } catch (error) {
      throw new Error('handlePermissions ' + error);
    }
  };

  useEffect(() => {
    handlePermissions();
  }, []);

  return Object.values(permissions).every(Boolean);
};
