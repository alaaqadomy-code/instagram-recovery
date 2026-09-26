# -*- coding: utf-8 -*-
"""Detect duplicate article slugs across all article modules."""
import re
from collections import Counter
from pathlib import Path

root = Path(r"c:/Users/JCC/instagram-recovery/projects/instagram-recovery/lib/articles")
slugs = []
for p in root.glob("*.ts"):
    if p.name == "types.ts":
        continue
    for s in re.findall(r'slug:\s*"([^"]+)"', p.read_text(encoding="utf-8")):
        slugs.append((s, p.name))

counts = Counter(s for s, _ in slugs)
dups = [s for s, n in counts.items() if n > 1]
print("total", len(slugs), "unique", len(counts), "dups", len(dups))
for s in dups:
    files = [f for slug, f in slugs if slug == s]
    print("DUP", s, files)
