#!/usr/bin/env python3
import sys
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
paths = [ROOT / '.github' / 'agents', ROOT / '.github' / 'prompts']

warns = []
for p in paths:
    if not p.exists():
        continue
    for f in sorted(p.glob('*.md')):
        text = f.read_text(encoding='utf-8')
        # find YAML frontmatter markers '---' on their own lines
        matches = [m.start() for m in re.finditer(r"(?m)^---\s*$", text)]
        if len(matches) < 2:
            warns.append(f"{f}: missing frontmatter start/end '---'")
            continue
        start = matches[0]
        end = matches[1]
        fm = text[start + 3:end]
        if 'name:' not in fm:
            warns.append(f"{f}: frontmatter missing 'name:'")
        # agents should have tools key
        if 'agent' in f.name and 'tools:' not in fm:
            warns.append(f"{f}: agent frontmatter missing 'tools:'")
        if 'mode:' in fm:
            warns.append(f"{f}: deprecated 'mode' in frontmatter")

if warns:
    print('Warnings detected:')
    for w in warns:
        print('- ' + w)
    sys.exit(2)
print('No warnings detected')
sys.exit(0)
