// APP: carga los datos y controla qué se muestra y dónde
import { LicenseController } from "./controllers/licenseController.js";

export class App {
    constructor() {
        this.controller = null;
    }

    async start() {
        // 1. Cargar el JSON
        let response = await fetch("data/license.json");
        let data = await response.json();

        // 2. Crear el controlador
        this.controller = new LicenseController(data);

        // 3. Dibujar las secciones en orden
        this.controller.RenderFeatured(3, document.getElementById("featured"));
        this.controller.RenderOffers(3, document.getElementById("offers"));
        this.controller.RenderLatest(3, document.getElementById("latest"));

        // 4. Catálogo completo con filtros
        this.setupFilters();
        this.renderAll();
    }

    setupFilters() {
        // Rellenar el desplegable con los programas
        let select = document.getElementById("f-software");
        let names = this.controller.getSoftwareNames();
        for (let i = 0; i < names.length; i++) {
            select.add(new Option(names[i], names[i]));
        }

        // Cada vez que el usuario cambia un filtro, se vuelve a dibujar
        document.getElementById("f-search").addEventListener("input", () => this.renderAll());
        select.addEventListener("change", () => this.renderAll());
        document.getElementById("f-offers").addEventListener("change", () => this.renderAll());
    }

    renderAll() {
        let search = document.getElementById("f-search").value;
        let software = document.getElementById("f-software").value;
        let onlyOffers = document.getElementById("f-offers").checked;
        // Infinity = mostrar todas las que cumplan los filtros
        let n = this.controller.RenderAll(Infinity, document.getElementById("all"), search, software, onlyOffers);
        document.getElementById("count").textContent = n + " licencias";
    }
}
