import { Tabs } from "expo-router";

import { useClientOnlyValue } from "@/hooks/useClientOnlyValue";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CloudUploadIcon, ListMusicIcon, StarIcon, VideoIcon } from "@/lib/icons";

import HeaderItems from "@/components/header-items";

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#14b8a6",
        tabBarInactiveTintColor: colorScheme === "light" ? "#09090b" : "#fff",
        headerShown: useClientOnlyValue(false, true),
        headerRight: () => <HeaderItems />,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Videos",
          tabBarIcon: ({ color }) => (
            <VideoIcon
              color={color}
              size={28}
              strokeWidth={1.25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color }) => (
            <CloudUploadIcon
              color={color}
              size={28}
              strokeWidth={1.25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <StarIcon
              color={color}
              size={28}
              strokeWidth={1.25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="playlists"
        options={{
          title: "Playlists",
          tabBarIcon: ({ color }) => (
            <ListMusicIcon
              color={color}
              size={28}
              strokeWidth={1.25}
            />
          ),
        }}
      />
    </Tabs>
  );
}
