# TODOS

## Changes/Fixes

1. [Video player](components/video-player.tsx): play/pause/replay toggle button
   - Sometimes replay button is shown instead of play. (have not been able to reproduce this in dev)
   - Overlay not extending to bottom.
   - toggling mute doesn't work if mute is true in global settings.
2. [Playlists view screen](<app/(modals)/playlists/view/[id].tsx>): Get the following warning (x2)
   - Reading from `value` during component render. Please ensure that you do not access the `value` property or use `get` method of a shared value while React is rendering a component.
   - show playlist title and description on screen.
   - make videos grid 2x2 on screen.
3. Video screen:
   - scrollPosition is not saving.
   - remove from playlist is always showing even if not in playlist.
4. upload form: verify file and thumbnail get destroyed if not imported.
5. playlists screen:
   - Make this screen use accordions with list view. Add action buttons to:
     - watch
     - view
     - edit
     - delete
   - stale data when videos are removed from playlist.
6. edit video screen:
   - add/remove playlist option.
7. combobox/playlist forms:
   - remove some padding bottom on flashlist.
   - make selected have active bg color.
8. Settings screen:
   - add icons with each section.
   - add theme section. light, dark, system.
   - video player settings: add override orientation and default to that on player component if true.
9. Router tracker:
   - don't push route if it needs to go to lock screen.
   - on sign in route to previousPath.

## Features

1. [Video player](components/video-player.tsx):
   - Additional button controls
     - Toggle loop
     - Chromecast: currently not working with new arch. [react-native-google-cast](https://react-native-google-cast.github.io/docs/components/CastButton)
2. Add custom expo config plugin to enable flag_secure. Hide/blackout screen when inactive or in background.
3. Files screen (new):
   - Accessible from settings screen.
   - Display all app files (local and cache).
   - Allow user to delete some or all.
   - If video is deleted:
     - delete thumb
     - remove from playlist in db
   - Move delete all data button to this screen.
4. Save timestamp of last view of video.
   - Use zustand and mmkv.
   - key = `video_progress:${videoId}`
   - value = `10` (player.currentTime | number | seconds)
5. [Edit video form](components/forms/edit-video.tsx): replace video option.
