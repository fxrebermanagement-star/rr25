#!/usr/bin/env python3
"""Deterministischer Bündler für rr25.
Reihenfolge der Skripte steht in tools/bundle-order.txt (entspricht den früheren <script src> in index.html).
3 Bündel: vor pwa.js / bis design-v3.js / Rest; jedes Stück mit Kommentar-Kopf und ';' als Trenner.
Aufruf im Repo-Wurzelverzeichnis: python3 tools/bundle.py  -> schreibt bundle-a.js, bundle-b.js, bundle-c.js.
Nach jeder Änderung an einer Einzeldatei neu ausführen (Originaldateien bleiben die Quelle)."""
import os, sys
root = sys.argv[1] if len(sys.argv) > 1 else "."
srcs = [l.strip() for l in open(os.path.join(root, "tools", "bundle-order.txt"), encoding="utf-8") if l.strip()]
cut1, cut2 = srcs.index("pwa.js"), srcs.index("design-v3.js") + 1
groups = {"bundle-a.js": srcs[:cut1], "bundle-b.js": srcs[cut1:cut2], "bundle-c.js": srcs[cut2:]}
for name, files in groups.items():
    parts = []
    for f in files:
        code = open(os.path.join(root, f), encoding="utf-8").read()
        parts.append("/* ==== " + f + " ==== */\n" + code.rstrip() + "\n;\n")
    open(os.path.join(root, name), "w", encoding="utf-8", newline="\n").write("".join(parts))
    print(name, len(files), "Dateien", sum(len(p.encode()) for p in parts), "Bytes")
