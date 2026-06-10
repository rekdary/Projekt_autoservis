// Bázová abstraktní třída pro položky
abstract class PolozkaServisu {
    // Chráněné proměnné pro název a základní cenu
    protected _nazev: string;
    protected _zakladniCena: number;

    // Konstruktor s kontrolou prázdného názvu a záporné ceny
    constructor(nazev: string, zakladniCena: number) {
        if (!nazev || nazev.trim() === "") {
            throw new Error("Název položky nesmí být prázdný.");
        }
        if (zakladniCena < 0) {
            throw new Error(`Cena u položky "${nazev}" nesmí být záporná.`);
        }
        this._nazev = nazev;
        this._zakladniCena = zakladniCena;
    }

    // Metoda pro získání názvu položky
    public getNazev(): string {
        return this._nazev;
    }

    // Metoda pro získání základní ceny
    public getZakladniCena(): number {
        return this._zakladniCena;
    }

    // Abstraktní metody, které musí obsahovat potomci
    public abstract vypocitejCenu(): number;
    public abstract getFormatovaneMnozstvi(): string;
}

// Třída pro práci (dědí z PolozkaServisu)
class Prace extends PolozkaServisu {
    // Proměnná pro počet odpracovaných hodin
    private _pocetHodin: number;

    // Konstruktor pro práci s kontrolou hodin
    constructor(nazev: string, hodinovaSazba: number, pocetHodin: number) {
        super(nazev, hodinovaSazba);
        if (pocetHodin <= 0) {
            throw new Error(`Počet hodin u úkonu "${nazev}" musí být větší než 0.`);
        }
        this._pocetHodin = pocetHodin;
    }

    // Výpočet výsledné ceny práce
    public vypocitejCenu(): number {
        return this._zakladniCena * this._pocetHodin;
    }

    // Formátování textu pro hodiny
    public getFormatovaneMnozstvi(): string {
        return `${this._pocetHodin} hod`;
    }
}

// Třída pro materiál (dědí z PolozkaServisu)
class Material extends PolozkaServisu {
    // Proměnné pro kusy a marži
    private _mnozstvi: number;
    private _marze: number;

    // Konstruktor pro materiál s kontrolou množství a marže
    constructor(nazev: string, cenaKus: number, mnozstvi: number, marze: number) {
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

    // Výpočet výsledné ceny materiálu
    public vypocitejCenu(): number {
        return this._zakladniCena * this._mnozstvi * this._marze;
    }

    // Formátování textu pro kusy a marži
    public getFormatovaneMnozstvi(): string {
        const procentoMarze = Math.round((this._marze - 1) * 100);
        return `${this._mnozstvi} ks (marže ${procentoMarze}%)`;
    }
}

// Třída pro celou zakázku jednoho auta
class Zakazka {
    // Název auta a pole pro uložení jeho položek
    private _nazevAuta: string;
    private _seznamPolozek: PolozkaServisu[] = [];

    // Konstruktor zakázky
    constructor(nazevAuta: string) {
        if (!nazevAuta || nazevAuta.trim() === "") {
            throw new Error("Název automobilu nesmí být prázdný.");
        }
        this._nazevAuta = nazevAuta;
    }

    // Získání názvu auta
    public getNazevAuta(): string {
        return this._nazevAuta;
    }

    // Získání pole položek
    public getSeznamPolozek(): PolozkaServisu[] {
        return this._seznamPolozek;
    }

    // Přidání položky do pole
    public pridatPolozku(polozka: PolozkaServisu): void {
        this._seznamPolozek.push(polozka);
    }

    // Výpočet celkové ceny všech položek v zakázce
    public getCelkovaCena(): number {
        let celkem = 0;
        for (const polozka of this._seznamPolozek) {
            celkem += polozka.vypocitejCenu();
        }
        return celkem;
    }

