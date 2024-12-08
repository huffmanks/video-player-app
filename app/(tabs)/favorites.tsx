import { useCallback, useEffect, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";

import { FlashList } from "@shopify/flash-list";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

import { VideoMeta, videos } from "@/db/schema";
import { ESTIMATED_VIDEO_ITEM_HEIGHT } from "@/lib/constants";
import { SearchIcon } from "@/lib/icons";
import { useDatabaseStore } from "@/lib/store";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { H2 } from "@/components/ui/typography";
import VideoItem from "@/components/video-item";

export default function FavoritesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [keyIndex, setKeyIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<VideoMeta[]>([]);

  const flashListRef = useRef<FlashList<VideoMeta> | null>(null);
  const insets = useSafeAreaInsets();
  const db = useDatabaseStore.getState().db;

  const videoQuery = useLiveQuery(
    db.select().from(videos).where(eq(videos.isFavorite, true)).orderBy(videos.updatedAt)
  );
  const { data, error } = videoQuery;

  useEffect(() => {
    if (data) {
      const filtered = data.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, data]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setKeyIndex((prev) => prev + 1);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  const handleScrollEndDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const snapToIndex = Math.round(contentOffsetY / ESTIMATED_VIDEO_ITEM_HEIGHT);
    const newY = snapToIndex * ESTIMATED_VIDEO_ITEM_HEIGHT;

    flashListRef.current?.scrollToOffset({ offset: newY, animated: true });
  };

  const renderItem = useCallback(({ item }: { item: VideoMeta }) => {
    return (
      <View className="px-2">
        <VideoItem item={item} />
      </View>
    );
  }, []);

  if (error) {
    console.error("Error loading data.");
    toast.error("Error loading data.");
  }

  return (
    <>
      <View
        style={{ paddingTop: 16, paddingBottom: insets.bottom + 84 }}
        className="relative min-h-full">
        {!!data && data?.length > 0 && (
          <View className="mx-2 mb-8 flex-row items-center gap-4 rounded-md border border-input px-3">
            <SearchIcon
              className="text-muted-foreground"
              size={20}
              strokeWidth={1.25}
            />
            <Input
              className="border-0 px-0 placeholder:text-muted-foreground"
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search favorites"
            />
          </View>
        )}
        <FlashList
          data={searchQuery ? filteredData : data}
          key={`favorites_${keyIndex}`}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={onRefresh}
          estimatedItemSize={ESTIMATED_VIDEO_ITEM_HEIGHT}
          onScrollEndDrag={handleScrollEndDrag}
          ListEmptyComponent={<ListEmptyComponent hasData={!!data && data?.length > 0} />}
        />
      </View>
    </>
  );
}

function ListEmptyComponent({ hasData }: { hasData: boolean }) {
  return (
    <View className="p-5">
      <H2 className="mb-4 text-teal-500">{hasData ? "No results" : "No favorite videos yet!"}</H2>
      {!hasData && <Text className="mb-12">Your favorite videos will be displayed here.</Text>}
    </View>
  );
}
