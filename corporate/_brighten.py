# Brighten team.jpg to approximate the original "bright" version
# Apply: linear brightness boost + slight curves + gamma + saturation
from PIL import Image, ImageEnhance, ImageFilter, ImageOps
import os

src = "assets/team.jpg"
out = "assets/team_bright.jpg"

img = Image.open(src).convert("RGB")
print(f"input: {img.size}  mode={img.mode}")

# Step 1: lift shadows via gamma correction (gamma < 1 brightens darks)
# Manually build a LUT: out = ((in/255)^gamma) * 255
gamma = 0.55  # aggressive shadow lift
lut = [int(((i / 255.0) ** gamma) * 255) for i in range(256)]
lut = lut * 3  # RGB
img = img.point(lut)

# Step 2: brightness boost
img = ImageEnhance.Brightness(img).enhance(1.18)

# Step 3: contrast (slight to keep depth after shadow lift)
img = ImageEnhance.Contrast(img).enhance(0.96)

# Step 4: saturation (compensate for brightening washing colors)
img = ImageEnhance.Color(img).enhance(1.15)

# Step 5: slight sharpness
img = ImageEnhance.Sharpness(img).enhance(1.15)

# Save as JPG with high quality
img.save(out, "JPEG", quality=92, optimize=True)
print(f"saved: {out}  size={os.path.getsize(out)} bytes")