    // Spojení názvů položek do jednoho textu pro tabulku
    public getZjednodusenyPrehledUkonu(): string {
        if (this._seznamPolozek.length === 0) {
            return "Žádné zadané úkony";
        }
        return this._seznamPolozek.map(p => p.getNazev()).join(", ");
    }
}

// Pole pro uložení všech aut v systému
const globalniSeznamZakazek: Zakazka[] = [];
// Uchování indexu zrovna otevřeného auta
let indexZobrazenehoAuta: number = -1;

// Spuštění kódu po načtení stránky
document.addEventListener("DOMContentLoaded", () => {
    // Načtení HTML elementů do proměnných
    const formAuto = document.getElementById("form-auto") as HTMLFormElement;
    const formPolozka = document.getElementById("form-polozka") as HTMLFormElement;
    const vyberAutaPolozka = document.getElementById("vyber-auta-polozka") as HTMLSelectElement;
    const checkboxyUkony = document.getElementById("checkboxy-ukony") as HTMLElement;
    const vystupSeznamAut = document.getElementById("vystup-seznam-aut") as HTMLTableSectionElement;
    const sekceDetailAuta = document.getElementById("sekce-detail-auta") as HTMLElement;
    const btnZavritDetail = document.getElementById("btn-zavrit-detail") as HTMLButtonElement;

    // Skrytí detailu auta
    btnZavritDetail.addEventListener("click", () => {
        sekceDetailAuta.classList.add("hidden");
        indexZobrazenehoAuta = -1;
    });

    // Vytvoření checkboxů z dat v data.js
    if (typeof surovaDataZakazky !== "undefined" && Array.isArray(surovaDataZakazky)) {
        surovaDataZakazky.forEach((ukon: any, index: number) => {
            const label = document.createElement("label");
            label.className = "checkbox-polozka";
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = index.toString();
            checkbox.name = "polozka-ceniku";
            
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${ukon.nazevUkonu}`));
            
            checkboxyUkony.appendChild(label);
        });
    }

    // Smazání auta z pole a překreslení
    function smazatZakazku(index: number): void {
        const autoKeSmazani = globalniSeznamZakazek[index];
        const potvrzeni = confirm(`Opravdu chcete označit opravu vozidla "${autoKeSmazani.getNazevAuta()}" jako dokončenou a smazat ji ze systému?`);
        
        if (potvrzeni) {
            globalniSeznamZakazek.splice(index, 1);
            
            if (index === indexZobrazenehoAuta) {
                sekceDetailAuta.classList.add("hidden");
                indexZobrazenehoAuta = -1;
            } else if (index < indexZobrazenehoAuta) {
                indexZobrazenehoAuta--;
            }
            prekresliSystem();
        }
    }

    // Překreslení hlavní tabulky a seznamu aut
    function prekresliSystem(): void {
        vyberAutaPolozka.innerHTML = '<option value="" disabled selected>-- Vyberte registrované auto --</option>';
        globalniSeznamZakazek.forEach((zakazka, index) => {
            const option = document.createElement("option");
            option.value = index.toString();
            option.text = zakazka.getNazevAuta();
            vyberAutaPolozka.appendChild(option);
        });

        if (globalniSeznamZakazek.length === 0) {
            vystupSeznamAut.innerHTML = '<tr><td colspan="4" class="text-center">V systému aktuálně nejsou žádná vozidla.</td></tr>';
            return;
        }

        vystupSeznamAut.innerHTML = "";
        globalniSeznamZakazek.forEach((zakazka, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${zakazka.getNazevAuta()}</strong></td>
                <td>${zakazka.getZjednodusenyPrehledUkonu()}</td>
                <td><strong>${zakazka.getCelkovaCena().toFixed(2)} Kč</strong></td>
                <td>
                    <div class="akce-tlacitka">
                        <button type="button" class="btn-small btn-detail" data-index="${index}">Zobrazit detail</button>
                        <button type="button" class="btn-danger btn-smazat" data-index="${index}">Hotovo</button>
                    </div>
                </td>
            `;
            vystupSeznamAut.appendChild(tr);
        });

        const tlacitkaDetailu = vystupSeznamAut.querySelectorAll(".btn-detail");
        tlacitkaDetailu.forEach(tlacitko => {
            tlacitko.addEventListener("click", (e) => {
                const cil = e.target as HTMLButtonElement;
                const index = parseInt(cil.getAttribute("data-index") || "-1");
                zobrazDetailKalkulaceAuta(index);
            });
        });

        const tlacitkaSmazani = vystupSeznamAut.querySelectorAll(".btn-smazat");
        tlacitkaSmazani.forEach(tlacitko => {
            tlacitko.addEventListener("click", (e) => {
                const cil = e.target as HTMLButtonElement;
                const index = parseInt(cil.getAttribute("data-index") || "-1");
                smazatZakazku(index);
            });
        });
    }

    // Zobrazení detailní tabulky s cenami
    function zobrazDetailKalkulaceAuta(index: number): void {
        if (index < 0 || index >= globalniSeznamZakazek.length) return;
        indexZobrazenehoAuta = index;
        
        const vybraneAuto = globalniSeznamZakazek[index];
        const detailNazevAuta = document.getElementById("detail-nazev-auta") as HTMLElement;
        const vystupDetailPolozek = document.getElementById("vystup-detail-polozek") as HTMLTableSectionElement;
        const detailCelkovaCena = document.getElementById("detail-celkova-cena") as HTMLElement;

        detailNazevAuta.innerText = vybraneAuto.getNazevAuta();
        vystupDetailPolozek.innerHTML = "";

        const polozkyAuta = vybraneAuto.getSeznamPolozek();

        if (polozkyAuta.length === 0) {
            vystupDetailPolozek.innerHTML = '<tr><td colspan="5" class="text-center">Toto auto nemá přiřazené žádné položky.</td></tr>';
        } else {
            polozkyAuta.forEach(polozka => {
                const tr = document.createElement("tr");
                const jePrace = polozka instanceof Prace;
                const typText = jePrace ? "Práce" : "Materiál";
                const badgeClass = jePrace ? "badge badge-prace" : "badge badge-material";

                tr.innerHTML = `
                    <td><span class="${badgeClass}">${typText}</span></td>
                    <td>${polozka.getNazev()}</td>
                    <td>${polozka.getZakladniCena().toFixed(2)} Kč</td>
                    <td>${polozka.getFormatovaneMnozstvi()}</td>
                    <td><strong>${polozka.vypocitejCenu().toFixed(2)} Kč</strong></td>
                `;
                vystupDetailPolozek.appendChild(tr);
            });
        }

        detailCelkovaCena.innerText = `${vybraneAuto.getCelkovaCena().toFixed(2)} Kč`;
        sekceDetailAuta.classList.remove("hidden");
    }

    // Událost pro formulář přidání auta
    formAuto.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputAutoNazev = document.getElementById("auto-nazev") as HTMLInputElement;

        try {
            const novaZakazka = new Zakazka(inputAutoNazev.value);
            globalniSeznamZakazek.push(novaZakazka);
            
            inputAutoNazev.value = "";
            prekresliSystem();
        } catch (err: any) {
            alert("Chyba při registraci vozidla: " + err.message);
        }
    });

