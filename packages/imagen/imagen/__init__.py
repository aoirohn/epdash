#!/usr/bin/python
# -*- coding:utf-8 -*-
from PIL import Image
from imagen.reduceColor import reduce_color_for_epd_7in3f
from imagen.getImage import get_url_image


def get_dithered_image(url: str) -> Image.Image:
    print("get image from :", url)
    image = get_url_image(url)

    print("reducing image")
    dithered_image = reduce_color_for_epd_7in3f(image)

    return dithered_image
