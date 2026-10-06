# Hero film and final frame

Updated October 5, 2026 for the Commercial VIP website (Website 9).

## The film

"The Descent" is buyer film 01 for 8595 US Highway 51. It runs 60 seconds and comes in two cuts, both H.264 at 30 fps with AAC stereo. The site files are 720p web copies (1280 x 720 and 720 x 1280) of the 1080p masters:

- `the-descent-16x9.mp4` is the horizontal cut. It plays on landscape screens.
- `the-descent-9x16.mp4` is the vertical cut. It plays when the page is vertical (portrait orientation) or phone-width (600 px or narrower). If the page crosses that line mid-film, the cut switches at the same moment.

- **Footage:** cuts from the 4K property film `8595US51rd.mp4` provided with the listing, plus the listing's DJI and 3R9A photographs.
- **Concept scenes:** from 40.0 to 52.0 seconds the film shows five photo-to-concept transitions that end with people using the spaces. They were swapped in on 5 October 2026 from the Website 9 concept clips (`Temp Concepts Cobden\<Concept>\Use\`), each played at 1.6x speed:
  - Weddings & Events: great hall (3R9A2604), Golden Dust.
  - Destination Dining: covered upper deck (3R9A2673), Staging Crew.
  - Retreats: dining room with the fireplace (3R9A2634), Walking Furniture.
  - Outfitter Basecamp: enclosed porch (3R9A2706), Topo Map.
  - Private Events: lower patio under the string lights (3R9A2891), Golden Dust.
  - The great-hall photo 3R9A2601 is not used because its chalkboard shows the current business name.
- **Music:** composed in code for the film.

**On-screen figures:**
- $749,000; MLS 12654129; built 2009. (Re-rendered on 1 October 2026 with the current asking price, and again on 5 October 2026 with the new concept clips; the figures did not change.)
- 4,228 sq ft (per floor plan).
- 26.10 acres (per listing).
- 5,800 vehicles per day on US 51 (IDOT 2025).
- Lindsay Hill, RE/MAX Ultimate Professionals, 815-546-5625.

If any of these facts change, the film must be re-rendered. The film's end card carries the disclaimers, and every concept scene is labelled "Concept renderings · illustrative only · not approved uses".

**Two variants, same file names:** Website 9 ships the VIP site twice. In `VIP/production/` these two files are clean. In `VIP/review-watermarked/` they carry the ZonCom review mark over the concept scenes (40.0–52.0 s). Property footage in the film is never marked. Full-quality masters stay in `8595 US Hwy 51 Cobden IL\Videos\`.

## The transition

When the film ends, or Skip is pressed, mahogany louvers close over the end card. A brass sheen crosses "Welcome to your next chapter", and then the louvers flip open onto the final frame.

- The wood is the site's existing decorative texture, `assets/design/mahogany-fine-v2.png` (see `assets/design/texture-notes.md`), served as the same-pixel JPEG `assets/site/img/mahogany-1254.jpg`. It is not wood from the property.
- The louvers' backs carry the unaltered drone photograph.
- With reduced motion the page cuts straight to the photograph.

## The final frame

When the film ends, or is skipped, the hero settles on the previous arrival animation's final frame.

- **Photograph:** `lodge-1200.jpg` / `-1920` / `-2880` / `-4004`.
  - These are web sizes of a 4004 × 2999 upscale of the listing's drone photograph `assets/originals/DJI_20260514055621_0796_D.jpg` (14 May 2026). The upscale was provided by the user on 26 September 2026.
  - Scaled back to 1024 px, the upscale matches the original: the mean difference is 1–2 levels per channel and no region differs by more than 13 levels.
  - `assets/originals/` is unchanged. The upscale as received is kept outside the website in `VIP/_source/hero-images-2026-09-26/`.
  - It is framed zoomed in on the lodge: the main gable peak sits at top centre with a band of sky above it, and the image is at least 4/3 of the hero wide.
- **Representative card:** `lindsay-hill.jpg` is Lindsay Hill's headshot, provided by the user on 26 September 2026 (456 × 368, gold ring on black, as received).
  - It was cropped to a 300 px square inside the gold ring, centred on the face, and resized to 640 px (Lanczos, light sharpening).
  - It sits in the page's own brass ring; the photo inside is otherwise unedited.
  - The flyer crop of `assets/originals/1.png` is no longer used. Website 8 shows the same headshot in the tour and contact section.

## The previous hero

The previous hero was a globe-to-property arrival animation built from NASA Blue Marble / USDA / USGS The National Map imagery. It is archived with its own sources note in `VIP/_archive/arrival-hero-2026-09-14/`. That folder also has instructions for restoring it.
