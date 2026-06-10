// Ceník servisních balíčků (Automatické propojení práce a materiálu)
const surovaDataZakazky = [
    {
        nazevUkonu: "Výměna motorového oleje a filtru",
        prace: { nazev: "Práce: Výměna oleje", cena: 450, hodiny: 1 },
        material: [
            { nazev: "Motorový olej 5W-30 (1L)", cena: 280, mnozstvi: 5, marze: 1.25 },
            { nazev: "Olejový filtr", cena: 350, mnozstvi: 1, marze: 1.3 }
        ]
    },
    {
        nazevUkonu: "Kompletní výměna brzd (přední náprava)",
        prace: { nazev: "Práce: Výměna brzd", cena: 600, hodiny: 2.5 },
        material: [
            { nazev: "Brzdový kotouč přední", cena: 1850, mnozstvi: 2, marze: 1.15 },
            { nazev: "Sada brzdových destiček", cena: 1200, mnozstvi: 1, marze: 1.2 },
            { nazev: "Brzdová kapalina (odvzdušnění)", cena: 220, mnozstvi: 1, marze: 1.35 }
        ]
    },
    {
        nazevUkonu: "Přezutí pneu a vyvážení (sada 4 ks)",
        prace: { nazev: "Práce: Přezutí a vyvážení", cena: 500, hodiny: 2 },
        material: [
            { nazev: "Zimní pneumatika R17", cena: 2400, mnozstvi: 4, marze: 1.1 },
            { nazev: "Vyvažovací závaží (sada)", cena: 150, mnozstvi: 1, marze: 1.5 }
        ]
    },
    {
        nazevUkonu: "Servis a plnění klimatizace",
        prace: { nazev: "Práce: Údržba klimatizace", cena: 700, hodiny: 1.8 },
        material: [
            { nazev: "Chladivo R134a (gramy)", cena: 2, mnozstvi: 500, marze: 1.4 },
            { nazev: "Kabinový vzduchový filtr", cena: 420, mnozstvi: 1, marze: 1.25 }
        ]
    },
    {
        nazevUkonu: "Výměna rozvodové sady",
        prace: { nazev: "Práce: Výměna rozvodů", cena: 1500, hodiny: 7 },
        material: [
            { nazev: "Sada rozvodového řemene vč. vodní pumpy", cena: 4500, mnozstvi: 1, marze: 1.2 },
            { nazev: "Chladicí kapalina G12 (1L)", cena: 120, mnozstvi: 3, marze: 1.3 }
        ]
    },
    {
        nazevUkonu: "Výměna autobaterie a kódování",
        prace: { nazev: "Práce: Výměna a diagnostika baterie", cena: 600, hodiny: 1 },
        material: [
            { nazev: "Akumulátor 12V 74Ah", cena: 3100, mnozstvi: 1, marze: 1.12 }
        ]
    },
    {
        nazevUkonu: "Příprava na zimu (stěrače, kapalina)",
        prace: { nazev: "Práce: Drobná zimní údržba", cena: 450, hodiny: 0.5 },
        material: [
            { nazev: "Sada předních stěračů", cena: 650, mnozstvi: 1, marze: 1.25 },
            { nazev: "Zimní kapalina do ostřikovačů 5L", cena: 150, mnozstvi: 1, marze: 1.4 }
        ]
    },
    {
        nazevUkonu: "Výměna spojkové sady",
        prace: { nazev: "Práce: Demontáž převodovky a výměna spojky", cena: 1200, hodiny: 5.5 },
        material: [
            { nazev: "Spojková sada (lamela, přítlačák, ložisko)", cena: 5800, mnozstvi: 1, marze: 1.15 },
            { nazev: "Převodový olej 75W-90 (1L)", cena: 350, mnozstvi: 2, marze: 1.3 }
        ]
    },
    {
        nazevUkonu: "Výměna předních tlumičů pérování",
        prace: { nazev: "Práce: Výměna tlumičů a pružin", cena: 750, hodiny: 3.5 },
        material: [
            { nazev: "Přední tlumič", cena: 1600, mnozstvi: 2, marze: 1.2 },
            { nazev: "Horní uložení tlumiče", cena: 450, mnozstvi: 2, marze: 1.25 }
        ]
    },
    {
        nazevUkonu: "Velký servis filtrů",
        prace: { nazev: "Práce: Kompletní výměna filtrů", cena: 400, hodiny: 1.5 },
        material: [
            { nazev: "Vzduchový filtr motoru", cena: 380, mnozstvi: 1, marze: 1.3 },
            { nazev: "Palivový filtr", cena: 620, mnozstvi: 1, marze: 1.2 }
        ]
    },
    {
        nazevUkonu: "Výměna zapalovacích svíček",
        prace: { nazev: "Práce: Výměna svíček a kontrola", cena: 500, hodiny: 1.2 },
        material: [
            { nazev: "Zapalovací svíčka Iridium", cena: 350, mnozstvi: 4, marze: 1.35 }
        ]
    },
    {
        nazevUkonu: "Výměna oleje v automatické převodovce s proplachem",
        prace: { nazev: "Práce: Dynamický proplach a výměna ATF", cena: 950, hodiny: 3 },
        material: [
            { nazev: "ATF olej pro automaty (1L)", cena: 420, mnozstvi: 10, marze: 1.2 },
            { nazev: "Filtr automatické převodovky", cena: 850, mnozstvi: 1, marze: 1.25 }
        ]
    },
    {
        nazevUkonu: "Výměna žárovky světlometu",
        prace: { nazev: "Práce: Demontáž krytu a výměna žárovky", cena: 300, hodiny: 0.5 },
        material: [
            { nazev: "Autožárovka H7 LongLife", cena: 180, mnozstvi: 2, marze: 1.5 }
        ]
    },
    {
        nazevUkonu: "Detailní čištění interiéru a tepování",
        prace: { nazev: "Práce: Mokré tepování a ošetření plastů", cena: 400, hodiny: 4 },
        material: [
            { nazev: "Čisticí chemie a impregnace (sada)", cena: 350, mnozstvi: 1, marze: 1.4 }
        ]
    },
      {
        nazevUkonu: "Základní mytí karoserie a vysátí interiéru",
        prace: { nazev: "Práce: Ruční mytí a vysávání", cena: 300, hodiny: 1 },
        material: [
            { nazev: "Autošampon a vosk (dávka)", cena: 80, mnozstvi: 1, marze: 1.2 }
        ]
    },
    {
        nazevUkonu: "Rychlá výměna předních stěračů",
        prace: { nazev: "Práce: Demontáž a montáž gumiček", cena: 150, hodiny: 0.2 },
        material: [
            { nazev: "Přední stěrače (pár)", cena: 450, mnozstvi: 1, marze: 1.2 }
        ]
    },
    {
        nazevUkonu: "Kontrola a výměna prasklé pojistky",
        prace: { nazev: "Práce: Proměření obvodu a výměna", cena: 200, hodiny: 0.3 },
        material: [
            { nazev: "Nožová pojistka 15A", cena: 15, mnozstvi: 1, marze: 2.0 }
        ]
    },
    // --- ÚKONY BEZ MATERIÁLU (ČISTÁ PRÁCE) ---
    {
        nazevUkonu: "Počítačová diagnostika elektroniky",
        prace: { nazev: "Práce: Diagnostika vozu a výpis chyb", cena: 850, hodiny: 1.5 },
        material: [] 
    },
    {
        nazevUkonu: "Seřízení geometrie kol (3D)",
        prace: { nazev: "Práce: Měření a seřízení sbíhavosti náprav", cena: 900, hodiny: 1.2 },
        material: []
    },
    {
        nazevUkonu: "Klempířské práce - oprava promáčklin",
        prace: { nazev: "Práce: Vyrovnání karoserie (PDR metoda)", cena: 1100, hodiny: 5 },
        material: []
    },
    {
        nazevUkonu: "Dezinfekce interiéru ozonem",
        prace: { nazev: "Práce: Čištění ozonovým generátorem", cena: 400, hodiny: 0.5 },
        material: []
    },
];
