# -*- coding: utf-8 -*-
"""Map 69 planner keywords to existing articles; list gaps."""
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
articles_dir = root / "lib" / "articles"
kw_path = root / "docs" / "keywords" / "instagram-recovery-keyword-planner.md"
out = root / "docs" / "keywords" / "_gap-map.md"

# parse keywords
keywords = []
for line in kw_path.read_text(encoding="utf-8").splitlines():
    m = re.match(r"\|\s*(\d+)\s*\|\s*([^|]+)\|", line)
    if m:
        keywords.append((int(m.group(1)), m.group(2).strip()))

# parse articles
arts = []
for p in sorted(articles_dir.glob("*.ts")):
    if p.name == "types.ts":
        continue
    t = p.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*make\(\{", t)[1:]
    for b in blocks:
        slug = re.search(r'slug:\s*"([^"]+)"', b)
        title = re.search(r'title:\s*"([^"]+)"', b)
        kws = re.search(r"keywords:\s*\[([^\]]+)\]", b)
        body = " ".join(re.findall(r'"([^"]{20,})"', b))
        words = len(re.findall(r"\S+", body))
        kw_list = []
        if kws:
            kw_list = re.findall(r'"([^"]+)"', kws.group(1))
        if slug and title:
            arts.append(
                {
                    "slug": slug.group(1),
                    "title": title.group(1),
                    "keywords": kw_list,
                    "words": words,
                    "file": p.name,
                }
            )


def normalize(s: str) -> str:
    s = s.strip().lower()
    for a, b in [
        ("إ", "ا"),
        ("أ", "ا"),
        ("آ", "ا"),
        ("ة", "ه"),
        ("ى", "ي"),
        ("ؤ", "و"),
        ("ئ", "ي"),
        ("ـ", ""),
    ]:
        s = s.replace(a, b)
    s = re.sub(r"\s+", " ", s)
    return s


def score(keyword: str, art: dict) -> int:
    nk = normalize(keyword)
    hay = normalize(art["title"] + " " + " ".join(art["keywords"]))
    if nk == normalize(art["title"]):
        return 100
    if nk in hay:
        return 80
    # token overlap
    kt = set(nk.split())
    ht = set(hay.split())
    if not kt:
        return 0
    overlap = len(kt & ht) / len(kt)
    if overlap >= 0.7:
        return int(70 * overlap)
    if overlap >= 0.5:
        return int(50 * overlap)
    return 0


lines = ["# فجوة الكلمات الـ69 مقابل المقالات", "", f"مقالات موجودة: {len(arts)}", ""]
covered = []
gaps = []
for n, kw in keywords:
    best = max(arts, key=lambda a: score(kw, a))
    sc = score(kw, best)
    if sc >= 70:
        covered.append((n, kw, best, sc))
        lines.append(f"- **{n}. {kw}** → موجود تقريباً: `{best['slug']}` ({best['words']} كلمة، درجة {sc})")
    else:
        gaps.append((n, kw, best, sc))
        lines.append(
            f"- **{n}. {kw}** → ناقص (أقرب: `{best['slug']}` درجة {sc}, {best['words']} كلمة)"
        )

lines += ["", f"## ملخص", f"- مغطى ≥70: {len(covered)}", f"- ناقص: {len(gaps)}", ""]
lines.append("## الناقص فقط")
for n, kw, best, sc in gaps:
    lines.append(f"{n}. {kw}")

out.write_text("\n".join(lines), encoding="utf-8")
print(f"covered={len(covered)} gaps={len(gaps)} wrote={out}")
