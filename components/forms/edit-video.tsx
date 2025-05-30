import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";
import { useRef, useState } from "react";
import { View } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { useScrollToTop } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";
import * as z from "zod";
import { useShallow } from "zustand/react/shallow";

import { VideoMeta } from "@/db/schema";
import { BOTTOM_TABS_OFFSET, VIDEOS_DIR, orientationOptions } from "@/lib/constants";
import { SaveIcon, TrashIcon } from "@/lib/icons";
import { useVideoStore } from "@/lib/store";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormDateTimePicker,
  FormField,
  FormInput,
  FormSelect,
  FormSwitch,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import VideoThumbPicker from "@/components/video-thumb-picker";

const formSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .transform((val) => val.trim()),
  createdAt: z.date(),
  orientation: z.object(
    { value: z.string(), label: z.string() },
    {
      invalid_type_error: "Please select a favorite email.",
    }
  ),
  isFavorite: z.boolean(),
});

export type EditVideoSchema = z.infer<typeof formSchema>;

interface EditFormProps {
  videoInfo: VideoMeta;
}

export default function EditVideoForm({ videoInfo }: EditFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectTriggerWidth, setSelectTriggerWidth] = useState(0);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);

  const { updateVideo, deleteVideo } = useVideoStore(
    useShallow((state) => ({
      updateVideo: state.updateVideo,
      deleteVideo: state.deleteVideo,
    }))
  );

  const insets = useSafeAreaInsets();
  const ref = useRef(null);
  useScrollToTop(ref);

  const contentInsets = {
    top: insets.top + BOTTOM_TABS_OFFSET,
    bottom: insets.bottom + BOTTOM_TABS_OFFSET,
    left: 12,
    right: 12,
  };

  const form = useForm<EditVideoSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: videoInfo.title ?? "",
      createdAt: new Date(videoInfo.createdAt) ?? new Date(),
      orientation: {
        label: videoInfo.orientation ?? "",
        value: videoInfo.orientation ?? "",
      },
      isFavorite: videoInfo.isFavorite ?? false,
    },
  });

  async function handleDelete() {
    try {
      const { message, status } = await deleteVideo(videoInfo.id);

      if (status === "success") {
        toast.error(message);
        router.dismissTo("/(tabs)/videos");
      }
    } catch (error) {
      toast.error("Failed to delete video.");
    }
  }

  async function onSubmit(values: EditVideoSchema) {
    try {
      setIsSubmitting(true);
      const parsedValues = formSchema.parse(values);

      const thumbTimestamp = Math.trunc(playerCurrentTime * 100000) / 100;

      const { uri } = await VideoThumbnails.getThumbnailAsync(videoInfo.videoUri, {
        time: thumbTimestamp,
      });

      const fileId = createId();
      const newUri = `${VIDEOS_DIR}${videoInfo.title}-${fileId}.jpg`;

      await FileSystem.moveAsync({ from: uri, to: newUri });
      await FileSystem.deleteAsync(videoInfo.thumbUri, { idempotent: true });

      await updateVideo({
        id: videoInfo.id,
        values: {
          ...parsedValues,
          thumbUri: newUri,
          thumbTimestamp,
          orientation: values.orientation.value,
          createdAt: values.createdAt.toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      toast.success(`${values.title} updated successfully.`);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(tabs)/videos");
      }
    } catch (error) {
      toast.error(`Error updating ${values.title}!`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <View className="mb-2">
        <Label className="native:text-lg mb-2">Thumbnail</Label>
        <VideoThumbPicker
          videoInfo={videoInfo}
          setPlayerCurrentTime={setPlayerCurrentTime}
        />
      </View>
      <View className="flex-1 gap-7">
        <View className="mb-12 flex-1 gap-7">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormInput
                label="Title"
                autoFocus={false}
                selectTextOnFocus={true}
                placeholder="Add a video title..."
                autoCapitalize="none"
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="createdAt"
            render={({ field }) => (
              <FormDateTimePicker
                label="Created at"
                description="YYYY-MM-DD"
                {...field}
              />
            )}
          />
          <FormField
            control={form.control}
            name="orientation"
            render={({ field }) => (
              <FormSelect
                label="Orientation"
                {...field}>
                <SelectTrigger
                  onLayout={(ev) => {
                    setSelectTriggerWidth(ev.nativeEvent.layout.width);
                  }}>
                  <SelectValue
                    className="native:text-lg text-sm text-foreground"
                    placeholder="Select an orientation"
                  />
                </SelectTrigger>
                <SelectContent
                  insets={contentInsets}
                  style={{ width: selectTriggerWidth }}>
                  <SelectGroup>
                    {orientationOptions.map((orientation) => (
                      <SelectItem
                        key={orientation.value}
                        label={orientation.label}
                        value={orientation.value}>
                        <Text>{orientation.label}</Text>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </FormSelect>
            )}
          />
          <FormField
            control={form.control}
            name="isFavorite"
            render={({ field }) => (
              <FormSwitch
                label="Add to favorites?"
                {...field}
              />
            )}
          />
        </View>

        <View className="flex-row items-center gap-4">
          <View className="flex-1">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={isSubmitting}
                  variant="secondary"
                  className="flex w-full flex-row items-center justify-center gap-4">
                  <TrashIcon
                    className="text-foreground"
                    size={24}
                    strokeWidth={1.5}
                  />
                  <Text className="native:text-base font-semibold uppercase tracking-wider">
                    Delete
                  </Text>
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <Text>This will delete the </Text>
                    <Text className="font-semibold">“{videoInfo.title}”</Text>
                    <Text> video permanently.</Text>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    <Text>Cancel</Text>
                  </AlertDialogCancel>
                  <AlertDialogAction onPress={handleDelete}>
                    <Text>Delete</Text>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </View>

          <View className="flex-1">
            <Button
              disabled={isSubmitting}
              className="flex w-full flex-row items-center justify-center gap-4 bg-brand"
              onPress={form.handleSubmit(onSubmit)}>
              <SaveIcon
                className="text-white"
                size={24}
                strokeWidth={1.5}
              />
              <Text className="native:text-base font-semibold uppercase tracking-wider text-white">
                Save
              </Text>
            </Button>
          </View>
        </View>
      </View>
    </Form>
  );
}
