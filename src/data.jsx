// Projektmenedzsment témakörök és blog adatok — 12.i osztály, 2025/26

const CATEGORIES = [
  { slug: "research",     label: "Kutatás",       chip: "chip-research",  desc: "Források, interjúk, irodalomkutatás" },
  { slug: "design",       label: "Design",         chip: "chip-design",    desc: "Vázlatok, rendszerek, prototípusok" },
  { slug: "coding",       label: "Kódolás",        chip: "chip-coding",    desc: "Repók, kódrészletek, hibakeresési jegyzetek" },
  { slug: "presentation", label: "Prezentáció",    chip: "chip-present",   desc: "Diasorok, scriptek, demo tervek" },
  { slug: "fieldwork",    label: "Terepgyakorlat", chip: "chip-fieldwork", desc: "Helyszíni munkák, kísérletek, naplók" },
  { slug: "writing",      label: "Írás",           chip: "chip-writing",   desc: "Riportok, esszék, vázlatok" },
];

// TOPICS helyettesíti a TEAMS-t — ugyanolyan interfész, de az osztály 9 témakörével.
// Minden mező kompatibilis a meglévő UI-komponensekkel (name, emoji, color, focus, members).
const TOPICS = [
  {
    id: "t01", number: "01",
    name: "Design",
    emoji: "◈", color: "#6B3FE6",
    focus: "Szerkezet, design meghatározása",
    members: 3, memberNames: ["ÁLD", "HN", "JA"],
    subtopics: [
      { text: "Szerkezet, design meghatározása" }
    ],
    desc: "A weboldal vizuális megjelenésének, szerkezetének és felhasználói élményének megtervezése és megvalósítása.",
    software: [],
    sources: [
      { label: "Interaction Design Foundation — What is Design?", url: "https://www.interaction-design.org/literature/topics/design" },
      { label: "W3Schools — What is Web Design?", url: "https://www.w3schools.com/whatis/whatis_webdesign.asp" },
      { label: "MDN Web Docs — Structuring content with HTML", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content" },
      { label: "Nielsen Norman Group — The Definition of User Experience (UX)", url: "https://www.nngroup.com/articles/definition-user-experience/" },
      { label: "Interaction Design Foundation — UI Design", url: "https://www.interaction-design.org/literature/topics/ui-design" },
      { label: "Balsamiq — What are Wireframes?", url: "https://balsamiq.com/learn/articles/what-are-wireframes/" },
      { label: "Canva — Design Elements and Principles", url: "https://www.canva.com/learn/design-elements-principles/" },
      { label: "MDN Web Docs — Responsive Design", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design" },
      { label: "Adobe Color — Color Wheel & Color Schemes", url: "https://color.adobe.com/create/color-wheel" },
      { label: "Google Fonts Knowledge — Typography", url: "https://fonts.google.com/knowledge" },
    ]
  },
  {
    id: "t02", number: "02",
    name: "Mi a projekt?",
    emoji: "◉", color: "#F26A4B",
    focus: "A projekt definíciója és tervezése",
    members: 3, memberNames: ["TD", "SZG", "TPB"],
    subtopics: [
      { text: "Hogyan épül fel egy projekt?" },
      { text: "Tervezés" },
      { text: "A tervezési folyamat lépései" },
      { text: "Gyakorlati példa a tervezésre" },
      { text: "A projekt definíciója és jellemzői" },
      { text: "A projekt definíciója" },
      { text: "A projektfeladat jellemzői" }
    ],
    desc: "A projekt fogalmának alapos meghatározása, felépítése és tervezési folyamatának részletes bemutatása.",
    software: [], sources: []
  },
  {
    id: "t03", number: "03",
    name: "A projekt keretei",
    emoji: "◇", color: "#1B4B8F",
    focus: "Határidő és költségkeret",
    members: 3, memberNames: ["CSB", "HM", "MM"],
    subtopics: [
      { text: "Határidő" },
      { text: "Költségkeret" },
      { text: "Változhat a költségkeret projekt közben?" },
      { text: "A költségkeret jellemzői" }
    ],
    desc: "A projekt időbeli és anyagi kereteinek vizsgálata: a határidő és a költségkeret szerepe és jellemzői.",
    software: [], sources: []
  },
  {
    id: "t04", number: "04",
    name: "Projektcélok",
    emoji: "◎", color: "#7B1F61",
    focus: "Idő, költség, minőség háromszöge",
    members: 3, memberNames: ["KA", "LM", "KL"],
    subtopics: [
      { text: "A projekt feladatokból áll" },
      { text: "A projekt terjedelmének dimenziói" },
      { text: "Gyorsan, olcsón, kiváló minőséget?" },
      { text: "Az idő, a költség vagy a minőség változtatásának következményei" }
    ],
    desc: "A projektcélok meghatározása és az idő–költség–minőség háromszög-modell bemutatása.",
    software: [], sources: []
  },
  {
    id: "t05", number: "05",
    name: "Menedzsment",
    emoji: "◆", color: "#3F5C12",
    focus: "A menedzsment négy fő feladata",
    members: 3, memberNames: ["SB", "PS", "SA"],
    subtopics: [
      { text: "Az alapfogalmak tisztázása" },
      { text: "Mi a menedzsment és ki a menedzser?" },
      { text: "A szervezet" },
      { text: "Mit csinál egy szervezet?" },
      { text: "A menedzsment négy fő feladata" },
      { text: "Tervezés", indent: true },
      { text: "Szervezés", indent: true },
      { text: "Irányítás", indent: true },
      { text: "Vezetés", indent: true }
    ],
    desc: "A menedzsment alapfogalmainak tisztázása és a négy fő feladat (tervezés, szervezés, irányítás, vezetés) rendszere.",
    software: [], sources: []
  },
  {
    id: "t06", number: "06",
    name: "Menedzser szerepkörei",
    emoji: "○", color: "#B36A00",
    focus: "Interperszonális, információs, döntési szerepkör",
    members: 3, memberNames: ["MB", "GyV", "BL"],
    subtopics: [
      { text: "Interperszonális szerepkör" },
      { text: "Információs szerepkör" },
      { text: "Döntési szerepkör" }
    ],
    desc: "Henry Mintzberg modellje alapján a menedzser három fő szerepkörének részletes elemzése.",
    software: [], sources: []
  },
  {
    id: "t07", number: "07",
    name: "Projektmenedzsment",
    emoji: "◐", color: "#0E5C5F",
    focus: "A projektmenedzsment folyamata és szereplői",
    members: 3, memberNames: ["SzZs", "SzD", "NBM"],
    subtopics: [
      { text: "Mit jelent a projektmenedzsment?" },
      { text: "A projektmenedzsment folyamatának szakaszai" },
      { text: "Miért fontos a projektmenedzsment?" },
      { text: "A projektmenedzser és a projektvezető" },
      { text: "A projektmenedzser" },
      { text: "A projektmenedzser képességeinek fejlesztése" },
      { text: "A projektvezető" }
    ],
    desc: "A projektmenedzsment fogalmának, folyamatának és kulcsszereplőinek teljes körű bemutatása.",
    software: [], sources: []
  },
  {
    id: "t08", number: "08",
    name: "Segítő szoftverek",
    emoji: "▣", color: "#8A4A1F",
    focus: "GIMP és Trello a projektmunkában",
    members: 3, memberNames: ["BB", "JE", "KM"],
    subtopics: [
      { text: "GIMP – szabad képszerkesztő" },
      { text: "Trello – kártyaalapú projektkezelő" }
    ],
    desc: "A projektmunkát segítő szoftverek bemutatása: GIMP képszerkesztő és Trello feladatkezelő.",
    software: ["GIMP", "Trello"], sources: []
  },
  {
    id: "t09", number: "09",
    name: "Teszt",
    emoji: "✓", color: "#1A6B3A",
    focus: "20 ellenőrző kérdés a témákhoz",
    members: 3, memberNames: ["SzD", "SzSz", "VP"],
    subtopics: [
      { text: "20 ellenőrző kérdés a témákhoz" }
    ],
    desc: "Húsz ellenőrző kérdés az összes témakör anyagából összeállítva.",
    software: [], sources: []
  }
];

// Bejegyzések a Supabase-ből töltődnek — itt nincs demo adat.
const POSTS = [];

Object.assign(window, { CATEGORIES, TOPICS, POSTS });
