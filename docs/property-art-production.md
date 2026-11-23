# Production property background art

Generated on 2026-11-22 with the built-in `image_gen.imagegen` tool. No CLI/API fallback was used. This document covers only kitchen, coslab, factory, and logistics.

## Scope and reference policy

Four original spring interiors were generated independently from text, with no supplied image reference. Existing `dist/assets/scene-studio-spring.png` and `dist/assets/scene-cafe-spring.png` were inspected only to understand the project's linework and palette. Their architecture and furniture were not reused.

Every summer, autumn, and winter image was edited directly from that same location's own spring PNG using `referenced_image_paths`, with `transparent_background: false`. No location used another location's image as its edit target. The prompts below are the exact final prompts sent to the built-in tool.

## Validation

All 16 PNGs open successfully and are 1672 × 941 pixels (wide, approximately 16:9). All 16 file hashes are distinct. Visual inspection confirmed the four independent room designs, recognizable seasonal outdoor views, unchanged room layouts across each seasonal set, open character-compositing foreground space, and no people or interface. Spring shows blossoms, summer lush green foliage, autumn golden-orange foliage, and winter bare branches with snow outside. Source images were copied byte-for-byte into `dist/assets`; no programmatic image transformations were applied.

## Asset manifest

| Asset | Original generation output | Edit reference |
| --- | --- | --- |
| `dist/assets/scene-kitchen-spring.png` | `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png` | None; new image from text |
| `dist/assets/scene-kitchen-summer.png` | `/workspace/scratch/56fed0117126/generated_images/exec-3d7d704e-0c24-42bb-8580-fd489487224f.png` | `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png` |
| `dist/assets/scene-kitchen-autumn.png` | `/workspace/scratch/56fed0117126/generated_images/exec-4ad5ebdc-b17c-42a6-86eb-3322e05d8810.png` | `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png` |
| `dist/assets/scene-kitchen-winter.png` | `/workspace/scratch/56fed0117126/generated_images/exec-1a83853f-1b78-41af-8a43-ea9c092d9137.png` | `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png` |
| `dist/assets/scene-coslab-spring.png` | `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png` | None; new image from text |
| `dist/assets/scene-coslab-summer.png` | `/workspace/scratch/56fed0117126/generated_images/exec-a5537d5f-c314-4ec4-9218-c6c6e7be7326.png` | `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png` |
| `dist/assets/scene-coslab-autumn.png` | `/workspace/scratch/56fed0117126/generated_images/exec-c5bbb352-ec82-4f44-9c9b-d1331210823c.png` | `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png` |
| `dist/assets/scene-coslab-winter.png` | `/workspace/scratch/56fed0117126/generated_images/exec-5dc4db03-fc6a-455a-a45a-727517b26345.png` | `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png` |
| `dist/assets/scene-factory-spring.png` | `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png` | None; new image from text |
| `dist/assets/scene-factory-summer.png` | `/workspace/scratch/56fed0117126/generated_images/exec-5bf42c52-6805-413f-a903-67a967db5ed2.png` | `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png` |
| `dist/assets/scene-factory-autumn.png` | `/workspace/scratch/56fed0117126/generated_images/exec-ffdf714e-78b2-4170-832f-ea79734d5885.png` | `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png` |
| `dist/assets/scene-factory-winter.png` | `/workspace/scratch/56fed0117126/generated_images/exec-c27f5525-3b26-43d4-91f9-555d5a4ba866.png` | `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png` |
| `dist/assets/scene-logistics-spring.png` | `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png` | None; new image from text |
| `dist/assets/scene-logistics-summer.png` | `/workspace/scratch/56fed0117126/generated_images/exec-834d631b-feda-4c2a-b705-f44b2882ce6f.png` | `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png` |
| `dist/assets/scene-logistics-autumn.png` | `/workspace/scratch/56fed0117126/generated_images/exec-a85a365a-5a96-4bf3-a7b5-c9bdbdd206bd.png` | `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png` |
| `dist/assets/scene-logistics-winter.png` | `/workspace/scratch/56fed0117126/generated_images/exec-33e9a437-f32b-4cea-b7c1-62210354bf15.png` | `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png` |

## Exact final prompts

