import { memo } from "react";
import { Image, Pressable, Text } from "react-native";

import { ReorderableListItem, useReorderableDrag } from "react-native-reorderable-list";

import type { VideoMetaForPlaylist } from "@/components/playlist-sortable";
import PlaylistVideoDropdown from "@/components/playlist-video-dropdown";

interface PlaylistItemProps {
  item: VideoMetaForPlaylist;
  onRefresh: () => void;
}

function PlaylistItem({ item, onRefresh }: PlaylistItemProps) {
  const drag = useReorderableDrag();

  return (
    <ReorderableListItem className="mb-4 flex-row items-center justify-between gap-4 rounded-md bg-secondary pr-2">
      <Pressable
        className="flex flex-1 flex-row items-center gap-4"
        onLongPress={drag}>
        <Image
          className="my-2 ml-3 rounded-full"
          style={{ width: 45, height: 45 }}
          source={{ uri: item.thumbUri }}
        />
        <Text
          className="text-lg font-medium text-foreground"
          numberOfLines={1}>
          {item.title}
        </Text>
      </Pressable>
      <PlaylistVideoDropdown
        item={item}
        onRefresh={onRefresh}
      />
    </ReorderableListItem>
  );
}

export default memo(PlaylistItem);
