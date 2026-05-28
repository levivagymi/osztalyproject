-- ─────────────────────────────────────────────────────────────────────
-- Design csapat (t01) — bejegyzések feltöltése
-- Futtatás: Supabase > SQL Editor > New query > Run
-- Jelszó minden bejegyzésnél: design2025
-- ─────────────────────────────────────────────────────────────────────

-- 1. MI A DESIGN?
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Mi a design? — A fogalom meghatározása',

  'A design nem csupán esztétika: az alkotás és a funkcionalitás egyensúlyának tudatos keresése. De mit is jelent pontosan ez a szó, és miért van rá szükség minden projektben?',

  E'## Mi a design?\n\nA "design" szó az angol nyelvből érkezett, latin gyökerű kifejezés (*designare* — megjelölni, tervezni). Tágabb értelemben **minden olyan tudatos tervezési tevékenységet jelent**, amelynek célja, hogy egy tárgyat, rendszert vagy kommunikációt egyszerre tegyen *használhatóvá* és *esztétikussá*.\n\n---\n\n## A design három pillére\n\n- **Funkció** — A tervezett dolog betölti a célját: egy weboldal könnyen navigálható, egy nyomtatvány jól olvasható.\n- **Forma** — Vizuálisan kellemes, összhangban van a tartalommal és a célközönséggel.\n- **Kontextus** — A design mindig helyzethez kötött: ugyanaz a megoldás más környezetben más hatást kelt.\n\n---\n\n## Design a projektmunkában\n\nEgy projekt tervezésekor a design nem az utolsó lépés — hanem az egész folyamatot átható szemlélet. A csapatnak már a legelején fel kell tennie a kérdést:\n\n> *Hogyan fog kinézni és működni a végeredmény a felhasználó szemszögéből?*\n\nEz a kérdés irányítja a döntéseket az elrendezéstől kezdve a szín- és tipográfiaválasztáson át egészen az interakciók megtervezéséig.\n\n---\n\n## Összefoglalás\n\n| Szempont | Leírás |\n| --- | --- |\n| Definíció | Tudatos tervezési folyamat, amely funkciót és formát ötvöz |\n| Cél | Hasznos, érthető és esztétikus eredmény létrehozása |\n| Helye a projektben | Nem utólagos, hanem átfogó tevékenység |',

  't01', 'design',
  ARRAY['design', 'alapfogalom', 'definíció', 'tervezés'],
  true, 4, 'ÁLD',
  'design2025',
  'https://www.interaction-design.org/literature/topics/design',
  'What is Design? — Interaction Design Foundation',
  'An overview of what design means across disciplines, covering function, form, and user context.',
  NULL
);


-- 2. MI A WEBDESIGN?
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Mi a webdesign és hogyan kapcsolódik a projektmunkához?',

  'A webdesign egy weboldal vizuális és strukturális megjelenésének megtervezése. Ismerje meg, milyen rétegekből áll, és miért nélkülözhetetlen egy digitális projektben.',

  E'## Mi a webdesign?\n\nA webdesign a weboldalak és webes alkalmazások vizuális megjelenésének, elrendezésének és stílusának megtervezése. Magában foglalja az összes döntést, amelyek meghatározzák, **hogyan néz ki** és **hogyan viselkedik** az oldal a böngészőben.\n\n---\n\n## A webdesign főbb területei\n\n1. **Vizuális hierarchia** — Melyek az oldal legfontosabb elemei, és hogyan vezeti a tekintet a felhasználót?\n2. **Tipográfia** — Betűtípusok, méret, sortávolság és olvashatóság.\n3. **Színpaletta** — Egységes, a márkaidentitással összhangban lévő színrendszer.\n4. **Elrendezés (layout)** — Az elemek elhelyezése a képernyőn: rácsos vagy szabad struktúra.\n5. **Reszponzivitás** — Az oldal megfelelően jelenik meg mobiltelefonon, tableten és asztali gépen egyaránt.\n\n---\n\n## A webdesign kapcsolata a projektmunkával\n\nEgy projekt digitális felülete az egyik legerősebb kommunikációs eszköz. Minél átgondoltabb a design, annál könnyebben érti meg a felhasználó a tartalmat, annál kevesebb kérdés merül fel, és annál meggyőzőbb a végeredmény.\n\n> *"A jó design láthatatlan — csak a rossz design tűnik fel."* — Don Norman\n\n---\n\n## Webdesign eszközök\n\n- **Figma** — Vektoros prototípus-készítő, csapatmunkára optimalizált\n- **Canva** — Egyszerűbb grafikai tartalmakhoz\n- **Adobe XD** — Részletes UI/UX tervezés\n- **GIMP** — Képszerkesztés nyílt forráskódú megoldással\n\n---\n\n## Összefoglalás\n\nA webdesign nem csupán szépítés — a tartalom és a forma egységes rendszerbe foglalása, amelynek célja a felhasználó kiszolgálása és az üzenet hatékony átadása.',

  't01', 'design',
  ARRAY['webdesign', 'vizuális-design', 'layout', 'tipográfia'],
  false, 5, 'HN',
  'design2025',
  'https://www.w3schools.com/whatis/whatis_webdesign.asp',
  'What is Web Design? — W3Schools',
  'Learn the basics of web design including layout, colors, fonts, and how to structure a web page.',
  NULL
);


