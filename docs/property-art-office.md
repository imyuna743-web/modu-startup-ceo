# Unique property artwork — office locations

Generation mode: built-in `image_gen.imagegen`, one call per asset. All delivered files are unchanged PNG copies of generated outputs; no resizing, re-encoding, cropping or color processing was applied.

Style research: viewed `dist/assets/scene-office-spring.png` for the existing thin-line Korean visual-novel appearance. Each new spring scene was generated independently from text, without using the old office scene as an edit target or copying its architecture. Subsequent seasons reference only the spring image of the SAME property.

## Locations and distinct layouts

| ID | Place | Unique architecture and layout |
|---|---|---|
| cowork | 공유오피스 | Open loft, long shared desk, varied seating, communal coffee corner |
| suite | 독립 사무실 | Deep central corridor, multiple glass-separated team zones |
| meeting | 회의실 | Conference table, presentation display, whiteboard |
| ceo | 사장실 | Executive desk, wall bookcase, separate sofa conversation area |

## Seasons

| Season | Months | Exterior |
|---|---|---|
| spring | 3–4 | Pink cherry blossoms and new leaves |
| summer | 5–8 | Dense green foliage |
| autumn | 9–10 | Golden, orange and rust leaves |
| winter | 11–2 | Bare branches, snow on outdoor trees, roofs and ground |

## Final prompts and generated paths

### cowork / spring

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-cowork-spring.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-d14ffcf6-4642-4558-93a0-9b436765fd87.png`
- Operation: generate
- Transparent background: false
- Input reference: none (new original composition)

Final prompt:

```text
Use case: illustration-story. Asset type: individual landscape 16:9 visual-novel game background for a Korean entrepreneurship life simulation. Original standalone environment artwork, NOT a collage, no multi-panel sheet. Style: contemporary Korean everyday 2D visual-novel background, thin precise clean dark outlines, flat restrained colors, very light simple cel shadows, clear architectural perspective, matte surfaces, pale blue/navy accents and warm neutral wood. No photorealism, 3D render, pixels, texture noise, glow, dramatic lighting or painterly brushwork. Eye-level camera. The room is unoccupied with no people, no lettering, no signs, no logos, no UI. Compose furniture mainly in the middle/back area, leave the lower quarter visibly open and quiet for overlaying a standing character. Large windows show a real Korean city neighborhood during SPRING: abundant pale pink cherry blossom trees and bright fresh young leaves, blue sky, calm daytime. All blossoms remain outdoors. Keep objects legible and finite, simple believable desk accessories, no unreadable pseudo-text on books/screens. Render the entire scene edge to edge as a landscape image.

Subject and architecture: A distinctive open-plan SHARED COWORKING SPACE in a renovated loft. Camera looks diagonally across the room toward tall black-framed factory windows along the LEFT wall and the far wall. A single long pale-wood communal desk stretches diagonally from middle-left to rear center, with six different unoccupied hot-desk seats, simple varied laptops and small desktop dividers. Exposed white ceiling beams and three slender hanging lamps. A common coffee corner sits on the RIGHT back wall with a compact espresso machine, mugs and open cubby lockers, with a high window counter and stools beyond. Warm wood plank floor and muted teal/blue chairs. Distinctive loft architecture and communal table layout; it must not look like a small two-desk office, a cafe, or a conference room.
```

### cowork / summer

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-cowork-summer.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-7d03aef0-3a23-4236-b3f6-d90b1c4930a6.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-cowork-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into SUMMER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and fresh spring foliage with full dense lush mature green tree canopies, richer dark and bright green leaves; remove every pink blossom and petal outdoors. The same buildings, street, skyline and terrain stay in their exact positions. Clear blue summer sky and calm daylight. Keep all indoor plants and flowers exactly unchanged. No new people, text, logos, signs or UI; no rearrangement or cropping; no tropical palm trees or added scenery. Keep open foreground for character overlay.
```

