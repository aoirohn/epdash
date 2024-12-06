#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
from pathlib import Path
from PIL import Image
from . import get_image
from dotenv import load_dotenv

load_dotenv()


def main():
    url = os.getenv('SS_URL')
    result_path = Path("output/dithered_image.png")

    get_image(url, result_path)
    result_img = Image.open(result_path)
    result_img.show()


if __name__ == "__main__":
    main()
