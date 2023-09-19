import {createContext, useContext, useEffect, useState} from 'react';
import {Audio} from 'expo-av';

export type AudioContextProps = {
  audioIsPrepared: boolean;
  setAudioShouldPrepare: (v: boolean) => void;
};

export const AudioContext = createContext<AudioContextProps>(
  {} as AudioContextProps,
);

const AudioContextProvider = ({children}: {children: React.ReactNode}) => {
  const [audioIsPrepared, setAudioIsPrepared] = useState<boolean>(false);
  const [audioShouldPrepare, setAudioShouldPrepare] = useState<boolean>(false);

  const handleAudio = async () => {
    try {
      if (await handleAudioPermissions()) {
        await Audio.setAudioModeAsync({
          //only Android setup
          playThroughEarpieceAndroid: true,
          staysActiveInBackground: true,
        });
        setAudioIsPrepared(true);
      }
    } catch (error) {
      throw new Error('handleAudio error ' + error);
    }
  };

  const handleAudioPermissions = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
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
    if (audioShouldPrepare) {
      // handleAudio();
      console.log('audio to be prepared here');
    }
  }, [audioShouldPrepare]);

  return (
    <AudioContext.Provider value={{audioIsPrepared, setAudioShouldPrepare}}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContextProvider;

export const useAudioState = (audioSourceList: boolean) => {
  const {audioIsPrepared, setAudioShouldPrepare} = useContext(
    AudioContext,
  ) as AudioContextProps;

  useEffect(() => {
    // we must prepare audio globally only once
    if (!audioIsPrepared) {
      setAudioShouldPrepare(audioSourceList);
    }
  }, [audioSourceList]);

  return audioIsPrepared;
};
