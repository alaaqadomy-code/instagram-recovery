# -*- coding: utf-8 -*-
"""Generate branded 16:9 article cover PNGs for planner slugs."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "articles"
MAP = ROOT / "scripts" / "_planner69_map.py"

# load KEYWORDS from map module without importing package noise
ns: dict = {}
exec(MAP.read_text(encoding="utf-8"), ns)
KEYWORDS = ns["KEYWORDS"]

W, H = 1200, 675
BLUE = (29, 78, 216)  # #1d4ed8
NAVY = (11, 18, 32)
WHITE = (255, 255, 255)
PALE = (239, 246, 255)


def gradient_bg() -> Image.Image:
    img = Image.new("RGB", (W, H), PALE)
    px = img.load()
    for x in range(W):
        t = x / (W - 1)
        r = int(239 + (255 - 239) * t)
        g = int(246 + (255 - 246) * t)
        b = int(255)
        for y in range(H):
            px[x, y] = (r, g, b)
    return img


def draw_phone(draw: ImageDraw.ImageDraw, cx: int, cy: int, scale: float = 1.0) -> None:
    pw, ph = int(160 * scale), int(300 * scale)
    x0, y0 = cx - pw // 2, cy - ph // 2
    r = int(28 * scale)
    draw.rounded_rectangle([x0, y0, x0 + pw, y0 + ph], radius=r, fill=NAVY)
    inset = int(10 * scale)
    draw.rounded_rectangle(
        [x0 + inset, y0 + inset, x0 + pw - inset, y0 + ph - inset],
        radius=int(18 * scale),
        fill=WHITE,
    )
    # avatar circle
    ax, ay = cx, cy - int(40 * scale)
    ar = int(28 * scale)
    draw.ellipse([ax - ar, ay - ar, ax + ar, ay + ar], fill=BLUE)
    # lock / key mark
    lx, ly = cx, cy + int(50 * scale)
    lr = int(18 * scale)
    draw.ellipse([lx - lr, ly - lr, lx + lr, ly + lr], outline=BLUE, width=max(3, int(4 * scale)))
    draw.rectangle([lx - int(6 * scale), ly, lx + int(6 * scale), ly + int(22 * scale)], fill=BLUE)


ICONS = {
    "استرجاع": "unlock",
    "معطل": "ban",
    "اختراق": "shield",
    "دخول": "key",
    "كلمة سر": "key",
    "محذوف": "trash",
    "حظر": "ban",
    "روابط": "link",
    "دعم": "chat",
    "إغلاق": "pause",
    "نشر": "signal",
}


def draw_icon(draw: ImageDraw.ImageDraw, kind: str, x: int, y: int) -> None:
    if kind in ("unlock", "key"):
        draw.ellipse([x - 22, y - 22, x + 22, y + 22], outline=BLUE, width=5)
        draw.rectangle([x - 8, y, x + 8, y + 28], fill=BLUE)
    elif kind == "ban":
        draw.ellipse([x - 26, y - 26, x + 26, y + 26], outline=BLUE, width=5)
        draw.line([x - 18, y + 18, x + 18, y - 18], fill=BLUE, width=5)
    elif kind == "shield":
        draw.polygon([(x, y - 30), (x + 28, y - 10), (x + 22, y + 28), (x, y + 36), (x - 22, y + 28), (x - 28, y - 10)], fill=BLUE)
        draw.ellipse([x - 8, y - 4, x + 8, y + 12], fill=WHITE)
    elif kind == "link":
        draw.arc([x - 30, y - 12, x - 2, y + 16], 40, 320, fill=BLUE, width=5)
        draw.arc([x + 2, y - 12, x + 30, y + 16], 220, 140, fill=BLUE, width=5)
        draw.line([x - 8, y + 2, x + 8, y + 2], fill=BLUE, width=5)
    elif kind == "chat":
        draw.rounded_rectangle([x - 28, y - 20, x + 28, y + 16], radius=10, fill=BLUE)
        draw.polygon([(x - 6, y + 16), (x + 10, y + 16), (x - 10, y + 30)], fill=BLUE)
    elif kind == "trash":
        draw.rectangle([x - 18, y - 8, x + 18, y + 28], outline=BLUE, width=5)
        draw.line([x - 24, y - 14, x + 24, y - 14], fill=BLUE, width=5)
        draw.line([x - 8, y - 22, x + 8, y - 22], fill=BLUE, width=5)
    elif kind == "pause":
        draw.rectangle([x - 16, y - 24, x - 4, y + 24], fill=BLUE)
        draw.rectangle([x + 4, y - 24, x + 16, y + 24], fill=BLUE)
    else:  # signal
        for i, h in enumerate((16, 28, 40)):
            bx = x - 24 + i * 18
            draw.rectangle([bx, y + 24 - h, bx + 12, y + 24], fill=BLUE)


def make_cover(slug: str, cluster: str, idx: int) -> None:
    img = gradient_bg()
    draw = ImageDraw.Draw(img)
    # slight offset per index for variety
    ox = 40 + (idx % 5) * 8
    oy = (idx % 3) * 6
    draw_phone(draw, 820 + ox // 2, 340 + oy, scale=1.05)
    icon = ICONS.get(cluster, "unlock")
    draw_icon(draw, icon, 980 + (idx % 4) * 3, 200 + (idx % 5) * 4)
    # soft side cards
    draw.rounded_rectangle([700, 480, 780, 560], radius=12, fill=BLUE)
    draw.rounded_rectangle([790, 500, 860, 560], radius=12, outline=BLUE, width=4)
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{slug}.png"
    img.save(path, "PNG", optimize=True)
    print(path.name)


def main() -> None:
    for n, _kw, slug, cluster in KEYWORDS:
        make_cover(slug, cluster, n)
    print("done", len(KEYWORDS))


if __name__ == "__main__":
    main()
