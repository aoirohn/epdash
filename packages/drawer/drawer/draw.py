from PIL import Image
import epaper
from os import PathLike


def draw(model: str, img_path: PathLike):
    try:
        epd = epaper.epaper(model).EPD()
        epd.init()
        draw_img = Image.open(img_path)
        epd.display(epd.getbuffer(draw_img))
        epd.sleep()

    except IOError as e:
        print(e)

    except KeyboardInterrupt:
        epaper.epaper(model).epdconfig.module_exit(cleanup=True)
        exit()


def clear(model: str):
    try:
        epd = epaper.epaper(model).EPD()
        epd.init()
        epd.Clear()
        epd.sleep()

    except IOError as e:
        print(e)

    except KeyboardInterrupt:
        epaper.epaper(model).epdconfig.module_exit(cleanup=True)
        exit()
