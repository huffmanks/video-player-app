import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { toast } from "sonner-native";

import { usePlaylistStore } from "@/lib/store";

import EditPlaylistForm from "@/components/forms/edit-playlist";

export interface EditPlaylistInfo {
  id: string;
  title: string;
  description: string;
  videos: {
    videoId: string;
    title: string;
    isSelected: boolean;
  }[];
}

export default function EditPlaylistScreen() {
  const [editPlaylistInfo, setEditPlaylistInfo] = useState<EditPlaylistInfo | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();
  const getPlaylistWithAllVideos = usePlaylistStore((state) => state.getPlaylistWithAllVideos);

  useEffect(() => {
    const fetchPlaylist = async () => {
      const data = await getPlaylistWithAllVideos(id);
      setEditPlaylistInfo(data);
    };

    fetchPlaylist().catch((error) => {
      console.error("Failed to find playlist: ", error);
      toast.error("Failed to find playlist.");
    });
  }, []);

  if (!editPlaylistInfo) return null;

  return (
    <View>
      <EditPlaylistForm editPlaylistInfo={editPlaylistInfo} />
    </View>
  );
}
