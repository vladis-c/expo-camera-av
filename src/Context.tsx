import {createContext, useContext, useEffect, useState} from 'react';
import {Audio} from 'expo-av';

export type AudioContextProps = {
  audioIsPrepared: boolean;
  setAudioIsPrepared: (state: boolean) => void;
};

export const AudioContext = createContext<AudioContextProps>(
  {} as AudioContextProps,
);

const AudioContextProvider = ({children}: {children: React.ReactNode}) => {
  const [audioIsPrepared, setAudioIsPrepared] = useState<boolean>(false);

  const handleAudio = async () => {
    try {
      if (!audioIsPrepared && (await handleAudioPermissions())) {
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
    handleAudio();
  }, []);

  return (
    <AudioContext.Provider value={{audioIsPrepared, setAudioIsPrepared}}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContextProvider;

export const useAudioState = () => {
  const {audioIsPrepared, setAudioIsPrepared} = useContext(
    AudioContext,
  ) as AudioContextProps;
  return [audioIsPrepared, setAudioIsPrepared] as const;
};