### cowork / autumn

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-cowork-autumn.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-4372acb8-0a6b-47f3-919b-f0d21baf42b5.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-cowork-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into AUTUMN. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and spring green foliage with vivid but natural golden-yellow, warm orange and rust-red autumn tree canopies, fewer green leaves, a little fallen autumn foliage on outdoor pavements. Remove all pink blossom petals outdoors. The same buildings, street, skyline and terrain stay in exact positions. Crisp clear pale blue autumn sky and calm daylight. Keep all indoor houseplants and flowers unchanged and green. No new people, text, logos, signs or UI; no furniture rearrangement or cropping; no autumn leaves indoors. Keep the open foreground for character overlay.
```

### cowork / winter

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-cowork-winter.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-a07f9f0c-ba6c-4489-bab9-0d1eddf9cab8.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-cowork-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into WINTER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all cherry blossoms and leafy tree canopies with the same trees having bare winter branches, clear white snow on exterior branches, rooftops, pavement and outdoor hills. No pink blossoms or outdoor green deciduous canopies remain. The same buildings, street, skyline and terrain stay in exact positions. A quiet snowy Korean city under a pale crisp winter blue sky, with a few subtle snowflakes outdoors only. Keep all indoor plants and flowers exactly unchanged, healthy green, all interior surfaces dry. Absolutely no snow inside. No new people, text, logos, signs or UI; no rearrangement or cropping. Keep open foreground for character overlay.
```

### suite / spring

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-suite-spring.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-174fa2de-c9cf-4fe4-8e7f-b8ecc225e950.png`
- Operation: generate
- Transparent background: false
- Input reference: none (new original composition)

Final prompt:

```text
Use case: illustration-story. Asset type: individual landscape 16:9 visual-novel game background for a Korean entrepreneurship life simulation. Original standalone environment artwork, NOT a collage, no multi-panel sheet. Style: contemporary Korean everyday 2D visual-novel background, thin precise clean dark outlines, flat restrained colors, very light simple cel shadows, clear architectural perspective, matte surfaces, pale blue/navy accents and warm neutral wood. No photorealism, 3D render, pixels, texture noise, glow, dramatic lighting or painterly brushwork. Eye-level camera. The room is unoccupied with no people, no lettering, no signs, no logos, no UI. Compose furniture mainly in the middle/back area, leave the lower quarter visibly open and quiet for overlaying a standing character. Large windows show a real Korean city neighborhood during SPRING: abundant pale pink cherry blossom trees and bright fresh young leaves, blue sky, calm daytime. All blossoms remain outdoors. Keep objects legible and finite, simple believable desk accessories, no unreadable pseudo-text on books/screens. Render the entire scene edge to edge as a landscape image.

Subject and architecture: An expansive INDEPENDENT TEAM OFFICE SUITE, viewed from the wide entrance corridor. Strong long architectural depth: a clear central aisle recedes toward back windows, with several separate team work clusters on BOTH sides, frosted lower glass partitions and slim dark frames creating distinct work zones. One team pod at middle-left with three monitor desks; another deeper right pod; a small enclosed team room behind glass farther back. Low file cabinets, a copier nook, acoustic ceiling panels, light gray carpet flooring. A continuous band of tall windows along the LEFT exterior wall reveals spring trees outside, and another large window at the far end. Clean blue/charcoal furniture. This is a broad multi-zone self-contained company office with a corridor, unmistakably larger than a simple starter office. Keep the front section of the aisle unobstructed.
```

### suite / summer

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-suite-summer.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-8b9407a1-c197-4614-98a8-7f1396af9e54.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-suite-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into SUMMER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and fresh spring foliage with full dense lush mature green tree canopies, richer dark and bright green leaves; remove every pink blossom and petal outdoors. The same buildings, street, skyline and terrain stay in their exact positions. Clear blue summer sky and calm daylight. Keep all indoor plants and flowers exactly unchanged. No new people, text, logos, signs or UI; no rearrangement or cropping; no tropical palm trees or added scenery. Keep open foreground for character overlay.
```

### suite / autumn

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-suite-autumn.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-4f414140-65a2-4a95-afb8-19c6f4114f03.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-suite-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into AUTUMN. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and spring green foliage with vivid but natural golden-yellow, warm orange and rust-red autumn tree canopies, fewer green leaves, a little fallen autumn foliage on outdoor pavements. Remove all pink blossom petals outdoors. The same buildings, street, skyline and terrain stay in exact positions. Crisp clear pale blue autumn sky and calm daylight. Keep all indoor houseplants and flowers unchanged and green. No new people, text, logos, signs or UI; no furniture rearrangement or cropping; no autumn leaves indoors. Keep the open foreground for character overlay.
```

### suite / winter

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-suite-winter.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-6249edd2-c95c-439d-afb4-fb1bba1e2434.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-suite-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into WINTER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all cherry blossoms and leafy tree canopies with the same trees having bare winter branches, clear white snow on exterior branches, rooftops, pavement and outdoor hills. No pink blossoms or outdoor green deciduous canopies remain. The same buildings, street, skyline and terrain stay in exact positions. A quiet snowy Korean city under a pale crisp winter blue sky, with a few subtle snowflakes outdoors only. Keep all indoor plants and flowers exactly unchanged, healthy green, all interior surfaces dry. Absolutely no snow inside. No new people, text, logos, signs or UI; no rearrangement or cropping. Keep open foreground for character overlay.
```

