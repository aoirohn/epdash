# from html2image import Html2Image
from pathlib import Path
from os import PathLike
from socket import timeout
from playwright.sync_api import sync_playwright

CHROMIUM_FLAGS = [
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-setuid-sandbox",
    "--no-first-run",
    "--no-sandbox",
    "--no-zygote",
    "--single-process",
    "--disable-audio-output",
    "--disable-background-timer-throttling"
    "--disable-backgrounding-occluded-windows"
    "--disable-breakpad",
    "--disable-extensions",
    "--disable-sync",
    "--disable-translate",
    # '--virtual-time-budget=10000'
]


def get_url_image(url: str, dir: PathLike, name: str):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, args=CHROMIUM_FLAGS)
        context = browser.new_context(
            viewport={"width": 800, "height": 480},
            device_scale_factor=2,
        )

        page = context.new_page()
        page.goto(url)
        page.screenshot(path=str(Path(dir) / name), full_page=True, timeout=50000)
        browser.close()


# def get_image(url: str, dir: PathLike, name: str):
#     hti = Html2Image(
#         size=(800 * 2, 480 * 2),
#         output_path=str(Path(dir)),
#         custom_flags=CHROMIUM_FLAGS,
#     )

#     # hti.screenshot(url="http://localhost:5173/dashboard", save_as=str(Path(name)))
#     hti.screenshot(
#         url=url,
#         save_as=str(Path(name)),
#         # css_str=[
#         #     "body {background-color: red;}",
#         #     "body {transform: matrix(2, 0, 0, 2, 0, 0)}",
#         # ],
#         css_str=["body {background: red;}", "body {font-size: 50px;}"],
#     )
