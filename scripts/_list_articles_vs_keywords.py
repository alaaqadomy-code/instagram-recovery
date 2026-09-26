# -*- coding: utf-8 -*-
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
articles_dir = root / "lib" / "articles"
kw_path = root / "docs" / "keywords" / "instagram-recovery-keyword-planner.md"

titles = []
slugs = []
for p in sorted(articles_dir.glob("*.ts")):
    if p.name == "types.ts":
        continue
    t = p.read_text(encoding="utf-8")
    titles += re.findall(r'title:\s*"([^"]+)"', t)
    slugs += re.findall(r'slug:\s*"([^"]+)"', t)

kw_text = kw_path.read_text(encoding="utf-8")
keywords = []
for line in kw_text.splitlines():
    m = re.match(r"\|\s*(\d+)\s*\|\s*([^|]+)\|", line)
    if m:
        keywords.append((int(m.group(1)), m.group(2).strip()))

print("articles", len(titles))
print("keywords", len(keywords))
print("---KEYWORDS---")
for n, k in keywords:
    print(f"{n}\t{k}")
print("---TITLES---")
for s, t in zip(slugs, titles):
    print(f"{s}\t{t}")