    // Událost pro formulář přidání položek
    formPolozka.addEventListener("submit", (e) => {
        e.preventDefault();

        const indexAuta = parseInt(vyberAutaPolozka.value);
        if (isNaN(indexAuta)) {
            alert("Prosím vyberte vozidlo.");
            return;
        }

        const vybraneCheckboxy = document.querySelectorAll('input[name="polozka-ceniku"]:checked') as NodeListOf<HTMLInputElement>;
        
        if (vybraneCheckboxy.length === 0) {
            alert("Musíte zaškrtnout alespoň jeden servisní úkon.");
            return;
        }

        const vybraneAuto = globalniSeznamZakazek[indexAuta];

        try {
            vybraneCheckboxy.forEach(checkbox => {
                const indexCeniku = parseInt(checkbox.value);
                const dataUkonu = surovaDataZakazky[indexCeniku];

                // Vytvoření práce
                const novaPrace = new Prace(dataUkonu.prace.nazev, dataUkonu.prace.cena, dataUkonu.prace.hodiny);
                vybraneAuto.pridatPolozku(novaPrace);

                // Vytvoření materiálů
                if (dataUkonu.material && dataUkonu.material.length > 0) {
                    dataUkonu.material.forEach((mat: any) => {
                        const novyMaterial = new Material(mat.nazev, mat.cena, mat.mnozstvi, mat.marze);
                        vybraneAuto.pridatPolozku(novyMaterial);
                    });
                }
            });

            prekresliSystem();

            if (indexAuta === indexZobrazenehoAuta) {
                zobrazDetailKalkulaceAuta(indexAuta);
            }

            vybraneCheckboxy.forEach(cb => cb.checked = false);

        } catch (err: any) {
            alert("Chyba při přiřazování položky: " + err.message);
        }
    });
});