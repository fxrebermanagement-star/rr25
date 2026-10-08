#!/usr/bin/env python3
"""rr25 · Skript-Pakete erzeugen (seit Build 46).

index.html lädt statt ~50 einzelner Skripte nur noch die Pakete bundle-1.js … bundle-7.js.
Jedes Paket ist die unveränderte Aneinanderreihung der Quelldateien in genau der alten Ladereihenfolge.
Die Quelldateien bleiben im Repo und sind die Stelle, an der man ändert. Danach dieses Skript laufen lassen:

    python3 tools/bundle.py

Regeln, damit sich am Verhalten nichts ändert:
- Dateien, die nur aus (function(){ … })(); bestehen, bekommen eine try/catch-Hülle. Ein Fehler in einer Datei
  stoppt so wie früher nur diese Datei, nicht den Rest des Pakets (der Fehler wird danach trotzdem gemeldet).
- Dateien mit globalen Deklarationen (const/let/function auf oberster Ebene) bleiben ohne Hülle, sonst wären ihre
  Namen nicht mehr global.
- Zwei Dateien, die dieselbe globale Funktion deklarieren (paintLog, paintNotes, openPicPicker), liegen in
  verschiedenen Paketen: Funktionsdeklarationen gelten im ganzen Skript ab Beginn, in einem gemeinsamen Paket
  würde die spätere die frühere schon vor deren Lauf ersetzen.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAKETE = [
    ["doll.js", "ritual-core.js", "ritual-mondphase.js", "ritual-zeit.js", "rituals-v2.js"],
    ["ritual-runner-v2.js", "ritual-karten.js"],
    ["ritual-sigil.js", "ritual-log.js", "ritual-notes.js", "ritual-plus.js", "ritual-nav.js", "ritual-layout.js",
     "ritual-look.js", "ritual-extra.js", "ritual-zahl.js", "ritual-home.js", "ritual-backup.js", "pwa.js",
     "ritual-log-fix.js", "ritual-polish.js", "ritual-mond.js", "ritual-skizze.js"],
    ["ritual-fotos.js", "ritual-gpic.js", "ritual-kalender.js", "ritual-start.js", "ritual-buch.js",
     "ritual-navlove.js", "ritual-final.js", "ritual-gabe-fix.js"],
    ["ritual-plan.js", "ritual-hold.js", "ritual-cam.js", "ritual-sigil-save.js", "ritual-more.js", "ritual-fein.js",
     "ritual-check.js", "ritual-ui-v2.js", "ritual-v3.js"],
    ["design-v3.js", "ritual-chronik-grau.js", "ritual-ton.js", "ritual-saison.js", "ritual-resonanzen.js"],
    ["ritual-sichern.js", "ritual-gerechnet.js", "ritual-rueckblick.js", "ritual-erinnern.js"],
]

# Dateien mit globalen Deklarationen: ohne Hülle
OHNE_HUELLE = {"ritual-core.js", "ritual-log.js", "ritual-notes.js", "ritual-plus.js", "ritual-cam.js"}


def lies(name):
    with open(os.path.join(ROOT, name), encoding="utf-8") as f:
        return f.read()


def main():
    build = re.search(r"var BUILD=(\d+);", lies("pwa.js")).group(1)
    n = len(PAKETE)
    for i, dateien in enumerate(PAKETE, 1):
        teile = ["/* rr25 · Paket %d/%d · Build %s · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:\n"
                 "   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: %s */\n"
                 % (i, n, build, ", ".join(dateien))]
        for d in dateien:
            src = lies(d)
            if d in OHNE_HUELLE:
                teile.append("/* ==== %s ==== */\n%s\n;\n" % (d, src))
            else:
                teile.append("/* ==== %s ==== */\ntry{\n%s\n}catch(e){setTimeout(function(){throw e;});}\n" % (d, src))
        with open(os.path.join(ROOT, "bundle-%d.js" % i), "w", encoding="utf-8", newline="\n") as f:
            f.write("".join(teile))
    alle = [d for p in PAKETE for d in p]
    print("Build %s: %d Pakete aus %d Dateien" % (build, n, len(alle)))


if __name__ == "__main__":
    sys.exit(main())
