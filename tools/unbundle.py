#!/usr/bin/env python3
"""rr25 · Gegenstück zu bundle.py (seit Build 109): schreibt die Quelldateien aus den Paketen zurück.
Nur nötig, wenn ein Paket von Hand geändert wurde. Danach ergibt `python3 tools/bundle.py` wieder dieselben Pakete."""
import os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from bundle import PAKETE, OHNE_HUELLE, ROOT

def main():
    for i, dateien in enumerate(PAKETE, 1):
        s = open(os.path.join(ROOT, "bundle-%d.js" % i), encoding="utf-8").read()
        for k, d in enumerate(dateien):
            a = s.index("/* ==== %s ==== */\n" % d) + len("/* ==== %s ==== */\n" % d)
            e = s.index("/* ==== %s ==== */\n" % dateien[k+1]) if k+1 < len(dateien) else len(s)
            body = s[a:e]
            if d in OHNE_HUELLE or not (body.startswith("try{\n") and body.endswith("\n}catch(e){setTimeout(function(){throw e;});}\n")):
                assert body.endswith("\n;\n"), d; src = body[:-3]
            else:
                pre, post = "try{\n", "\n}catch(e){setTimeout(function(){throw e;});}\n"
                assert body.startswith(pre) and body.endswith(post), d
                src = body[len(pre):-len(post)]
            open(os.path.join(ROOT, d), "w", encoding="utf-8", newline="\n").write(src)
    print("Quellen aus %d Paketen geschrieben" % len(PAKETE))

if __name__ == "__main__":
    sys.exit(main())
