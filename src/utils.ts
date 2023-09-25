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

type CameraPermissionsHookProps = {
  audioPermissions: boolean;
};

export const useCameraPermissions = (
  props?: CameraPermissionsHookProps,
): boolean => {
  const [permissions, setPermissions] = useState<boolean>(false);

  const handlePermissions = async () => {
    try {
      const cameraPermission = await ExpoCamera.requestCameraPermissionsAsync();
      const micPermission =
        await ExpoCamera.requestMicrophonePermissionsAsync();
      let audioPermission = true;
      if (props?.audioPermissions) {
        const result = await Audio.requestPermissionsAsync();
        audioPermission = result.granted;
      }
      if (cameraPermission && micPermission && audioPermission) {
        setPermissions(true);
      }
    } catch (error) {
      throw new Error('handlePermissions ' + error);
    }
  };

  useEffect(() => {
    handlePermissions();
  }, []);

  return permissions;
};