-- 3. SZERKEZET ÉS DESIGN VISZONYA
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Szerkezet és design — Mi a különbség és miért függ össze a kettő?',

  'Sokan összetévesztik a szerkezetet és a designt, pedig egymást kiegészítő, de különböző fogalmak. A jó weboldal mindkettőre épít — egyszerre logikusan felépített és vizuálisan vonzó.',

  E'## Szerkezet és design — Mi a különbség?\n\n### A szerkezet (struktúra)\n\nA szerkezet azt jelenti, **hogyan épül fel egy weboldal logikailag**: milyen oldalak vannak, ezek milyen sorrendben követik egymást, és hogyan kapcsolódnak egymáshoz. A struktúra a csontváz.\n\n- Navigáció: főmenü, almenük, hivatkozások\n- Tartalmi hierarchia: H1, H2, bekezdések, listák\n- Oldaltérkép: milyen URL-eken milyen tartalom érhető el\n\n### A design (megjelenés)\n\nA design a szerkezet vizuális megvalósítása. A dizájn a *ruha*, amelyet a csontváz visel:\n\n- Színek, árnyalatok, kontrasztok\n- Betűtípusok és méretek\n- Ikonok, képek, illusztrációk\n- Térközök, margók, rácsrendszer\n\n---\n\n## Hogyan függ össze a kettő?\n\nA szerkezet nélküli design kaotikus és nehezen navigálható. A design nélküli szerkezet száraz és motiválatlan. A legjobb weboldalak esetén a kettő szorosan együttműködik:\n\n> A struktúra meghatározza, **mit** lát a felhasználó. A design meghatározza, **hogyan** éli meg azt.\n\n---\n\n## Példa: egy projektbemutató oldal\n\n| Elem | Szerkezeti döntés | Design döntés |\n| --- | --- | --- |\n| Főcím | H1 tag a lap tetején | Nagy méretű, félkövér betű |\n| Csapat bemutatása | Külön szekció, aloldalként | Kártyás elrendezés, fotókkal |\n| Kapcsolat | Footer, külön oldal | Ikon + kék link szín |\n\n---\n\n## Összefoglalás\n\nA strukturált design azt jelenti, hogy a logikai rend és az esztétikai forma egymást erősíti. Egy projektben mindig érdemes először a szerkezetet megtervezni (sitemap, wireframe), majd utána a vizuális rétegeket felépíteni.',

  't01', 'design',
  ARRAY['szerkezet', 'struktúra', 'weboldal', 'wireframe'],
  false, 5, 'JA',
  'design2025',
  'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content',
  'Structuring content with HTML — MDN Web Docs',
  'Learn how to structure web content using semantic HTML elements to build accessible, well-organized web pages.',
  NULL
);


