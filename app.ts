// Abstraktní bázová třída pro položky servisu
abstract class PolozkaServisu {
    // Chráněné atributy třídy
    protected _nazev: string;
    protected _zakladniCena: number;

    // Konstruktor s validací vstupních dat
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

    // Veřejná metoda pro získání názvu
    public getNazev(): string {
        return this._nazev;
    }

    // Veřejná metoda pro získání základní jednotkové ceny
    public getZakladniCena(): number {
        return this._zakladniCena;
    }

    // Předpis abstraktní metody pro výpočet ceny
    public abstract vypocitejCenu(): number;

    // Abstraktní metoda pro textové vyjádření množství/času v tabulce
    public abstract getFormatovaneMnozstvi(): string;
}

// Třída reprezentující odvedenou práci (potomek PolozkaServisu)
class Prace extends PolozkaServisu {
    // Soukromý atribut pro hodiny
    private _pocetHodin: number;

    // Konstruktor třídy Prace s validací hodin
    constructor(nazev: string, hodinovaSazba: number, pocetHodin: number) {
        super(nazev, hodinovaSazba);
        if (pocetHodin <= 0) {
            throw new Error(`Počet hodin u úkonu "${nazev}" musí být větší než 0.`);
        }
        this._pocetHodin = pocetHodin;
    }

    // Implementace výpočtu ceny pro práci (sazba * hodiny)
    public vypocitejCenu(): number {
        return this._zakladniCena * this._pocetHodin;
    }

    // Navrácení formátovaného času
    public getFormatovaneMnozstvi(): string {
        return `${this._pocetHodin} hod`;
    }
}

// Třída reprezentující použitý materiál (potomek PolozkaServisu)
class Material extends PolozkaServisu {
    // Soukromé atributy pro množství a marži
    private _mnozstvi: number;
    private _marze: number;

    // Konstruktor třídy Material s validací množství a marže
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

    // Implementace výpočtu ceny pro materiál (cena * množství * marže)
    public vypocitejCenu(): number {
        return this._zakladniCena * this._mnozstvi * this._marze;
    }

    // Navrácení formátovaného množství včetně procentuální přirážky marže
    public getFormatovaneMnozstvi(): string {
        const procentoMarze = Math.round((this._marze - 1) * 100);
        return `${this._mnozstvi} ks (marže ${procentoMarze}%)`;
    }
}

// Třída pro správu jedné zakázky konkrétního automobilu
class Zakazka {
    // Soukromé atributy instancí
    private _nazevAuta: string;
    private _seznamPolozek: PolozkaServisu[] = [];

    constructor(nazevAuta: string) {
        if (!nazevAuta || nazevAuta.trim() === "") {
            throw new Error("Název automobilu nesmí být prázdný.");
        }
        this._nazevAuta = nazevAuta;
    }

    // Getter pro název auta
    public getNazevAuta(): string {
        return this._nazevAuta;
    }

    // Getter pro pole všech položek navázaných na auto
    public getSeznamPolozek(): PolozkaServisu[] {
        return this._seznamPolozek;
    }

    // Metoda pro přidání položky do pole servisu
    public pridatPolozku(polozka: PolozkaServisu): void {
        this._seznamPolozek.push(polozka);
    }

    // Metoda pro výpočet sumy celé zakázky (Využití Polymorfismu)
    public getCelkovaCena(): number {
        let celkem = 0;
        for (const polozka of this._seznamPolozek) {
            celkem += polozka.vypocitejCenu();
        }
        return celkem;
    }

    // Pomocná metoda, která vygeneruje textový seznam přidaných prací pro hlavní přehledovou tabulku
    public getZjednodusenyPrehledUkonu(): string {
        if (this._seznamPolozek.length === 0) {
            return "Žádné zadané úkony";
        }
        return this._seznamPolozek.map(p => p.getNazev()).join(", ");
    }
}

// --- LOGIKA ŘÍZENÍ APLIKACE A OPERACE NAD DOM ---

const globalniSeznamZakazek: Zakazka[] = [];
let indexZobrazenehoAuta: number = -1;

document.addEventListener("DOMContentLoaded", () => {
    const formAuto = document.getElementById("form-auto") as HTMLFormElement;
    const formPolozka = document.getElementById("form-polozka") as HTMLFormElement;
    
    const vyberAutaPolozka = document.getElementById("vyber-auta-polozka") as HTMLSelectElement;
    
    // Kontejner pro výpis ucelených servisních balíčků
    const checkboxyUkony = document.getElementById("checkboxy-ukony") as HTMLElement;
    
    const vystupSeznamAut = document.getElementById("vystup-seznam-aut") as HTMLTableSectionElement;
    const sekceDetailAuta = document.getElementById("sekce-detail-auta") as HTMLElement;

    // Inicializační naplnění checkboxů z datového pole
    if (typeof surovaDataZakazky !== "undefined" && Array.isArray(surovaDataZakazky)) {
        surovaDataZakazky.forEach((ukon: any, index: number) => {
            const label = document.createElement("label");
            label.className = "checkbox-polozka";
            
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = index.toString();
            checkbox.name = "polozka-ceniku";
            
            label.appendChild(checkbox);
            // Výpis názvu úkonu pro uživatele
            label.appendChild(document.createTextNode(` ${ukon.nazevUkonu}`));
            
            checkboxyUkony.appendChild(label);
        });
    }

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

    // PŘEPRACOVANÉ: Čtení komplexních úkonů a automatické doplňování materiálu
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
            // Projití všech vybraných úkonů z formuláře
            vybraneCheckboxy.forEach(checkbox => {
                const indexCeniku = parseInt(checkbox.value);
                const dataUkonu = surovaDataZakazky[indexCeniku];

                // 1. Vytvoření a přidání objektu pro čistou PRÁCI
                const novaPrace = new Prace(dataUkonu.prace.nazev, dataUkonu.prace.cena, dataUkonu.prace.hodiny);
                vybraneAuto.pridatPolozku(novaPrace);

                // 2. Cyklus pro automatické přidání veškerého navázaného MATERIÁLU
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

            // Odškrtnutí po uložení
            vybraneCheckboxy.forEach(cb => cb.checked = false);

        } catch (err: any) {
            alert("Chyba při přiřazování položky: " + err.message);
        }
    });
});