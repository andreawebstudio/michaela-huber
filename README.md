# Sito one-page — Michaela Huber, Psicomotricista e formatrice

Sito statico (HTML + CSS + JS vanilla, nessuna dipendenza, nessuna build).

```
index.html              pagina unica
privacy-policy.html     segnaposto — da completare con un documento valido
cookie-policy.html      segnaposto — da completare con un documento valido
assets/css/style.css    stili
assets/js/main.js       menu, FAQ, animazioni, percorso "Come funziona", modale laboratori, modulo
assets/img/             fotografie (ritratto usato solo in "Chi sono")
```

Sezioni: Hero · Chi sono · A chi mi rivolgo · Approccio · Servizi · Laboratori · Come funziona · Dove ricevo · FAQ · Contatti · Footer.

Colori: sfondi sezione alternati `#FFFFFF` / `#FFF5EB`, accenti e CTA `#877B6D`, tocchi azzurri `#6FA3D1`,
palette di supporto `#FAF3EC #365E80 #D8C7B8 #303C46`.

## Da fare

1. **Modulo contatti** — in `assets/js/main.js` impostare `FORM_ENDPOINT` (es. Formspree).
   Finché è vuoto il modulo non simula l'invio: apre il programma di posta del visitatore con il messaggio precompilato.
2. **Laboratori** — date e programmi sono nel modale `#lab-dialog` di `index.html`; aggiornarli/rimuoverli dopo il 5 dicembre.
3. **Privacy e Cookie Policy** — sostituire i segnaposto con testi validi.
4. **Fotografie** — le immagini fornite sono piccole (max 575 px): per una resa nitida su schermi grandi servono versioni a risoluzione più alta.
5. **Google Fonts** — per conformità GDPR valutare l'hosting locale di DM Sans e Caveat.
6. **SEO** — aggiungere `canonical` e `og:url` col dominio definitivo.