-- 4. MI AZ UX DESIGN?
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Mi az UX design és miért fontos a felhasználói élmény?',

  'Az UX (User Experience) design nem a szépségről szól — hanem arról, hogy a felhasználó sikeresen elvégezze, amit szeretne. Ismerd meg az UX tervezés alapjait és fontosságát!',

  E'## Mi az UX design?\n\n**UX** — *User Experience*, azaz felhasználói élmény. Az UX design az a tervezési folyamat, amelynek célja, hogy a felhasználó számára **hasznos, hatékony és kellemes** legyen egy termék vagy rendszer használata.\n\nAz UX designer nem csupán azt kérdezi: *"Szép-e az oldal?"*, hanem:\n- *"Megtalálja-e a felhasználó, amit keres?"*\n- *"Hány kattintás kell a cél eléréséhez?"*\n- *"Mit érez a felhasználó, miközben használja az oldalt?"*\n\n---\n\n## Az UX tervezés lépései\n\n1. **Kutatás** — Ki a célközönség? Mik az igényei és problémái?\n2. **Empátia-térkép** — A felhasználó gondolatainak, érzéseinek és viselkedésének feltérképezése\n3. **Wireframe** — Vázlatos, alacsony részletességű képernyőtervek\n4. **Prototípus** — Kattintható, tesztelhető modell\n5. **Tesztelés** — Valós felhasználókkal végzett megfigyelés\n6. **Iteráció** — A visszajelzések alapján javítás, finomhangolás\n\n---\n\n## UX vs. UI — Mi a különbség?\n\n| | UX | UI |\n| --- | --- | --- |\n| Fókusz | Folyamat, élmény, navigáció | Megjelenés, szín, tipográfia |\n| Kérdés | *Működik jól?* | *Szép?* |\n| Eszközök | User journey, wireframe | Mockup, design rendszer |\n\n---\n\n## Miért fontos az UX projektmunkában?\n\nEgy rossz UX-szel rendelkező projekt bemutató oldal elveszíti a néző érdeklődését. Ha a látogató nem találja meg az információt, az egész munka értéke csökken. A jó UX biztosítja, hogy a tartalom eljusson a célközönséghez.\n\n---\n\n## Összefoglalás\n\nAz UX design a felhasználóközpontú gondolkodás alkalmazott formája. Célja, hogy az emberi igények és a rendszer lehetőségei között hidat teremtsen — egyszerűen, logikusan és emlékezetesen.',

  't01', 'design',
  ARRAY['ux', 'felhasználói-élmény', 'prototípus', 'wireframe'],
  false, 5, 'ÁLD',
  'design2025',
  'https://www.nngroup.com/articles/definition-user-experience/',
  'The Definition of User Experience (UX) — Nielsen Norman Group',
  'The Nielsen Norman Group''s authoritative definition of UX, covering all aspects of the end-user''s interaction with a company, its services, and its products.',
  NULL
);


-- 5. MI AZ UI DESIGN?
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Mi az UI design? — A vizuális felület tervezése',

  'Az UI (User Interface) design a képernyőn látható minden vizuális elemet tervezi meg: gombokat, színeket, ikonokat, tipográfiát. Tanuld meg, mi tesz egy felületet igazán jóvá!',

  E'## Mi az UI design?\n\n**UI** — *User Interface*, azaz felhasználói felület. Az UI design a digitális termékek **vizuális és interaktív rétegeinek** tervezése: minden, amit a felhasználó lát és amire kattinthat.\n\nAz UI designer dönt:\n- A gombok formájáról, méretéről és elhelyezéséről\n- A szín- és betűpalettáról\n- Az ikonok stílusáról\n- Az animációkról és az átmenetekről\n\n---\n\n## A jó UI design alapelvei\n\n### 1. Konzisztencia\nHasonló elemek hasonlóan nézzenek ki. A "Mentés" gomb mindig ugyanolyan legyen — ne legyen kék az egyik oldalon és piros a másikon.\n\n### 2. Visszajelzés\nA rendszer mindig jelezze, mi történt. Ha a felhasználó rákattint egy gombra, látnia kell valamit: töltési ikon, szín változás, üzenet.\n\n### 3. Egyszerűség\nKevesebb több. Egy tiszta felületen gyorsabban megtalálja a felhasználó, amit keres.\n\n### 4. Hozzáférhetőség\nElegendő kontraszt, olvasható betűméretek, képernyőolvasóval is kezelhető kód.\n\n---\n\n## UI design eszközök\n\n- **Figma** — Iparági szabvány UI-tervező\n- **Adobe XD** — Adobe-ökoszisztémában dolgozóknak\n- **Sketch** — macOS-re optimalizált\n- **Canva** — Egyszerűbb marketinges tartalmakhoz\n\n---\n\n## UI a mi projektünkben\n\nA 12.i osztály projektoldalán az UI döntések közé tartozik:\n- A bézs (*#F5EED8*) és lila (*#6B3FE6*) színpaletta\n- A JetBrains Mono betűtípus monospace elemekhez\n- A lekerekített kártya-komponensek egységes megjelenése\n\n---\n\n## Összefoglalás\n\nAz UI design az az eszköz, amellyel az UX-ben megtervezett élményt vizuálisan megvalósítjuk. Jó UI nélkül a legjobb struktúra is elvész a vizuális zűrzavarban.',

  't01', 'design',
  ARRAY['ui', 'vizuális-design', 'felhasználói-felület', 'gombok'],
  false, 4, 'HN',
  'design2025',
  'https://www.interaction-design.org/literature/topics/ui-design',
  'UI Design — Interaction Design Foundation',
  'Learn about User Interface (UI) Design: what it is, how it works, and the principles that make for great UI.',
  NULL
);


