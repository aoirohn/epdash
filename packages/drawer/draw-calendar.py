#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
from pathlib import Path
from drawer.draw import draw
import imagen
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SS_URL")
result_path = Path("output/dithered_image.png")

imagen.get_image(url, result_path)

print("draw image")
draw("epd7in3f", result_path)
