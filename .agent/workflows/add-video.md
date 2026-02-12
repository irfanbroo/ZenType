---
description: How to add new videos to the wallpaper selector
---

# Adding New Videos

Follow these steps to add a new video to the wallpaper selection menu.

## 1. Prepare Your Files
- **Video File**: Save your video (ideally .mp4) in `c:\Users\irfan\OneDrive\Desktop\Shizuka\videos\`.
- **Thumbnail**: Create a small preview image and save it in `c:\Users\irfan\OneDrive\Desktop\Shizuka\videos\thumbs\`. 
  - *Tip: Use a clear frame from the video so users know what they are picking.*

## 2. Update the Configuration
Open `c:\Users\irfan\OneDrive\Desktop\Shizuka\script.js` and find the `wallpapers` array. Add a new entry like this:

```javascript
{
    id: 'unique_name',         // A unique ID for the video (no spaces)
    isVideo: true,
    hasAudio: true,             // Set to true if it has music/sound
    category: 'anime-videos',   // Category: 'anime-videos', 'aesthetic-videos', etc.
    url: 'videos/filename.mp4', // The path to your video file
    thumb: 'videos/thumbs/thumbname.png', // The path to your thumbnail
    tint: 'dark',               // 'dark' or 'light' depending on the visual
    opacity: 70                 // Default opacity (usually 70)
}
```

## 3. Available Categories
You can add your video to any of these existing categories defined in `wallpaperCategories`:
- `anime-videos`
- `anime-stills`
- `aesthetic-videos`
- `aesthetic`
- `nature`

## 4. Save and Test
1. Save `script.js`.
2. Refresh your website in the browser.
3. Open the settings (cog icon) and check the category you added it to.