-- 6. MIRE JÓ A WIREFRAME?
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Wireframe — Miért érdemes vázlatban tervezni a weboldalunkat?',

  'A wireframe egy weboldal szürkeskálás, részletek nélküli vázlata. Egyszerű, gyors és olcsó módja annak, hogy a csapat még a fejlesztés megkezdése előtt megegyezzen a struktúráról.',

  E'## Mi az a wireframe?\n\nA wireframe (drótváz) egy weboldal vagy alkalmazás **alacsony részletességű, vázlatos terve**, amelyen a hangsúly a szerkezeten és az elrendezésen van — nem a szép designon. Általában szürkeskálás, szövegeket helyettesítő téglalapokkal és egyszerű ikonokkal dolgozik.\n\n---\n\n## Mire jó a wireframe?\n\n- **Gyors kommunikáció** — A csapat tagjai gyorsan megértik, hova kerülnek az egyes elemek\n- **Olcsó iteráció** — Könnyebb megváltoztatni egy ceruzával rajzolt vázlatot, mint egy kész designt\n- **Fókusz a struktúrára** — A szép színek és betűk elvonja a figyelmet — a wireframe segít csak a lényegre koncentrálni\n- **Jóváhagyás** — Megmutatható a megbízónak, tanárnak, hogy még az elköteleződés előtt helyesbítsen\n\n---\n\n## Wireframe típusok\n\n| Típus | Leírás | Eszköz |\n| --- | --- | --- |\n| Papír-alapú | Ceruzával, gyorsan | Papír, ceruza |\n| Digitális alacsony részl. | Egyszerű blokkok, szöveg | Balsamiq, Whimsical |\n| Digitális magas részl. | Közel a valódi designhoz | Figma, Adobe XD |\n\n---\n\n## Wireframe vs. prototípus vs. mockup\n\n- **Wireframe** — Statikus vázlat, nincs interakció, nincs szín\n- **Mockup** — Statikus, de valódi designelemekkel (szín, betű)\n- **Prototípus** — Kattintható, szimulált interakciókkal\n\n---\n\n## Wireframe a projektmunkában\n\nMielőtt nekiállunk kódolni vagy Figmában designolni, érdemes papíron vagy Balsamiqban letisztázni:\n- Hol legyen a navigáció?\n- Hány szekció legyen a főoldalon?\n- Hol jelenjen meg a csapatok neve?\n\nEz megkíméli a csapatot a felesleges munkától.\n\n---\n\n## Összefoglalás\n\nA wireframe a tervezési folyamat legelső lépése. Olcsó, gyors és sokat mond — tökéletes kiindulópontja minden sikeres designnak.',

  't01', 'design',
  ARRAY['wireframe', 'drótváz', 'tervezés', 'prototípus'],
  false, 5, 'JA',
  'design2025',
  'https://balsamiq.com/learn/articles/what-are-wireframes/',
  'What are Wireframes? — Balsamiq',
  'A comprehensive guide to wireframes: what they are, why they matter, and how to create them for your next project.',
  NULL
);