### kitchen — spring

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-kitchen-spring.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png`

Reference: none (new image generation).

```text
Use case: illustration-story.
Asset type: background illustration for a Korean everyday-life visual-novel business simulation game, no interface.
Style: restrained clean hand-drawn Korean visual novel background with thin crisp blue-gray outlines, matte flat pastel colors and a little cel shading. Cool neutral blue-gray walls, natural balanced daylight. Simple material shading with no realistic rendering, no photorealism, no 3D, no glossy reflections, no heavy texture, no glow.
Composition: a single wide 16:9 landscape illustration, full bleed, eye-level interior view. Keep an uncluttered open area on one foreground side for later character compositing. Clear architectural perspective with functional believable equipment. Absolutely no people, animals, words, letters, numbers, labels, logos, watermarks, UI, or decorative text. No collage or split image.
Season: SPRING in Korea in March–April. A substantial window or open doorway clearly reveals pink cherry blossoms, small fresh pale-green leaves, blue sky, and a quiet low-rise neighborhood or work yard outside. Bright soft daytime light.
Unique place: a commercial café kitchen, viewed diagonally from its entrance. A long stainless steel prep counter and integrated double sink with curved taps run down the LEFT wall below broad rectangular windows looking into a small cherry-blossom service courtyard. On the RIGHT rear wall stand a tall double-door silver refrigerator, a stacked commercial convection oven, and a short range under a simple exhaust hood. A modest central stainless island stops in the middle distance; the foreground RIGHT is clear tiled floor. White small rectangular backsplash tiles, charcoal non-slip tiled floor, a few plain bowls and trays on shelves. Make this unmistakably a working kitchen, no café seating and no coffee-shop front counter. The architecture and composition must be unique to this location.
```

### kitchen — summer

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-kitchen-summer.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-3d7d704e-0c24-42bb-8580-fd489487224f.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for kitchen. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to SUMMER in Korea, May–August: change every visible outdoor deciduous tree to a dense lush green canopy with abundant healthy green leaves. All pink cherry blossoms disappear. Blue summer sky, slightly stronger clear daytime sunlight. No snow and no autumn leaves.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### kitchen — autumn

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-kitchen-autumn.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-4ad5ebdc-b17c-42a6-86eb-3322e05d8810.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for kitchen. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to AUTUMN in Korea, September–October: change every visible outdoor deciduous tree to yellow, golden-orange and muted russet autumn foliage. Pink cherry blossoms and summer-green tree canopies disappear. A few fallen leaves may appear outdoors only. Clear mild daytime sky, subtly warmer sunlight. No snow.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### kitchen — winter

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-kitchen-winter.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-1a83853f-1b78-41af-8a43-ea9c092d9137.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-1014fc83-e6af-4454-bdeb-dc1172a12aa9.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for kitchen. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to WINTER in Korea, November–February: change every visible outdoor deciduous tree to bare leafless branching with a light cap of snow; show clearly visible clean snow covering the outdoor ground, courtyard or loading yard and roof edges. No blossoms or green/yellow deciduous foliage. Pale crisp winter daylight and blue-gray sky. Keep every interior floor clean and snow-free.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### coslab — spring

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-coslab-spring.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png`

Reference: none (new image generation).

```text
Use case: illustration-story.
Asset type: background illustration for a Korean everyday-life visual-novel business simulation game, no interface.
Style: restrained clean hand-drawn Korean visual novel background with thin crisp blue-gray outlines, matte flat pastel colors and a little cel shading. Cool neutral blue-gray walls, natural balanced daylight. Simple material shading with no realistic rendering, no photorealism, no 3D, no glossy reflections, no heavy texture, no glow.
Composition: a single wide 16:9 landscape illustration, full bleed, eye-level interior view. Keep an uncluttered open area on one foreground side for later character compositing. Clear architectural perspective with functional believable equipment. Absolutely no people, animals, words, letters, numbers, labels, logos, watermarks, UI, or decorative text. No collage or split image.
Season: SPRING in Korea in March–April. A substantial window or open doorway clearly reveals pink cherry blossoms, small fresh pale-green leaves, blue sky, and a quiet low-rise neighborhood or work yard outside. Bright soft daytime light.
Unique place: a small clean cosmetics sample laboratory, viewed from a corner on a gentle diagonal. A long white laboratory bench with pale blue lower cupboards spans the RIGHT side, holding small unlabelled cosmetic sample bottles and jars arranged in neat groups, a compact benchtop mixer with a steel mixing vessel, glass beakers, and a precision balance with a blank dark display. A second short white workbench sits in the back-left middle distance, with open white shelves of unlabelled containers behind it. A broad low horizontal window across the BACK wall above the bench reveals an outdoor cherry tree and fresh spring foliage. Distinct clean laboratory ceiling panels, soft mint and cool-white surfaces, smooth matte light-gray floor. Foreground LEFT provides clear floor for character compositing. This is an R&D sample room, not a medical clinic, chemistry classroom, café, or office. Architecture and layout must be unique.
```

