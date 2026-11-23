// CONTROLLER: decide qué licencias se muestran y en qué orden
import { License } from "../types/license.js";

export class LicenseController {
    constructor(data) {
        // Convertimos cada objeto del JSON en un objeto License
        this.licenses = [];
        for (let i = 0; i < data.length; i++) {
            let d = data[i];
            this.licenses.push(new License(d.id, d.software, d.version, d.price, d.key, d.featured, d.discount, d.category, d.image));
        }
        // Copia en orden aleatorio (se mezcla una sola vez)
        this.randomOrder = this.licenses.slice().sort(() => Math.random() - 0.5);
    }

    // Lista de programas sin repetir (para el filtro)
    getSoftwareNames() {
        let names = [];
        for (let i = 0; i < this.licenses.length; i++) {
            if (!names.includes(this.licenses[i].software)) {
                names.push(this.licenses[i].software);
            }
        }
        return names.sort();
    }

    // Muestra los primeros "count" destacados
    RenderFeatured(count, parent) {
        parent.innerHTML = "";
        let featured = this.licenses.filter(l => l.featured);
        for (let i = 0; i < count && i < featured.length; i++) {
            featured[i].Render(parent);
        }
    }

    // Muestra los primeros "count" con descuento, de mayor a menor descuento
    RenderOffers(count, parent) {
        parent.innerHTML = "";
        let offers = this.licenses.filter(l => l.discount > 0);
        offers.sort((a, b) => b.discount - a.discount);
        for (let i = 0; i < count && i < offers.length; i++) {
            offers[i].Render(parent);
        }
    }

    // Muestra la última versión de cada software (máximo "count")
    RenderLatest(count, parent) {
        parent.innerHTML = "";
        let latest = [];
        for (let i = 0; i < this.licenses.length; i++) {
            let current = this.licenses[i];
            let found = false;
            for (let j = 0; j < latest.length; j++) {
                if (latest[j].software === current.software) {
                    found = true;
                    // Si esta versión es mayor, sustituimos la que teníamos
                    if (parseFloat(current.version) > parseFloat(latest[j].version)) {
                        latest[j] = current;
                    }
                }
            }
            if (!found) {
                latest.push(current);
            }
        }
        for (let i = 0; i < count && i < latest.length; i++) {
            latest[i].Render(parent);
        }
    }

    // Muestra "count" licencias en orden aleatorio, aplicando filtros
    RenderAll(count, parent, search, software, onlyOffers) {
        parent.innerHTML = "";
        let shown = 0;
        for (let i = 0; i < this.randomOrder.length && shown < count; i++) {
            let l = this.randomOrder[i];
            let okSearch = l.software.toLowerCase().includes(search.toLowerCase());
            let okSoftware = (software === "" || l.software === software);
            let okOffer = (!onlyOffers || l.discount > 0);
            if (okSearch && okSoftware && okOffer) {
                l.Render(parent);
                shown++;
            }
        }
        if (shown === 0) {
            parent.innerHTML = "<p>No hay licencias con esos filtros.</p>";
        }
        return shown;
    }
}
