// TYPE: representa una licencia de software
export class License {
    constructor(id, software, version, price, key, featured, discount, category, image) {
        this.id = id;
        this.software = software;
        this.version = version;
        this.price = price;
        this.key = key;
        this.featured = featured;   // true / false
        this.discount = discount;   // porcentaje (0, 10, 20...)
        this.category = category;
        this.image = image;
    }

    // Precio una vez aplicado el descuento
    getFinalPrice() {
        return this.price - (this.price * this.discount / 100);
    }

    // Dibuja la tarjeta del producto dentro del elemento "parent"
    Render(parent) {
        let card = document.createElement("div");
        card.className = "card";

        let html = "<img src='" + this.image + "' alt='" + this.software + "' class='thumb'>";
        html += "<h3>" + this.software + " v" + this.version + "</h3>";
        html += "<p class='category'>" + this.category + "</p>";

        if (this.featured) {
            html += "<span class='tag featured'>Destacada</span>";
        }

        if (this.discount > 0) {
            html += "<span class='tag offer'>-" + this.discount + "%</span>";
            html += "<p class='price'><s>" + this.price + " €</s> <strong>" + this.getFinalPrice().toFixed(2) + " €</strong></p>";
        } else {
            html += "<p class='price'><strong>" + this.price + " €</strong></p>";
        }
        card.innerHTML = html;

        let button = document.createElement("button");
        button.textContent = "Comprar";
        button.addEventListener("click", () => this.Buy());
        card.appendChild(button);

        parent.appendChild(card);
    }

    // Muestra la key en una ventanita (modal)
    Buy() {
        let overlay = document.createElement("div");
        overlay.className = "overlay";

        let box = document.createElement("div");
        box.className = "modal";
        box.innerHTML = "<h2>¡Compra realizada!</h2>" +
            "<p>" + this.software + " v" + this.version + "</p>" +
            "<p>Tu clave de licencia es:</p>" +
            "<code>" + this.key + "</code>";

        let close = document.createElement("button");
        close.textContent = "Cerrar";
        close.addEventListener("click", () => overlay.remove());

        box.appendChild(close);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }
}