### coslab — summer

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-coslab-summer.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-a5537d5f-c314-4ec4-9218-c6c6e7be7326.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for coslab. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to SUMMER in Korea, May–August: change every visible outdoor deciduous tree to a dense lush green canopy with abundant healthy green leaves. All pink cherry blossoms disappear. Blue summer sky, slightly stronger clear daytime sunlight. No snow and no autumn leaves.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### coslab — autumn

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-coslab-autumn.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-c5bbb352-ec82-4f44-9c9b-d1331210823c.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for coslab. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to AUTUMN in Korea, September–October: change every visible outdoor deciduous tree to yellow, golden-orange and muted russet autumn foliage. Pink cherry blossoms and summer-green tree canopies disappear. A few fallen leaves may appear outdoors only. Clear mild daytime sky, subtly warmer sunlight. No snow.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### coslab — winter

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-coslab-winter.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-5dc4db03-fc6a-455a-a45a-727517b26345.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-16cca83f-539b-4290-8ce7-0db454e469b3.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for coslab. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to WINTER in Korea, November–February: change every visible outdoor deciduous tree to bare leafless branching with a light cap of snow; show clearly visible clean snow covering the outdoor ground, courtyard or loading yard and roof edges. No blossoms or green/yellow deciduous foliage. Pale crisp winter daylight and blue-gray sky. Keep every interior floor clean and snow-free.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### factory — spring

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-factory-spring.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png`

Reference: none (new image generation).

```text
Use case: illustration-story.
Asset type: background illustration for a Korean everyday-life visual-novel business simulation game, no interface.
Style: restrained clean hand-drawn Korean visual novel background with thin crisp blue-gray outlines, matte flat pastel colors and a little cel shading. Cool neutral blue-gray walls, natural balanced daylight. Simple material shading with no realistic rendering, no photorealism, no 3D, no glossy reflections, no heavy texture, no glow.
Composition: a single wide 16:9 landscape illustration, full bleed, eye-level interior view. Keep an uncluttered open area on one foreground side for later character compositing. Clear architectural perspective with functional believable equipment. Absolutely no people, animals, words, letters, numbers, labels, logos, watermarks, UI, or decorative text. No collage or split image.
Season: SPRING in Korea in March–April. A substantial window or open doorway clearly reveals pink cherry blossoms, small fresh pale-green leaves, blue sky, and a quiet low-rise neighborhood or work yard outside. Bright soft daytime light.
Unique place: a small contract-manufacturing factory hall, a distinctly large HIGH-CEILING industrial interior. Viewed down a broad diagonal production aisle from the front left. Exposed blue-gray roof trusses and rectangular hanging industrial lights. A long automated conveyor line with simple enclosed production machines occupies the RIGHT half and recedes into depth; machines have matte pale-gray housings, dark glass panels, pipes and a few compact status lights without letters or labels. Clear yellow safety lines mark the concrete aisle. On the far LEFT wall a row of tall factory windows and one open service door reveal a work yard with blooming pink cherry trees and fresh light-green trees. Foreground LEFT aisle clear for character compositing. No residential furnishings. Make the industrial equipment believable yet cleanly simplified, with unique architecture unlike every other location.
```

### factory — summer

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-factory-summer.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-5bf42c52-6805-413f-a903-67a967db5ed2.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for factory. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to SUMMER in Korea, May–August: change every visible outdoor deciduous tree to a dense lush green canopy with abundant healthy green leaves. All pink cherry blossoms disappear. Blue summer sky, slightly stronger clear daytime sunlight. No snow and no autumn leaves.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### factory — autumn

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-factory-autumn.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-ffdf714e-78b2-4170-832f-ea79734d5885.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for factory. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to AUTUMN in Korea, September–October: change every visible outdoor deciduous tree to yellow, golden-orange and muted russet autumn foliage. Pink cherry blossoms and summer-green tree canopies disappear. A few fallen leaves may appear outdoors only. Clear mild daytime sky, subtly warmer sunlight. No snow.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### factory — winter

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-factory-winter.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-c27f5525-3b26-43d4-91f9-555d5a4ba866.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-96ce4689-295b-4842-9119-26c02e26dfd1.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for factory. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to WINTER in Korea, November–February: change every visible outdoor deciduous tree to bare leafless branching with a light cap of snow; show clearly visible clean snow covering the outdoor ground, courtyard or loading yard and roof edges. No blossoms or green/yellow deciduous foliage. Pale crisp winter daylight and blue-gray sky. Keep every interior floor clean and snow-free.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### logistics — spring

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-logistics-spring.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png`

