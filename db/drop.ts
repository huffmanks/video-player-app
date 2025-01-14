import * as FileSystem from "expo-file-system";

import { playlists, videos } from "@/db/schema";
import { useDatabaseStore } from "@/lib/store";

export async function resetTables() {
  try {
    const db = useDatabaseStore.getState().db;

    await db.delete(videos).returning();
    await db.delete(playlists).returning();

    return { message: "Videos deleted from the database successfully.", type: "success" };
  } catch (error) {
    console.error("Failed to delete db tables.\n", error);
    return { message: "Failed to delete videos from the database.", type: "error" };
  }
}

export async function clearDirectory(directoryUri: string) {
  try {
    const files = await FileSystem.readDirectoryAsync(directoryUri);
    for (const file of files) {
      const fileUri = `${directoryUri}/${file}`;
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }
    return { message: "Directory files deleted successfully.", type: "success" };
  } catch (error) {
    console.error(`Failed to delete directory files from: ${directoryUri}\n`, error);
    return { message: "Failed to delete directory files.", type: "error" };
  }
}
