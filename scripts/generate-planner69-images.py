# -*- coding: utf-8 -*-
"""Generate branded 1200x675 article cover PNGs for planner-69 slugs."""
from __future__ import annotations

import hashlib
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images" / "articles"
OUT.mkdir(parents=True, exist_ok=True)

# import slug list
import importlib.util

spec = importlib.util.spec_from_file_location("m", ROOT / "scripts" / "_planner69_map.py")
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

BG_L = (239, 246, 255)
BG_R = (255, 255, 255)
NAVY = (11, 18, 32)
BLUE = (29, 78, 216)
BLUE_SOFT = (147, 197, 253)
WHITE = (255, 255, 255)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def make_cover(slug: str, cluster: str) -> Path:
    w, h = 1200, 675
    img = Image.new("RGB", (w, h), BG_R)
    draw = ImageDraw.Draw(img)
    for x in range(w):
        c = lerp(BG_L, BG_R, x / (w - 1))
        draw.line([(x, 0), (x, h)], fill=c)

    seed = int(hashlib.md5(slug.encode()).hexdigest()[:8], 16)
    # phone body
    px, py = 680 + (seed % 40), 90 + (seed % 30)
    pw, ph = 280, 500
    draw.rounded_rectangle([px, py, px + pw, py + ph], radius=36, fill=NAVY)
    draw.rounded_rectangle([px + 14, py + 14, px + pw - 14, py + ph - 14], radius=28, fill=WHITE)

    # avatar circle
    cx, cy, r = px + pw // 2, py + 160, 48
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=BLUE)

    # icon by cluster
    icon = cluster
    ix, iy = px + pw // 2, py + 280
    if icon in ("معطل", "حظر"):
        # padlock closed
        draw.rounded_rectangle([ix - 28, iy - 10, ix + 28, iy + 40], radius=8, fill=BLUE)
        draw.arc([ix - 22, iy - 42, ix + 22, iy + 2], 0, 180, fill=BLUE, width=8)
    elif icon in ("اختراق",):
        # shield
        draw.polygon([(ix, iy - 40), (ix + 36, iy - 18), (ix + 28, iy + 36), (ix, iy + 48), (ix - 28, iy + 36), (ix - 36, iy - 18)], fill=BLUE)
    elif icon in ("كلمة سر", "دخول"):
        # key hole
        draw.ellipse([ix - 16, iy - 20, ix + 16, iy + 12], outline=BLUE, width=8)
        draw.rectangle([ix - 5, iy + 8, ix + 5, iy + 40], fill=BLUE)
    elif icon in ("محذوف", "إغلاق"):
        # trash-ish bin
        draw.rectangle([ix - 30, iy - 10, ix + 30, iy + 40], outline=BLUE, width=6)
        draw.line([(ix - 40, iy - 18), (ix + 40, iy - 18)], fill=BLUE, width=6)
    elif icon in ("روابط", "دعم"):
        # link rings
        draw.ellipse([ix - 40, iy - 20, ix - 5, iy + 15], outline=BLUE, width=7)
        draw.ellipse([ix + 5, iy - 20, ix + 40, iy + 15], outline=BLUE, width=7)
    elif icon in ("نشر",):
        # paper plane-ish triangle
        draw.polygon([(ix - 40, iy + 20), (ix + 40, iy), (ix - 40, iy - 20), (ix - 20, iy)], fill=BLUE)
    else:
        # open lock
        draw.rounded_rectangle([ix - 28, iy - 10, ix + 28, iy + 40], radius=8, fill=BLUE)
        draw.arc([ix - 22, iy - 48, ix + 22, iy - 4], 200, 360, fill=BLUE_SOFT, width=8)

    # accent cards left
    draw.rounded_rectangle([120, 220, 320, 340], radius=20, fill=WHITE, outline=BLUE_SOFT, width=3)
    draw.ellipse([150, 250, 210, 310], fill=BLUE_SOFT)
    draw.rounded_rectangle([340, 380, 500, 480], radius=16, fill=WHITE, outline=BLUE_SOFT, width=3)

    path = OUT / f"{slug}.png"
    img.save(path, "PNG", optimize=True)
    return path


def main():
    made = []
    for n, kw, slug, cluster in mod.KEYWORDS:
        p = make_cover(slug, cluster)
        made.append(p.name)
    print(f"generated {len(made)} images in {OUT}")


if __name__ == "__main__":
    main()
