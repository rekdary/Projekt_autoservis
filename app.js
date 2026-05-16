/**
 * --- OOP STRUKTURA ---
 */
// ABSTRAKTNÍ TŘÍDA
class PolozkaServisu {
    nazev;
    zakladniCena;
    // ATRIBUTY
    constructor(nazev, zakladniCena) {
        this.nazev = nazev;
        this.zakladniCena = zakladniCena;
    }
    getNazev() { return this.nazev; }
}
// KONKRÉTNÍ POTOMEK (Práce)
class Prace extends PolozkaServisu {
    hodiny;
    constructor(nazev, sazba, hodiny) {
        super(nazev, sazba);
        this.hodiny = hodiny;
    }
    // VÝPOČET CENY
    vypocitejCenu() {
        return this.zakladniCena * this.hodiny;
    }
}
// KONKRÉTNÍ POTOMEK (Materiál)
class Material extends PolozkaServisu {
    mnozstvi;
    constructor(nazev, cenaKus, mnozstvi) {
        super(nazev, cenaKus);
        this.mnozstvi = mnozstvi;
    }
    // VÝPOČET CENY
    vypocitejCenu() {
        return (this.zakladniCena * 1.2) * this.mnozstvi;
    }
}
/**
 * --- LOGIKA A PROPOJENÍ ---
 */
// KOLEKCE
const seznamPolozek = [];
const addBtn = document.getElementById('addBtn');
// EVENT LISTENER
addBtn.addEventListener('click', () => {
    const typ = document.getElementById('typ').value;
    const nazev = document.getElementById('nazev').value;
    const cena = parseFloat(document.getElementById('cena').value);
    const mnozstvi = parseFloat(document.getElementById('mnozstvi').value);
    // VALIDACE
    if (!nazev || isNaN(cena) || isNaN(mnozstvi)) {
        alert("Vyplň všechna pole!");
        return;
    }
    // INSTANCIACE
    let novaPolozka;
    if (typ === "prace") {
        novaPolozka = new Prace(nazev, cena, mnozstvi);
    }
    else {
        novaPolozka = new Material(nazev, cena, mnozstvi);
    }
    seznamPolozek.push(novaPolozka);
    vykresliTabulku(); // Tahle funkce se dopíše v dalším kroku
});
export {};
