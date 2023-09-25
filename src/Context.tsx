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
  const [audioInputs, setAudioInputs] = useState<Audio.RecordingInput[]>([]);

  const handleAudio = async () => {
    try {
      console.log('audio permitted', await handleAudioPermissions());
      if (await handleAudioPermissions()) {
        await Audio.setAudioModeAsync({
          playThroughEarpieceAndroid: true,
          staysActiveInBackground: true,
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        console.log('audio is prepared', true);
        setAudioIsPrepared(true);

        const audio = new Audio.Recording();
        const audioInputsRes = await audio.getAvailableInputs();
        console.log('audio inputs', audioInputsRes);
        if (audioInputsRes.length > 0) {
          setAudioInputs(audioInputs);
        }
        
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
    console.log(
      'audio to be prepared here, audioShouldPrepar',
      audioShouldPrepare,
    );

    if (audioShouldPrepare) {
      handleAudio();
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
    console.log('audioIsPrepared', audioIsPrepared, audioSourceList);
    // we must prepare audio globally only once
    if (!audioIsPrepared) {
      setAudioShouldPrepare(audioSourceList);
    }
  }, [audioSourceList, audioIsPrepared]);

  return audioIsPrepared;
};