Reference: none (new image generation).

```text
Use case: illustration-story.
Asset type: background illustration for a Korean everyday-life visual-novel business simulation game, no interface.
Style: restrained clean hand-drawn Korean visual novel background with thin crisp blue-gray outlines, matte flat pastel colors and a little cel shading. Cool neutral blue-gray walls, natural balanced daylight. Simple material shading with no realistic rendering, no photorealism, no 3D, no glossy reflections, no heavy texture, no glow.
Composition: a single wide 16:9 landscape illustration, full bleed, eye-level interior view. Keep an uncluttered open area on one foreground side for later character compositing. Clear architectural perspective with functional believable equipment. Absolutely no people, animals, words, letters, numbers, labels, logos, watermarks, UI, or decorative text. No collage or split image.
Season: SPRING in Korea in March–April. A substantial window or open doorway clearly reveals pink cherry blossoms, small fresh pale-green leaves, blue sky, and a quiet low-rise neighborhood or work yard outside. Bright soft daytime light.
Unique place: a spacious logistics warehouse, a straight deep central shipping aisle with tall blue-gray steel pallet racks on the LEFT densely loaded with plain unlabelled brown cardboard cartons, while the RIGHT middle ground contains a sturdy packing table with a blank tape dispenser, flat cartons, and a low pallet with a few parcels. The far BACK-RIGHT has a wide raised roll-up loading door OPEN onto a spring loading yard with pink cherry blossoms, fresh green trees and blue sky, and a narrow high window beside it. Roof girders, concrete floor with a subtle painted loading lane, clean practical geometry. Keep the foreground RIGHT side open for character compositing. No vehicle, no people, no signs or printed labels on boxes. This must look like distribution and packing rather than a factory production line; unique warehouse architecture and arrangement.
```

### logistics — summer

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-logistics-summer.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-834d631b-feda-4c2a-b705-f44b2882ce6f.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for logistics. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to SUMMER in Korea, May–August: change every visible outdoor deciduous tree to a dense lush green canopy with abundant healthy green leaves. All pink cherry blossoms disappear. Blue summer sky, slightly stronger clear daytime sunlight. No snow and no autumn leaves.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### logistics — autumn

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-logistics-autumn.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-a85a365a-5a96-4bf3-a7b5-c9bdbdd206bd.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for logistics. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to AUTUMN in Korea, September–October: change every visible outdoor deciduous tree to yellow, golden-orange and muted russet autumn foliage. Pink cherry blossoms and summer-green tree canopies disappear. A few fallen leaves may appear outdoors only. Clear mild daytime sky, subtly warmer sunlight. No snow.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

### logistics — winter

Saved path: `/workspace/sites/business-live-editor/.sites-checkout/dist/assets/scene-logistics-winter.png`

Original generated output: `/workspace/scratch/56fed0117126/generated_images/exec-33e9a437-f32b-4cea-b7c1-62210354bf15.png`

Reference: `/workspace/scratch/56fed0117126/generated_images/exec-aee734a3-c938-4034-8708-a525091a4120.png`.

```text
Use case: lighting-weather.
Asset type: exact seasonal variant of a Korean visual novel game background.
Input image: the attached image is the EDIT TARGET and sole architectural reference for logistics. Preserve it as the same physical location.
Primary request: Change ONLY the outdoor season seen through all windows and open doors, and the subtle corresponding daylight color, to WINTER in Korea, November–February: change every visible outdoor deciduous tree to bare leafless branching with a light cap of snow; show clearly visible clean snow covering the outdoor ground, courtyard or loading yard and roof edges. No blossoms or green/yellow deciduous foliage. Pale crisp winter daylight and blue-gray sky. Keep every interior floor clean and snow-free.
Invariants: preserve the exact original wide 16:9 canvas, camera position, framing, perspective, architecture, ceiling, walls, windows and door openings, furnishings, equipment, object counts and placements, surface materials, interior colors, line art, cel shading, and clear foreground character-compositing area. Do not rearrange or invent any indoor items. Keep indoor plants green and unchanged. All exterior buildings and outdoor tree trunk positions must remain exactly the same. Keep the window-frame and doorway geometry exactly unchanged.
Style: retain the source's clean thin blue-gray lines and restrained flat-toned Korean everyday-life visual novel illustration. Change no interior texture or rendering style. This is one image, not a collage or comparison.
Constraints: absolutely no people, animals, letters, numbers, text, labels, logos, UI or watermark.
```

