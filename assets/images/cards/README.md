# Karten-Grafiken

Alle Spielkarten als PNG, umbenannt auf web-sichere ASCII-Slugs (keine Leerzeichen,
Umlaute oder Klammern – wichtig für GitHub Pages).

## Namens-Konvention

Jeder Charakter erscheint mit zwei Kartenseiten:

| Suffix         | Kartentyp           | Erkennungsmerkmal auf der Karte                    |
|----------------|---------------------|----------------------------------------------------|
| `…-staerke.png`| Kämpfer-Karte       | Stärke + Gäng-Name oben links (z. B. „8 Bronko")   |
| `…-lp.png`     | Schläger-Karte (LP) | „X LP" oben, **Charakter-Name** unten              |

Beispiel: `der-baenker-staerke.png` (Stärke „2 Cobra") und `der-baenker-lp.png` („4 LP").

Die zwei Spezial-Charaktere haben nur **eine** Karte (kein LP-Pendant):
`dr-nar-kose.png`, `duenenwolf.png`.

> Hinweis: Das Original-Paar „Riemenpiedler" war umgekehrt benannt
> (`Riemenpiedlers.png` = Stärke, `Riemenpiedler.png` = LP) und wurde korrekt zugeordnet.

## `special/` – Token- & Spielkarten (keine Charaktere)

- `bronko-blut.png`  – Bronko-Blut-Karte (geht an den Rundensieger)
- `donko-haufen.png` – Donko-Haufen-Karte (markiert den Donko)
- `mit-weste.png`    – Weste-Karte, Seite „Mit Weste kämpfen!"
- `ohne-weste.png`   – Weste-Karte, Seite „Ohne Weste kämpfen!"
- `flucht-1.png` … `flucht-3.png` – die drei Fluchtkarten
- `orden.png`, `orden-2.png` … `orden-5.png` – die fünf Bronko-Orden
- `rueckseite.png`   – Kämpfer-Rückseite (B&D-Logo)
- `rueckseite-lp.png`– Schläger-Rückseite (Faust)