-- 7. DESIGNELVEK — A JÓ DESIGN 7 ALAPELVE
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'A jó design 7 alapelve — Gestalt, kontraszt és társaik',

  'A designnak vannak szabályai — Gestalt-elvek, kontraszt, hierarchia, közelség. Ha ezeket értjük, bármilyen vizuális problémát tudatosan tudunk megközelíteni.',

  E'## A jó design alapelvei\n\nA vizuális kommunikáció nem véletlenszerű — évtizedes kutatások alapján azonosított **törvények** irányítják, hogyan érzékelünk vizuális információt. Ezek ismerete segíti a designert, hogy tudatos döntéseket hozzon.\n\n---\n\n## 1. Kontraszt\n\nA kontraszt teszi olvashatóvá a szöveget, és emeli ki a fontos elemeket. Sötét alap, világos szöveg — vagy fordítva. WCAG irányelvek szerint a szöveg és háttér kontrasztarányának legalább **4,5:1**-nek kell lennie.\n\n## 2. Ismétlés (Repetition)\n\nAz egységes elemek erősítik a márka- vagy projektidenditást. Ha minden kártya ugyanolyan kerekítéssel rendelkezik, a felhasználó gyorsan azonosítja az ismétlődő mintát.\n\n## 3. Igazítás (Alignment)\n\nSoha ne helyezz el elemet véletlenszerűen. Minden elemnek kapcsolódnia kell valamilyen rácshoz vagy tengelyhez — ez adja a vizuális rendet.\n\n## 4. Közelség (Proximity)\n\nEgymáshoz közel elhelyezett elemek összetartozónak tűnnek. A cím és az alatta lévő bekezdés között kisebb a távolság, mint két külön szekció között.\n\n## 5. Gestalt-elvek\n\nA Gestalt pszichológia szerint az ember egészként érzékeli az egymáshoz közel lévő vagy hasonló elemeket:\n- **Összezártság** — A csoport tagjai összetartoznak\n- **Folytonosság** — A szem követi az irányvonalakat\n- **Szimmetria** — A szimmetrikus elrendezés stabilnak, megbízhatónak hat\n\n## 6. Vizuális hierarchia\n\nAz elemek relatív mérete, vastagsága és pozíciója mutatja meg, melyik a fontosabb. A H1 nagyobb, mint a H2 — mert fontosabb információt tartalmaz.\n\n## 7. Fehér tér (White Space)\n\nA fehér tér (negatív tér) nem üresség — lélegzési tér. Segít kiemelni a fontos tartalmakat és csökkenti a kognitív terhelést.\n\n---\n\n## Összefoglalás\n\n| Elv | Hatás |\n| --- | --- |\n| Kontraszt | Olvashatóság, kiemelés |\n| Ismétlés | Egységesség, márkaidentitás |\n| Igazítás | Vizuális rend |\n| Közelség | Csoportosítás, összetartozás |\n| Gestalt | Egész-érzékelés |\n| Hierarchia | Fontossági sorrend |\n| Fehér tér | Légkör, fókusz |',

  't01', 'design',
  ARRAY['gestalt', 'kontraszt', 'hierarchia', 'designelvek', 'tipográfia'],
  false, 6, 'ÁLD',
  'design2025',
  'https://www.canva.com/learn/design-elements-principles/',
  'Design Elements and Principles — Canva',
  'A visual guide to the elements and principles of design, including contrast, alignment, repetition, and proximity.',
  NULL
);


