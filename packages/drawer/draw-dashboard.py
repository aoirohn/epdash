#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
from drawer.draw import draw
import imagen
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("DASHBOARD_URL")

img = imagen.get_dithered_image(url)

print("draw image")
draw("epd7in3f", img)
