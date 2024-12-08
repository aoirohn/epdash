#!/usr/bin/python
# -*- coding:utf-8 -*-
from pathlib import Path
from imagen.reduceColor import reduce_color_for_epd_7in3f
from imagen.getImage import get_url_image
from PIL import Image
from os import PathLike


def get_image(url: str, result_path: PathLike):
    print("get image from :", url)
    img_path = Path("output/dashboard.png")
    get_url_image(url, img_path.parent, img_path.name)
    image = Image.open(img_path)

    print("reducing image")

    dithered_image = reduce_color_for_epd_7in3f(image)
    dithered_image.save(Path(result_path))

    print("image saved to :", result_path)
