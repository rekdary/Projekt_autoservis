"use strict";
// Abstraktní bázová třída pro položky servisu
class PolozkaServisu {
    // Chráněné atributy třídy
    _nazev;
    _zakladniCena;
    // Konstruktor s validací vstupních dat
    constructor(nazev, zakladniCena) {
        if (!nazev || nazev.trim() === "") {
            throw new Error("Název položky nesmí být prázdný.");
        }
        if (zakladniCena < 0) {
            throw new Error(`Cena u položky "${nazev}" nesmí být záporná.`);
        }
        this._nazev = nazev;
        this._zakladniCena = zakladniCena;
    }
    // Veřejná metoda pro získání názvu
    getNazev() {
        return this._nazev;
    }
}
// Třída reprezentující odvedenou práci (potomek PolozkaServisu)
class Prace extends PolozkaServisu {
    // Soukromý atribut pro hodiny
    _pocetHodin;
    // Konstruktor třídy Prace s validací hodin
    constructor(nazev, hodinovaSazba, pocetHodin) {
        super(nazev, hodinovaSazba);
        if (pocetHodin <= 0) {
            throw new Error(`Počet hodin u úkonu "${nazev}" musí být větší než 0.`);
        }
        this._pocetHodin = pocetHodin;
    }
    // Implementace výpočtu ceny pro práci (sazba * hodiny)
    vypocitejCenu() {
        return this._zakladniCena * this._pocetHodin;
    }
}
// Třída reprezentující použitý materiál (potomek PolozkaServisu)
class Material extends PolozkaServisu {
    // Soukromé atributy pro množství a marži
    _mnozstvi;
    _marze;
    // Konstruktor třídy Material s validací množství a marže
    constructor(nazev, cenaKus, mnozstvi, marze) {
        super(nazev, cenaKus);
        if (mnozstvi <= 0) {
            throw new Error(`Množství u materiálu "${nazev}" musí být větší než 0.`);
        }
        if (marze < 1) {
            throw new Error(`Marže u materiálu "${nazev}" nemůže být menší než 1.0.`);
        }
        this._mnozstvi = mnozstvi;
        this._marze = marze;
    }
    // Implementace výpočtu ceny pro materiál (cena * množství * marže)
    vypocitejCenu() {
        return this._zakladniCena * this._mnozstvi * this._marze;
    }
}
// Třída pro správu celé zakázky a kolekce položek
class Zakazka {
    // Soukromé pole pro ukládání instancí položek
    seznamPolozek = [];
    // Metoda pro přidání položky do pole
    pridatPolozku(polozka) {
        this.seznamPolozek.push(polozka);
    }
    // Veřejná metoda pro získání seznamu položek v konzoli
    getSeznamPolozek() {
        return this.seznamPolozek;
    }
    // Metoda pro výpočet sumy celé zakázky protnutím všech položek
    getCelkovaCena() {
        let celkem = 0;
        for (const polozka of this.seznamPolozek) {
            celkem += polozka.vypocitejCenu();
        }
        return celkem;
    }
    // Metoda pro formátovaný textový výpis do konzole prohlížeče
    renderTabulky() {
        console.log("%c=== ROZPIS SERVISNÍ ZAKÁZKY ===", "font-weight: bold; color: #007bff;");
        console.log("----------------------------------------------------------------");
        this.seznamPolozek.forEach((polozka, index) => {
            const typ = polozka instanceof Prace ? "Prace" : "Material";
            console.log(`${index + 1}. [${typ}] ${polozka.getNazev()} -> Cena: ${polozka.vypocitejCenu().toFixed(2)} Kč`);
        });
        console.log("----------------------------------------------------------------");
        console.log(`%cCELKOVÁ CENA ZAKÁZKY: ${this.getCelkovaCena().toFixed(2)} Kč`, "font-weight: bold; color: #28a745; font-size: 14px;");
    }
}
// Blok pro zpracování dat a spuštění testu v konzoli
try {
    // Vytvoření instance zakázky
    const novaZakazka = new Zakazka();
    console.log("Úspěšně načítám tvých 20 položek z data.ts...");
    // Cyklus pro převod surových dat z data.ts na objekty tříd
    surovaDataZakazky.forEach((data) => {
        if (data.typ === "prace") {
            const hrac = new Prace(data.nazev, data.cena, data.hodiny);
            novaZakazka.pridatPolozku(hrac);
        }
        else if (data.typ === "material") {
            const mat = new Material(data.nazev, data.cena, data.mnozstvi, data.marze);
            novaZakazka.pridatPolozku(mat);
        }
    });
    // Spuštění výpisu tabulky do konzole
    novaZakazka.renderTabulky();
    // Zpřístupnění objektu zakázky pro globální testování v konzoli pod názvem 'mojeZakazka'
    window.mojeZakazka = novaZakazka;
}
catch (error) {
    // Odchycení a výpis případné chyby z validací
    console.error("%cChyba při validaci dat v aplikaci:", "color: red; font-weight: bold;", error.message);
}
