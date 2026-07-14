import { renderListWithTemplate } from "./utils.mjs";

// The class "ProductList"
export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list = await this.dataSource.getData();
        // console.log(list);
        this.renderList(list);
    }
    renderList(list) {
        // const htmlStrings = list.map(productCardTemplate);
        // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));
        renderListWithTemplate(productCardTemplate, this.listElement, list, "afterbegin", true);
    }
}

// Template used to display product
function productCardTemplate(product) {
    return `
        <li class="product-card">
        <a href="product_pages/?product=${product.Id}">
            <img src="${product.Image}" alt="${product.Name}">
            <h3 class="card__brand">${product.Brand.Name}</h3>
            <h2 class="card__name">${product.DescriptionHtmlSimple}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p>
        </a>
        </li>
    `;
}
