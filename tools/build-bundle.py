#!/usr/bin/env python3
"""Baut die Skript-Bündel für RR25.

Die Quelldateien bleiben einzeln im Repo. Dieses Skript hängt sie in genau der
bisherigen Ladereihenfolge aneinander:

  app-bundle-1.js  = alles vor ritual-buch.js
  ritual-buch.js   = bleibt eine eigene Datei (Buch unverändert)
  app-bundle-2.js  = alles nach ritual-buch.js

Dateien, die nur aus einer Funktion bestehen, die sich selbst aufruft
((function(){ ... })();), werden in try/catch gesetzt: ein Fehler in einem Teil
stoppt dann nicht den Rest, wie früher bei einzelnen Skript-Tags. Alle anderen
Dateien (mit globalen const/let/function) werden unverändert angehängt, damit
die gemeinsamen globalen Namen gleich bleiben.

Aufruf:  python3 tools/build-bundle.py          (schreibt die Bündel)
         python3 tools/build-bundle.py --stamp  (zusätzlich ?v=<hash> in index.html)
"""
import hashlib, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BUNDLES = {
    "app-bundle-1.js": [
        "doll.js", "ritual-core.js", "rituals-v2.js", "ritual-runner-v2.js", "ritual-karten.js",
        "ritual-sigil.js", "ritual-log.js", "ritual-notes.js", "ritual-plus.js", "ritual-nav.js",
        "ritual-layout.js", "ritual-look.js", "ritual-extra.js", "ritual-zahl.js", "ritual-home.js",
        "ritual-backup.js", "pwa.js", "ritual-log-fix.js", "ritual-polish.js", "ritual-mond.js",
        "ritual-skizze.js", "ritual-fotos.js", "ritual-gpic.js", "ritual-kalender.js", "ritual-start.js",
    ],
    # ritual-buch.js wird dazwischen einzeln geladen
    "app-bundle-2.js": [
        "ritual-navlove.js", "ritual-final.js", "ritual-gabe-fix.js", "ritual-plan.js", "ritual-hold.js",
        "ritual-cam.js", "ritual-sigil-save.js", "ritual-more.js", "ritual-fein.js", "ritual-check.js",
        "ritual-ui-v2.js", "ritual-v3.js",
    ],
}

KEYWORDS_BEFORE_REGEX = {"return", "typeof", "case", "do", "else", "in", "of", "new", "delete", "void", "throw", "instanceof", "yield", "await"}


