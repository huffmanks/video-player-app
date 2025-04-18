import { Stack } from "expo-router";

import HeaderItems from "@/components/header-items";

export default function ModalLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="playlists/watch/[id]"
        options={{
          headerShown: false,
          statusBarHidden: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="playlists/view/[id]"
        options={{
          title: "Playlist",
          headerShown: true,
          headerBackVisible: true,
          headerRight: () => <HeaderItems />,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="playlists/edit/[id]"
        options={{
          title: "Edit playlist",
          headerShown: true,
          headerBackVisible: true,
          headerRight: () => <HeaderItems />,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="playlists/create"
        options={{
          title: "Create playlist",
          headerShown: true,
          headerBackVisible: true,
          headerRight: () => <HeaderItems />,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="videos/watch/[id]"
        options={{
          headerShown: false,
          statusBarHidden: true,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="videos/edit/[id]"
        options={{
          title: "Edit video",
          headerShown: true,
          headerBackVisible: true,
          headerRight: () => <HeaderItems />,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="lock"
        options={{
          headerShown: false,
          statusBarHidden: true,
          animation: "fade",
        }}
      />
      <Stack.Screen
        name="passcode"
        options={{
          title: "Passcode",
          presentation: "modal",
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