-- 8. RESZPONZÍV DESIGN
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Reszponzív design — Hogyan néz ki az oldalunk mobilon?',

  'Ma már a weboldalak forgalmának több mint fele mobileszközről érkezik. A reszponzív design biztosítja, hogy a projekt egyformán jól nézzen ki telefonon, tableten és asztali gépen.',

  E'## Mi a reszponzív design?\n\nA **reszponzív design** (*responsive web design*, RWD) olyan tervezési megközelítés, amelynek célja, hogy egy weboldal automatikusan alkalmazkodjon az éppen használt eszköz képernyőméretéhez és felbontásához — kódmásolat nélkül.\n\n---\n\n## Miért fontos?\n\nStatisztikák szerint 2024-ben a globális webes forgalom **58–62%-a mobileszközről** érkezett. Ha az oldalunk nem reszponzív, a látogatók felét elveszítjük.\n\n---\n\n## A reszponzív design három pillére\n\n### 1. Rugalmas rácsrendszer (Fluid Grid)\n\nAz elemek nem fix pixelszélességben, hanem százalékokban vannak megadva, így arányosan nyúlnak és szűkülnek.\n\n### 2. Rugalmas képek\n\n```css\nimg {\n  max-width: 100%;\n  height: auto;\n}\n```\n\nEz biztosítja, hogy a kép soha ne lógjon ki a tartályelemből.\n\n### 3. CSS Media Query-k\n\n```css\n/* Mobilon egysávos elrendezés */\n@media (max-width: 768px) {\n  .grid {\n    grid-template-columns: 1fr;\n  }\n}\n```\n\n---\n\n## Mobile-first vs. Desktop-first\n\n| Megközelítés | Leírás | Ajánlott? |\n| --- | --- | --- |\n| Mobile-first | Mobilra tervezünk először, majd bővítünk | ✓ Igen |\n| Desktop-first | Asztaliról szűkítünk le | Régebbi módszer |\n\nA modern fejlesztésben a **mobile-first** az ajánlott megközelítés, mivel a legkisebb képernyőre kell koncentrálni a lényegi tartalomra.\n\n---\n\n## Breakpointok (töréspontok)\n\n| Neve | Szélesség | Eszköz |\n| --- | --- | --- |\n| xs | < 640px | Okostelefon |\n| sm | 640–768px | Nagy telefon |\n| md | 768–1024px | Tablet |\n| lg | 1024–1280px | Laptop |\n| xl | > 1280px | Asztali monitor |\n\n---\n\n## Összefoglalás\n\nA reszponzív design ma már nem extra — elvárás. Egy mobilon rosszul megjelenő projektoldal elveszíti a közönség bizalmát. Használj CSS Grid-et, Flexbox-ot és media query-ket a rugalmas elrendezések kialakításához.',

  't01', 'design',
  ARRAY['reszponzív', 'mobil', 'css', 'media-query', 'layout'],
  false, 5, 'HN',
  'design2025',
  'https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design',
  'Responsive Design — MDN Web Docs',
  'Learn about responsive web design and how to use flexible grids, images, and media queries to make web pages adapt to any screen size.',
  NULL
);


-- 9. SZÍNELMÉLET A DESIGNBAN
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Színelmélet a designban — Hogyan válasszunk palettát?',

  'A szín az egyik legerősebb eszközünk: befolyásolja az érzelmeket, a figyelem irányát és a márkaidentitást. Tanuld meg, hogyan épül fel egy professzionális színpaletta!',

  E'## Miért fontos a szín a designban?\n\nA szín az első dolog, amit a felhasználó észrevesz — még a szöveg előtt. Kutatások szerint az emberek **90 másodpercen belül** megítélnek egy terméket, és ebből az ítéletből **62–90%** a szín hatásának köszönhető.\n\n---\n\n## A színkerék és az alapfogalmak\n\n- **Árnyalat (Hue)** — A szín "neve": piros, kék, sárga\n- **Telítettség (Saturation)** — Mennyire élénk vagy fakó a szín\n- **Világosság (Lightness/Value)** — Mennyire sötét vagy világos\n\n---\n\n## Színharmoniák\n\n| Típus | Leírás | Hatás |\n| --- | --- | --- |\n| Komplementer | Egymással szemközti színek | Erős, energikus |\n| Analóg | Szomszédos színek | Harmónia, nyugalom |\n| Triász | Háromszög a kerékben | Kiegyensúlyozott |\n| Monocromatikus | Egyetlen szín árnyalatai | Elegáns, egységes |\n\n---\n\n## Szín és érzelem\n\n- **Kék** — Bizalom, professzionalizmus (bankok, tech cégek)\n- **Zöld** — Természet, egészség, pénz\n- **Piros** — Sürgetés, energia, figyelem\n- **Lila** — Kreativitás, luxus, titokzatosság\n- **Narancs** — Barátságosság, lelkesedés\n- **Fekete/szürke** — Elegancia, semlegesség\n\n---\n\n## A mi projektünk palettája\n\nA 12.i projektoldal tudatos színválasztáson alapul:\n\n- **Lila (#6B3FE6)** — Kreativitás, az osztály egyedi identitása\n- **Bézs (#F5EED8)** — Meleg, papírszerű háttér — olvasást segítő\n- **Korall (#F26A4B)** — Kiemelések, figyelemfelhívó elemek\n- **Tinta (#13110F)** — Szöveg, maximális kontraszt\n\n---\n\n## Hozzáférhetőségi szempontok\n\nA WCAG 2.1 AA szabvány szerint:\n- Normál szöveg: minimum **4,5:1** kontrasztarány\n- Nagy szöveg (18px+): minimum **3:1** kontrasztarány\n\nIngyenes ellenőrző: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)\n\n---\n\n## Összefoglalás\n\nA jó színpaletta nem véletlenszerű — rendszeres és céltudatos. Válassz egy domináns, egy kiegészítő és egy akcentszínt, majd következetesen alkalmazd őket végig a designban.',

  't01', 'design',
  ARRAY['szín', 'paletta', 'színelmélet', 'kontraszt', 'hozzáférhetőség'],
  false, 5, 'JA',
  'design2025',
  'https://color.adobe.com/create/color-wheel',
  'Adobe Color — Color Wheel & Color Schemes',
  'Create color palettes with the color wheel or image, browse thousands of color combinations from the Adobe Color community.',
  NULL
);