### meeting / spring

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-meeting-spring.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-f453bf7a-b1c5-422e-aebb-ba0ddfd5c036.png`
- Operation: generate
- Transparent background: false
- Input reference: none (new original composition)

Final prompt:

```text
Use case: illustration-story. Asset type: individual landscape 16:9 visual-novel game background for a Korean entrepreneurship life simulation. Original standalone environment artwork, NOT a collage, no multi-panel sheet. Style: contemporary Korean everyday 2D visual-novel background, thin precise clean dark outlines, flat restrained colors, very light simple cel shadows, clear architectural perspective, matte surfaces, pale blue/navy accents and warm neutral wood. No photorealism, 3D render, pixels, texture noise, glow, dramatic lighting or painterly brushwork. Eye-level camera. The room is unoccupied with no people, no lettering, no signs, no logos, no UI. Compose furniture mainly in the middle/back area, leave the lower quarter visibly open and quiet for overlaying a standing character. Large windows show a real Korean city neighborhood during SPRING: abundant pale pink cherry blossom trees and bright fresh young leaves, blue sky, calm daytime. All blossoms remain outdoors. Keep objects legible and finite, simple believable desk accessories, no unreadable pseudo-text on books/screens. Render the entire scene edge to edge as a landscape image.

Subject and architecture: A dedicated modern BOARD MEETING ROOM, viewed diagonally from an empty front corner. One long walnut conference table is centered in the middle distance with eight matching slate-blue padded chairs; its front edge begins above the empty lower-quarter floor, leaving standing-character room in front. A large blank navy presentation display and a separate clean blank whiteboard occupy the RIGHT wall; low credenza beneath display with a water jug and glasses. The LEFT wall is almost entirely floor-to-ceiling windows looking onto pink spring cherry trees and a quiet Korean street. Rear wall has restrained pale acoustic panels and a simple closed door. White linear pendant above the table; muted blue-gray carpet and precise contemporary architecture. No office desk clusters, coffee shop counter or beds. Screens/whiteboard entirely blank.
```

### meeting / summer

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-meeting-summer.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-55966f67-3953-4106-b253-ac2d304c4950.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-meeting-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into SUMMER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and fresh spring foliage with full dense lush mature green tree canopies, richer dark and bright green leaves; remove every pink blossom and petal outdoors. The same buildings, street, skyline and terrain stay in their exact positions. Clear blue summer sky and calm daylight. Keep all indoor plants and flowers exactly unchanged. No new people, text, logos, signs or UI; no rearrangement or cropping; no tropical palm trees or added scenery. Keep open foreground for character overlay.
```

### meeting / autumn

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-meeting-autumn.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-3e1d0b32-f5ac-4af1-9d54-9fe6eebca476.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-meeting-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into AUTUMN. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and spring green foliage with vivid but natural golden-yellow, warm orange and rust-red autumn tree canopies, fewer green leaves, a little fallen autumn foliage on outdoor pavements. Remove all pink blossom petals outdoors. The same buildings, street, skyline and terrain stay in exact positions. Crisp clear pale blue autumn sky and calm daylight. Keep all indoor houseplants and flowers unchanged and green. No new people, text, logos, signs or UI; no furniture rearrangement or cropping; no autumn leaves indoors. Keep the open foreground for character overlay.
```

### meeting / winter

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-meeting-winter.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-57ab3287-b304-4bf7-9b8d-6910c88c46b7.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-meeting-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into WINTER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all cherry blossoms and leafy tree canopies with the same trees having bare winter branches, clear white snow on exterior branches, rooftops, pavement and outdoor hills. No pink blossoms or outdoor green deciduous canopies remain. The same buildings, street, skyline and terrain stay in exact positions. A quiet snowy Korean city under a pale crisp winter blue sky, with a few subtle snowflakes outdoors only. Keep all indoor plants and flowers exactly unchanged, healthy green, all interior surfaces dry. Absolutely no snow inside. No new people, text, logos, signs or UI; no rearrangement or cropping. Keep open foreground for character overlay.
```

