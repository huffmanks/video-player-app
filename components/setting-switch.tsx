import { useEffect, useState } from "react";
import { View } from "react-native";

import { useShallow } from "zustand/react/shallow";

import { useSecurityStore, useSettingsStore } from "@/lib/store";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type SettingId = "autoplay" | "enablePasscode" | "fullscreen" | "loop" | "mute";

interface SettingSwitchProps {
  id: SettingId;
  defaultChecked?: boolean;
  label: string;
}

export default function SettingSwitch({ id, defaultChecked = false, label }: SettingSwitchProps) {
  const { autoPlay, fullscreen, loop, mute, setAutoPlay, setFullscreen, setLoop, setMute } =
    useSettingsStore(
      useShallow((state) => ({
        autoPlay: state.autoPlay,
        fullscreen: state.fullscreen,
        loop: state.loop,
        mute: state.mute,
        setAutoPlay: state.setAutoPlay,
        setFullscreen: state.setFullscreen,
        setLoop: state.setLoop,
        setMute: state.setMute,
      }))
    );

  const { enablePasscode, setEnablePasscode } = useSecurityStore(
    useShallow((state) => ({
      enablePasscode: state.enablePasscode,
      setEnablePasscode: state.setEnablePasscode,
    }))
  );

  const settingsMap = {
    autoplay: autoPlay,
    enablePasscode: enablePasscode,
    fullscreen: fullscreen,
    loop: loop,
    mute: mute,
  } as const;

  const settersMap = {
    autoplay: setAutoPlay,
    enablePasscode: setEnablePasscode,
    fullscreen: setFullscreen,
    loop: setLoop,
    mute: setMute,
  } as const;

  const [checked, setChecked] = useState(
    settingsMap[id as keyof typeof settingsMap] ?? defaultChecked
  );

  useEffect(() => {
    const setter = settersMap[id as keyof typeof settersMap];
    setter(checked);
  }, [checked, id]);

  return (
    <View className="flex-row items-center gap-6">
      <Switch
        checked={checked}
        onCheckedChange={setChecked}
        nativeID={id}
      />
      <Label
        nativeID={id}
        onPress={() => setChecked((prev) => !prev)}>
        {label}
      </Label>
    </View>
  );
}