-- 10. TIPOGRÁFIA
INSERT INTO public.posts
  (title, excerpt, content, team_id, category, tags, pinned, read_min, author, password,
   source_url, source_title, source_description, source_og_image)
VALUES (
  'Tipográfia a weben — Betűtípusok, hierarchia és olvashatóság',

  'A tipográfia a vizuális kommunikáció egyik legfontosabb eszköze. A megfelelő betűtípus és szövegméret-rendszer az, ami egy weboldalt valóban professzionálissá tesz.',

  E'## Mi a tipográfia?\n\nA tipográfia a betűk elrendezésének, megjelenésének és stílusának művészete és technikája. A weben a tipográfia dönt arról, hogy a szöveg:\n- olvasható-e,\n- megfelelő hierarchiát közvetít-e,\n- illeszkedik-e a projekt hangulatához.\n\n---\n\n## Betűtípus-kategóriák\n\n| Kategória | Jellemző | Példa |\n| --- | --- | --- |\n| Serif | Talpas (kis vonások a betűk végén) | Times New Roman, Georgia |\n| Sans-serif | Talp nélküli, modern | Inter, Helvetica, Roboto |\n| Monospace | Egyforma széles karakterek | JetBrains Mono, Courier |\n| Display | Dekoratív, nagy mérethez | Playfair Display |\n\n---\n\n## Tipográfiai hierarchia\n\nA hierarchia megmutatja, melyik szöveg a legfontosabb:\n\n- **H1** — Főcím: 32–52px, félkövér\n- **H2** — Alfejezet: 24–32px\n- **H3** — Alcím: 18–22px\n- **Body** — Törzsszöveg: 16–18px, 1,5–1,7 sortávolság\n- **Caption** — Képaláírás, meta: 11–13px, nagy betűköz\n\n---\n\n## Az olvashatóság titkai\n\n1. **Sortávolság (line-height)** — A törzsszöveghez 1,5–1,7× az ideális\n2. **Sorhossz (line length)** — 60–75 karakter/sor az optimális olvashatósághoz\n3. **Betűköz (letter-spacing)** — Kis betűköz a folyószöveghez; tágabb a monospace és nagybetűs feliratokhoz\n4. **Kontraszt** — Soha ne legyen a szöveg ugyanolyan árnyalatú, mint a háttér\n\n---\n\n## Betűpárosítás (Font Pairing)\n\nEgy weboldalon általában 2–3 betűtípus elegendő:\n- Egy **serif** a főcímekhez (karakter, elegancia)\n- Egy **sans-serif** a törzsszöveghez (olvashatóság)\n- Egy **monospace** a kód- és meta-szövegekhez\n\nPéldánk: *PP Editorial New* (serif, főcím) + *Inter* (sans-serif, szöveg) + *JetBrains Mono* (monospace)\n\n---\n\n## Összefoglalás\n\nA tipográfia nem díszítés — kommunikáció. A megfelelő betűtípus, méret és sortávolság észrevétlenül vezeti a felhasználó tekintetét, és erősíti az üzenetet.',

  't01', 'design',
  ARRAY['tipográfia', 'betűtípus', 'olvashatóság', 'hierarchia', 'serif'],
  false, 5, 'ÁLD',
  'design2025',
  'https://fonts.google.com/knowledge',
  'Google Fonts Knowledge',
  'Learn about typography and type design with Google Fonts Knowledge — articles and guides on choosing and using type effectively.',
  NULL
);
