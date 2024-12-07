#!/usr/bin/python
# -*- coding:utf-8 -*-
from pathlib import Path
from drawer.draw import draw
import imagen


url = "http://localhost:3000/dashboard"
result_path = Path("output/dithered_image.png")

imagen.get_image(url, result_path)

print("draw image")
draw("epd7in3f", result_path)
