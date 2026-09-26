# -*- coding: utf-8 -*-
import re
from pathlib import Path

root = Path(r"c:/Users/JCC/instagram-recovery/projects/instagram-recovery/lib/articles")
for name in ["planner-a", "planner-b", "planner-c", "planner-d"]:
    p = root / f"{name}.ts"
    if not p.exists():
        print(name, "MISSING")
        continue
    t = p.read_text(encoding="utf-8")
    slugs = re.findall(r'slug:\s*"([^"]+)"', t)
    print(name, "slugs", len(slugs), "bytes", p.stat().st_size)
    print("  first", slugs[0] if slugs else None, "last", slugs[-1] if slugs else None)
