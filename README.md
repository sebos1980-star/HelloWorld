# Bronko-Donko Website

Statische Website für das Kartenspiel **Bronko-Donko**. Migriert vom Ionos-WordPress-Webbaukasten zu einer eigenständigen Static Site, deployt über GitHub Pages.

## Struktur

```
/                              Startseite
/hofregeln/                    Spielregeln (QR-Code-Ziel — URL stabil halten!)
/impressum/                    Impressum
/datenschutzerklarung/         Datenschutzerklärung
/story/                        Backgroundstory (nur Footer-Link)
/404.html                      404-Seite
/css/styles.css                Globales Stylesheet
/js/app.js                     Mobile-Nav + Smooth-Scroll
/assets/images/                Logo + Platzhalter-Grafiken
/CNAME                         Custom-Domain-Datei (bronko-donko.com)
```

## Lokal testen

```bash
python3 -m http.server 8000
```

Dann http://localhost:8000/ im Browser öffnen.

Wichtig: `/hofregeln/` muss mit Trailing-Slash funktionieren — der QR-Code auf der Spielverpackung verlinkt genau dorthin.

## Design

- Schwarzer Hintergrund (`#000000`)
- Silberne Schrift (`#c0c0c0`)
- Akzent-Rot (`#ed130d`)
- Akzent-Gelb (`#f2c200`)
- Headlines: Patua One · Body: Nunito (beide via Google Fonts)

Farben werden als CSS-Variablen in `:root` gepflegt — Anpassungen an einem Ort.

## Deploy

### Schritt 1: GitHub Pages aktivieren (gleich)

1. Auf GitHub das Repo öffnen → **Settings** → **Pages**.
2. **Source**: `Deploy from a branch` · **Branch**: `main` · **Folder**: `/ (root)`.
3. Speichern. Nach 1–2 Minuten ist die Seite unter `https://<dein-user>.github.io/<repo-name>/` erreichbar.

Wichtig: solange das Repo `HelloWorld` heißt, läuft die Vorschau auf einem Subpfad (`…/HelloWorld/`). Die internen Links benutzen relative Pfade, daher funktioniert das. Optional: Repo später umbenennen in `bronko-donko`.

### Schritt 2: Custom Domain (bronko-donko.com) — später

Wenn die Seite live gehen soll:

1. Bei **Ionos** die DNS-Einträge für `bronko-donko.com` umstellen — `A`-Records auf GitHub-Pages-IPs (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`) und `CNAME` für `www` auf `<dein-user>.github.io`. Siehe [GitHub-Doku](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
2. Auf GitHub: **Settings** → **Pages** → **Custom domain**: `bronko-donko.com` eintragen und speichern. GitHub legt automatisch eine `CNAME`-Datei im Repo an.
3. **Enforce HTTPS** anhaken, sobald DNS verifiziert ist.

**Wichtig: NICHT** über eine Ionos-Weiterleitung zur GitHub-Pages-URL leiten — das ändert oder verliert den Pfad. `/hofregeln/` muss als URL erhalten bleiben (QR-Code auf der Verpackung).

## Status

- Dummy-Spielregeln (echte Texte folgen)
- Platzhalter-Grafiken für Gangs/Charaktere (echte Bilder folgen)
- Bestellen + Hall of Fame entfernt
