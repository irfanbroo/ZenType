---
description: How to add new image wallpapers
---

# Adding New Image Wallpapers

Follow these steps to add a new static image to the wallpaper selection menu.

> [!NOTE]
> **No HTML or CSS updates are needed!** The website automatically detects new images you add to the list in `script.js`.

## 1. Prepare Your Files
- **Image File**: Save your image (JPG/PNG) in `c:\Users\irfan\OneDrive\Desktop\Shizuka\images\`.
- **Thumbnail**: Create a small preview image and save it in `c:\Users\irfan\OneDrive\Desktop\Shizuka\images\thumbs\`. 

## 2. Update the Configuration
Open `c:\Users\irfan\OneDrive\Desktop\Shizuka\script.js` and find the `wallpapers` array. Add a new entry like this:

```javascript
{ 
    id: 'unique_image_id',      // A unique ID (no spaces)
    isVideo: false,             // Must be false for images
    category: 'anime-stills',   // Category: 'anime-stills', 'aesthetic', 'nature', etc.
    url: 'images/filename.jpg', // Path to your full-size image
    thumb: 'images/thumbs/thumbname.jpg', // Path to your thumbnail
    tint: 'dark',               // 'dark', 'light', or 'glass'
    opacity: 60                 // Opacity percentage (0-100)
}
```

## 3. Available Categories for Images
- `anime-stills`
- `aesthetic`
- `nature`

## 4. Save and Test
1. Save `script.js`.
2. Refresh your website.
3. Open settings and check the category you added it to.
