# Bronko-Donko Website

Statische Website für das Kartenspiel **Bronko-Donko**. Deployt über GitHub Pages.

## Struktur

```
/                              Startseite
/hofregeln/                    Spielregeln (QR-Code-Ziel — URL stabil halten!)
/impressum/                    Impressum
/datenschutzerklarung/         Datenschutzerklärung
/story/                        Backgroundstory (nur Footer-Link)
/404.html                      404-Seite
/css/styles.css                Globales Stylesheet
/js/app.js                     Nav, Video-Facade (YouTube), Charakter-Modals
/assets/images/                Logo, Hero-Bild, Karten- und Gang-Grafiken
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

### GitHub Pages

1. GitHub → **Settings** → **Pages**
2. **Source**: `Deploy from a branch` · **Branch**: `main` · **Folder**: `/ (root)`
3. Nach 1–2 Minuten erreichbar unter `https://sebos1980-star.github.io/bronko-donko/`

### Custom Domain (bronko-donko.com)

1. Bei **Ionos** DNS umstellen:
   - `A`-Records auf GitHub-Pages-IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` für `www` auf `sebos1980-star.github.io`
2. GitHub → **Settings** → **Pages** → **Custom domain**: `bronko-donko.com` eintragen
3. **Enforce HTTPS** anhaken, sobald DNS verifiziert ist

**Wichtig:** Keine Ionos-Weiterleitung zur GitHub-Pages-URL — `/hofregeln/` muss als Pfad erhalten bleiben (QR-Code auf der Verpackung).