### ceo / spring

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-ceo-spring.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-afa8457e-f7eb-4e04-81bb-a393dd97edf8.png`
- Operation: generate
- Transparent background: false
- Input reference: none (new original composition)

Final prompt:

```text
Use case: illustration-story. Asset type: individual landscape 16:9 visual-novel game background for a Korean entrepreneurship life simulation. Original standalone environment artwork, NOT a collage, no multi-panel sheet. Style: contemporary Korean everyday 2D visual-novel background, thin precise clean dark outlines, flat restrained colors, very light simple cel shadows, clear architectural perspective, matte surfaces, pale blue/navy accents and warm neutral wood. No photorealism, 3D render, pixels, texture noise, glow, dramatic lighting or painterly brushwork. Eye-level camera. The room is unoccupied with no people, no lettering, no signs, no logos, no UI. Compose furniture mainly in the middle/back area, leave the lower quarter visibly open and quiet for overlaying a standing character. Large windows show a real Korean city neighborhood during SPRING: abundant pale pink cherry blossom trees and bright fresh young leaves, blue sky, calm daytime. All blossoms remain outdoors. Keep objects legible and finite, simple believable desk accessories, no unreadable pseudo-text on books/screens. Render the entire scene edge to edge as a landscape image.

Subject and architecture: A distinctive executive CEO'S PRIVATE OFFICE. Wide eye-level frontal three-quarter view of a quiet refined room. A single large dark-walnut executive desk sits in the rear LEFT half, with a high-backed navy chair behind, one closed notebook and a monitor; an orderly floor-to-ceiling bookcase wall directly behind the desk has books with blank spines and a few plain ceramic objects. The RIGHT half has a separate conversation area of a low pale taupe sofa, a navy armchair and a small round coffee table, arranged back from the foreground. Tall corner windows behind/right of the seating reveal pink spring cherry blossoms and city rooftops. Subtle blue-gray walls, warm oak floor, no ostentatious gold, no giant emptiness. It must read as one executive study with desk plus lounge, architecturally different from a shared office, meeting room and home office. Open foreground across the lower quarter.
```

### ceo / summer

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-ceo-summer.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-a498fd8c-3e8a-4671-a170-fcbce1814318.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-ceo-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into SUMMER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and fresh spring foliage with full dense lush mature green tree canopies, richer dark and bright green leaves; remove every pink blossom and petal outdoors. The same buildings, street, skyline and terrain stay in their exact positions. Clear blue summer sky and calm daylight. Keep all indoor plants and flowers exactly unchanged. No new people, text, logos, signs or UI; no rearrangement or cropping; no tropical palm trees or added scenery. Keep open foreground for character overlay.
```

### ceo / autumn

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-ceo-autumn.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-f1d81745-46a5-4a0f-8ecd-45a0371dbf13.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-ceo-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into AUTUMN. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all pink cherry blossoms and spring green foliage with vivid but natural golden-yellow, warm orange and rust-red autumn tree canopies, fewer green leaves, a little fallen autumn foliage on outdoor pavements. Remove all pink blossom petals outdoors. The same buildings, street, skyline and terrain stay in exact positions. Crisp clear pale blue autumn sky and calm daylight. Keep all indoor houseplants and flowers unchanged and green. No new people, text, logos, signs or UI; no furniture rearrangement or cropping; no autumn leaves indoors. Keep the open foreground for character overlay.
```

### ceo / winter

- Final asset: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-ceo-winter.png`
- Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-99db3e58-21f3-477c-849c-15bc3207120a.png`
- Operation: edit
- Transparent background: false
- Input reference: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-ceo-spring.png`

Final prompt:

```text
Use case: lighting-weather. Edit this exact visual-novel room image into WINTER. Preserve the exact 16:9 landscape camera, framing, room dimensions, interior architecture, floor and ceiling, every piece of furniture and its position, chairs, desk contents, lamps, shelves, screens, glass partitions and window frames. Preserve the thin clean linework and restrained flat color style. Change ONLY the season visible OUTSIDE THE WINDOWS: replace all cherry blossoms and leafy tree canopies with the same trees having bare winter branches, clear white snow on exterior branches, rooftops, pavement and outdoor hills. No pink blossoms or outdoor green deciduous canopies remain. The same buildings, street, skyline and terrain stay in exact positions. A quiet snowy Korean city under a pale crisp winter blue sky, with a few subtle snowflakes outdoors only. Keep all indoor plants and flowers exactly unchanged, healthy green, all interior surfaces dry. Absolutely no snow inside. No new people, text, logos, signs or UI; no rearrangement or cropping. Keep open foreground for character overlay.
```

## Validation

Visually reviewed all sixteen outputs for scene identity, seasonal changes, consistent furniture/camera layout within each property, no people or text, and usable foreground space. The four properties have distinct architectural layouts and do not reuse the original starter-office scene. All files remain original generated PNGs.

