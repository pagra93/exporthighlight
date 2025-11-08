# 📸 Dashboard Preview Image Instructions

## Required Image

You need to add a screenshot of your dashboard to display in the landing page hero section.

### File Details

**Filename:** `dashboard-preview.png`  
**Location:** `/public/dashboard-preview.png`  
**Recommended Size:** 1200x800px (3:2 aspect ratio)  
**Format:** PNG (with transparency if possible)  
**Max File Size:** < 500KB (optimize with TinyPNG or similar)

---

## How to Capture the Perfect Screenshot

### 1. **Navigate to Your Dashboard**
Go to: `https://exporthighlight.com/account`

### 2. **Set Up the View**
Make sure the dashboard shows:
- ✅ Sidebar with "All Highlights" visible
- ✅ At least 2-3 book cards displayed
- ✅ Export buttons visible
- ✅ Clean, organized look
- ✅ Light mode (recommended for better contrast)

### 3. **Take the Screenshot**
**Recommended Tools:**
- **Mac:** Cmd + Shift + 4 (select area)
- **Windows:** Win + Shift + S
- **Chrome Extension:** Awesome Screenshot

### 4. **Crop & Optimize**
- Crop to show just the main content (no browser chrome)
- Remove any personal/sensitive information
- Optimize the image size (use tinypng.com)

### 5. **Add to Project**
```bash
# Save as:
/public/dashboard-preview.png

# Then commit:
git add public/dashboard-preview.png
git commit -m "Add dashboard preview image"
git push
```

---

## Alternative: Use a Mockup Tool

If you want a cleaner look, create a mockup with:

**Figma Template:**
1. Export your dashboard as screenshot
2. Wrap it in a browser frame mockup
3. Add subtle shadow/perspective
4. Export as PNG

**Online Tools:**
- https://screely.com/ (browser frame)
- https://shots.so/ (device mockups)
- https://www.screenstab.com/ (browser mockups)

---

## Temporary Placeholder

Until you add the real image, the component will show:
- ❌ Broken image icon (not good)

**Quick Fix - Add Placeholder:**

Create a simple placeholder gradient if needed:
```bash
# Or use a free stock image temporarily from:
# https://unsplash.com/s/photos/dashboard
# Save as: public/dashboard-preview.png
```

---

## SEO Optimization

Make sure your image has:
- ✅ Descriptive filename: `dashboard-preview.png`
- ✅ Alt text: "Export Kindle Notes Dashboard - Organize and export your highlights" (already set in code)
- ✅ Optimized file size (< 500KB)

---

## Current Implementation

The image is used in:
- **Desktop:** Right side of hero (50% width)
- **Mobile:** Below the upload section (full width)

With decorative effects:
- Gradient blur background
- Rounded corners
- Shadow
- Border

---

Need help? The component is in: `app/page.tsx` (line ~255)

