#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
from pathlib import Path

from imagen.getImage import get_url_image
from imagen.reduceColor import reduce_color_for_epd_7in3f
from dotenv import load_dotenv

load_dotenv()


def main():
    url = os.getenv("DASHBOARD_URL")

    if url is None:
        print("Please set DASHBOARD_URL in .env file")
        return

    image = get_url_image(url)
    # image.show()
    image.save(Path("output/dashboard.png"))

    print("reducing image")
    dithered_image = reduce_color_for_epd_7in3f(image)

    dithered_image.show()

    out_path = Path("output/dithered_image.png")
    os.makedirs(out_path.parent, exist_ok=True)
    dithered_image.save(out_path)


if __name__ == "__main__":
    main()
