import {Camera as ExpoCamera} from 'expo-camera';
import {useEffect, useState} from 'react';

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

export const useCameraPermissions = () => {
  const [permissions, setPermissions] = useState<boolean>(false);

  const handlePermissions = async () => {
    try {
      const perm1 = await ExpoCamera.requestCameraPermissionsAsync();
      const perm2 = await ExpoCamera.requestMicrophonePermissionsAsync();
      if (perm1 && perm2) {
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