def top_level_shape(src):
    """Liefert die Zeichen auf oberster Ebene (Klammern mitgezählt), ohne Kommentare,
    Strings, Template-Strings und reguläre Ausdrücke. Für eine reine IIFE ergibt das
    z. B. '()();'."""
    out = []
    depth = 0
    i, n = 0, len(src)
    last = ""  # letztes bedeutsames Token (für die Regex-Erkennung)
    stack = []
    while i < n:
        c = src[i]
        if c in " \t\r\n":
            i += 1
            continue
        if src.startswith("//", i):
            j = src.find("\n", i)
            i = n if j < 0 else j + 1
            continue
        if src.startswith("/*", i):
            j = src.find("*/", i + 2)
            if j < 0:
                raise ValueError("Kommentar nicht geschlossen")
            i = j + 2
            continue
        if c in "\"'":
            j = i + 1
            while j < n and src[j] != c:
                if src[j] == "\\":
                    j += 1
                elif src[j] == "\n":
                    raise ValueError("String nicht geschlossen")
                j += 1
            i = j + 1
            last = "str"
            if depth == 0:
                out.append("s")
            continue
        if c == "`":
            # Template-String; ${ ... } kann verschachtelt sein
            j = i + 1
            while j < n and src[j] != "`":
                if src[j] == "\\":
                    j += 2
                    continue
                if src.startswith("${", j):
                    k, d = j + 2, 1
                    while k < n and d:
                        if src[k] == "{":
                            d += 1
                        elif src[k] == "}":
                            d -= 1
                        elif src[k] in "\"'`":
                            q = src[k]
                            k += 1
                            while k < n and src[k] != q:
                                if src[k] == "\\":
                                    k += 1
                                k += 1
                        k += 1
                    j = k
                    continue
                j += 1
            i = j + 1
            last = "str"
            if depth == 0:
                out.append("s")
            continue
        if c == "/":
            regex = last == "" or last in "(,=:[!&|?{};+-*%<>~^" or last in KEYWORDS_BEFORE_REGEX
            if regex:
                j, cls = i + 1, False
                while j < n:
                    if src[j] == "\\":
                        j += 2
                        continue
                    if src[j] == "[":
                        cls = True
                    elif src[j] == "]":
                        cls = False
                    elif src[j] == "/" and not cls:
                        break
                    elif src[j] == "\n":
                        raise ValueError("Regex nicht geschlossen")
                    j += 1
                j += 1
                while j < n and (src[j].isalnum()):
                    j += 1
                i = j
                last = "re"
                if depth == 0:
                    out.append("r")
                continue
        if c.isalnum() or c in "_$":
            j = i
            while j < n and (src[j].isalnum() or src[j] in "_$"):
                j += 1
            word = src[i:j]
            if depth == 0:
                out.append(" " + word + " ")
            last = word
            i = j
            continue
        if c in "([{":
            if depth == 0:
                out.append(c)
            stack.append(c)
            depth += 1
            last = c
            i += 1
            continue
        if c in ")]}":
            if not stack:
                raise ValueError("Klammer zu viel")
            stack.pop()
            depth -= 1
            if depth == 0:
                out.append(c)
            last = c
            i += 1
            continue
        if depth == 0:
            out.append(c)
        last = c
        i += 1
    if stack:
        raise ValueError("Klammer offen")
    return "".join(out).replace(" ", "")


def is_iife_only(src):
    shape = top_level_shape(src)
    return re.fullmatch(r"(;*[!]?\(\)\(\);?)+;*", shape) is not None, shape


def build(stamp=False):
    hashes = {}
    for bundle, parts in BUNDLES.items():
        chunks = ["/* %s — automatisch gebaut von tools/build-bundle.py. Nicht von Hand ändern; Quellen sind die einzelnen Dateien. */\n" % bundle]
        for name in parts:
            with open(os.path.join(ROOT, name), encoding="utf-8") as f:
                src = f.read()
            wrap, shape = is_iife_only(src)
            if not src.endswith("\n"):
                src += "\n"
            if wrap:
                chunks.append("/* ==== %s ==== */\ntry{\n%s}catch(e){ try{ console.error(\"rr25: %s\", e); }catch(x){} }\n;\n" % (name, src, name))
            else:
                chunks.append("/* ==== %s (global) ==== */\n%s;\n" % (name, src))
            print("  %-22s %s" % (name, "try/catch" if wrap else "global  " + shape[:40]))
        data = "".join(chunks)
        with open(os.path.join(ROOT, bundle), "w", encoding="utf-8") as f:
            f.write(data)
        hashes[bundle] = hashlib.sha256(data.encode("utf-8")).hexdigest()[:10]
        print("%s: %d Teile, %d Bytes, %s" % (bundle, len(parts), len(data.encode("utf-8")), hashes[bundle]))
    if stamp:
        p = os.path.join(ROOT, "index.html")
        with open(p, encoding="utf-8") as f:
            html = f.read()
        for bundle, hsh in hashes.items():
            html, k = re.subn(r'src="%s\?v=[^"]*"' % re.escape(bundle), 'src="%s?v=%s"' % (bundle, hsh), html)
            if k != 1:
                raise SystemExit("index.html: %s nicht genau einmal gefunden" % bundle)
        with open(p, "w", encoding="utf-8") as f:
            f.write(html)
        print("index.html gestempelt")


if __name__ == "__main__":
    build(stamp="--stamp" in sys.argv)
