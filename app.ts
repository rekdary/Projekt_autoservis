/** 
 * --- OOP STRUKTURA ---
 */

// ABSTRAKTNÍ TŘÍDA
abstract class PolozkaServisu {
    // ATRIBUTY
    constructor(protected nazev: string, protected zakladniCena: number) {}
    
    // ABSTRAKTNÍ METODA
    public abstract vypocitejCenu(): number;
    
    public getNazev(): string { return this.nazev; }
}

// KONKRÉTNÍ POTOMEK (Práce)
class Prace extends PolozkaServisu {
    constructor(nazev: string, sazba: number, private hodiny: number) {
        super(nazev, sazba);
    }

    // VÝPOČET CENY
    public vypocitejCenu(): number { 
        return this.zakladniCena * this.hodiny; 
    }
}

// KONKRÉTNÍ POTOMEK (Materiál)
class Material extends PolozkaServisu {
    constructor(nazev: string, cenaKus: number, private mnozstvi: number) {
        super(nazev, cenaKus);
    }

    // VÝPOČET CENY
    public vypocitejCenu(): number { 
        return (this.zakladniCena * 1.2) * this.mnozstvi; 
    }
}
import { surovaData } from './data';

/** 
 * --- LOGIKA A PROPOJENÍ ---
 */

// KOLEKCE
const seznamPolozek: PolozkaServisu[] = [];

const addBtn = document.getElementById('addBtn') as HTMLButtonElement;

// EVENT LISTENER
addBtn.addEventListener('click', () => {
    const typ = (document.getElementById('typ') as HTMLSelectElement).value;
    const nazev = (document.getElementById('nazev') as HTMLInputElement).value;
    const cena = parseFloat((document.getElementById('cena') as HTMLInputElement).value);
    const mnozstvi = parseFloat((document.getElementById('mnozstvi') as HTMLInputElement).value);

    // VALIDACE
    if (!nazev || isNaN(cena) || isNaN(mnozstvi)) {
        alert("Vyplň všechna pole!");
        return;
    }

    // INSTANCIACE
    let novaPolozka: PolozkaServisu;
    if (typ === "prace") {
        novaPolozka = new Prace(nazev, cena, mnozstvi);
    } else {
        novaPolozka = new Material(nazev, cena, mnozstvi);
    }

    seznamPolozek.push(novaPolozka);
    vykresliTabulku(); // Tahle funkce se dopíše v dalším kroku
});
