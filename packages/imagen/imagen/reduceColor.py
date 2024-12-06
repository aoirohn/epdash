from PIL import Image
import numpy as np


def reduce_color_for_epd_7in3f(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize((800, 480))

    EPAPER_PALETTE = np.array(
        [
            [255, 0, 0],  # Red
            [0, 255, 0],  # Green
            [0, 0, 255],  # Blue
            [255, 255, 0],  # Yellow
            [255, 128, 0],  # Orange
            [0, 0, 0],  # Black
            [255, 255, 255],  # White
        ]
    )

    palimage = Image.new("P", (16, 16))
    palimage.putpalette(list(EPAPER_PALETTE.flatten()))

    return reduce_color(image, palimage)


def reduce_color(image: Image.Image, palette: Image.Image):
    return image.quantize(palette=palette, dither=Image.Dither.FLOYDSTEINBERG)
