/**
 * Datový číselník - surová data pro oživení objektů
 * Exportujeme pole objektů, které pak budeme importovat v hlavním souboru.
 */
const surovaData = [
    // PRÁCE
    { typ: "prace", nazev: "Výměna motorového oleje", cena: 450, hodiny: 1 },
    { typ: "prace", nazev: "Výměna brzdových destiček", cena: 600, hodiny: 2.5 },
    { typ: "prace", nazev: "Diagnostika elektroniky", cena: 850, hodiny: 1.5 },
    { typ: "prace", nazev: "Přezutí pneu (sada)", cena: 500, hodiny: 2 },
    { typ: "prace", nazev: "Čištění interiéru (detail)", cena: 400, hodiny: 4 },
    { typ: "prace", nazev: "Klempířské práce", cena: 750, hodiny: 6 },

    // MATERIÁL
    { typ: "material", nazev: "Motorový olej 5W-30 (1L)", cena: 280, mnozstvi: 5, marze: 1.25 },
    { typ: "material", nazev: "Olejový filtr", cena: 350, mnozstvi: 1, marze: 1.3 },
    { typ: "material", nazev: "Brzdový kotouč přední", cena: 1850, mnozstvi: 2, marze: 1.15 },
    { typ: "material", nazev: "Sada brzdových destiček", cena: 1200, mnozstvi: 1, marze: 1.2 },
    { typ: "material", nazev: "Zimní pneumatika R17", cena: 2400, mnozstvi: 4, marze: 1.1 },
    { typ: "material", nazev: "Kapalina do ostřikovačů 5L", cena: 150, mnozstvi: 2, marze: 1.4 }
];