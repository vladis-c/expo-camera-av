import {createContext, useContext, useEffect, useState} from 'react';
import {Audio} from 'expo-av';

export type AudioContextProps = {
  audioIsPrepared: boolean;
  setAudioShouldPrepare: (v: boolean) => void;
  audioInputs: Audio.RecordingInput[];
};

export const AudioContext = createContext<AudioContextProps>(
  {} as AudioContextProps,
);

const AudioContextProvider = ({children}: {children: React.ReactNode}) => {
  const [audioIsPrepared, setAudioIsPrepared] = useState<boolean>(false);
  const [audioShouldPrepare, setAudioShouldPrepare] = useState<boolean>(false);
  const [audioInputs, setAudioInputs] = useState<Audio.RecordingInput[]>([]);

  const handleAudio = async () => {
    try {
      if (await handleAudioPermissions()) {
        await Audio.setAudioModeAsync({
          playThroughEarpieceAndroid: true,
          staysActiveInBackground: true,
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        setAudioIsPrepared(true);

        const audio = new Audio.Recording();
        const audioInputsRes = await audio.getAvailableInputs();
        setAudioInputs(audioInputsRes);
      }
    } catch (error) {
      throw new Error('handleAudio error ' + error);
    }
  };

  const handleAudioPermissions = async () => {
    try {
      const permission = await Audio.getPermissionsAsync();
      if (permission.granted) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error('handleAudioPermissions error ' + error);
    }
  };

  useEffect(() => {
    // only if audioShouldPrepare is true (if user set this prop as true to the camera component)
    // then start audio preparation
    if (!audioIsPrepared && audioShouldPrepare) {
      handleAudio();
    }
  }, [audioShouldPrepare, audioIsPrepared]);

  return (
    <AudioContext.Provider
      value={{audioIsPrepared, setAudioShouldPrepare, audioInputs}}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContextProvider;

export const useAudioState = (
  onShowCameraInputs?: (inputs: Audio.RecordingInput[]) => void,
) => {
  const {audioIsPrepared, setAudioShouldPrepare, audioInputs} = useContext(
    AudioContext,
  ) as AudioContextProps;

  useEffect(() => {
    // we must prepare audio globally only once
    if (!audioIsPrepared) {
      setAudioShouldPrepare(!!onShowCameraInputs);
    }
  }, [audioIsPrepared, onShowCameraInputs]);

  useEffect(() => {
    onShowCameraInputs?.(audioInputs);
  }, [audioInputs]);

  return {audioIsPrepared, audioInputs};
};
