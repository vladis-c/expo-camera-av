import {createContext, useContext, useEffect, useState} from 'react';
import {Audio, InterruptionModeIOS} from 'expo-av';
import {Platform} from 'react-native';

export type AudioContextProps = {
  audioIsPrepared: boolean;
  setAudioShouldPrepare: (v: boolean) => void;
  audioInputs: Audio.RecordingInput[];
  selectedAudioInput: Audio.RecordingInput | undefined;
  setSelectedAudioInput: React.Dispatch<
    React.SetStateAction<Audio.RecordingInput | undefined>
  >;
};

export const AudioContext = createContext<AudioContextProps>(
  {} as AudioContextProps,
);

const AudioContextProvider = ({children}: {children: React.ReactNode}) => {
  const audio = new Audio.Recording();

  const [audioIsPrepared, setAudioIsPrepared] = useState<boolean>(false);
  const [audioShouldPrepare, setAudioShouldPrepare] = useState<boolean>(false);
  const [audioInputs, setAudioInputs] = useState<Audio.RecordingInput[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] =
    useState<Audio.RecordingInput>();

  const handleSetAudioInput = async () => {
    try {
      // prepare the audio track. Does not work on IOS
      if (Platform.OS === 'android') {
        await audio.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
        );
      }
      // set the selected audio input
      console.log('setting selected input to', selectedAudioInput);
      if (selectedAudioInput) {
        await audio.setInput(selectedAudioInput.uid);
      }
    } catch (error) {
      console.error('handleInputs error', error);
    }
  };

  useEffect(() => {
    console.log('selected is', selectedAudioInput);
    if (audioIsPrepared) {
      handleSetAudioInput();
    }
  }, [selectedAudioInput, audioIsPrepared]);

  const handleAudio = async () => {
    try {
      if (await handleGetAudioPermissions()) {
        await Audio.setAudioModeAsync({
          playThroughEarpieceAndroid: true,
          staysActiveInBackground: true,
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        setAudioIsPrepared(true);

        const audioInputsRes = await audio.getAvailableInputs();
        setAudioInputs(audioInputsRes);
        //hardcoded first
        setSelectedAudioInput(audioInputsRes[0]);
      }
    } catch (error) {
      throw new Error('handleAudio error ' + error);
    }
  };

  const handleGetAudioPermissions = async () => {
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
      value={{
        audioIsPrepared,
        setAudioShouldPrepare,
        audioInputs,
        selectedAudioInput,
        setSelectedAudioInput,
      }}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContextProvider;

export const useAudioState = (
  onShowAudioInputs?: (inputs: Audio.RecordingInput[]) => void,
) => {
  const {
    audioIsPrepared,
    setAudioShouldPrepare,
    audioInputs,
    selectedAudioInput,
  } = useContext(AudioContext) as AudioContextProps;

  useEffect(() => {
    // we must prepare audio globally only once
    if (!audioIsPrepared) {
      setAudioShouldPrepare(!!onShowAudioInputs);
    }
  }, [audioIsPrepared, onShowAudioInputs]);

  useEffect(() => {
    onShowAudioInputs?.(audioInputs);
  }, [audioInputs]);

  return {
    audioIsPrepared,
    audioInputs,
    selectedAudioInput,
  };
};
