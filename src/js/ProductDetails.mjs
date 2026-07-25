import { getLocalStorage, setLocalStorage, cartSuperscript } from "./utils.mjs";

export default class ProductDetails {

    constructor(productId, dataSource){
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        document
            .getElementById("addToCart")
            .addEventListener("click", this.addProductToCart.bind(this));

        this.renderComments();
        document
            .getElementById("commentForm")
            .addEventListener("submit", this.addComment.bind(this));
    }

    addProductToCart() {
        const cartItems = getLocalStorage("so-cart") || [];
        cartItems.push(this.product);
        setLocalStorage("so-cart", cartItems);
        cartSuperscript();
    }

    renderProductDetails() {
        const mainElement = document.querySelector("main");
        if (mainElement) {
            mainElement.innerHTML = productDetailsTemplate(this.product);
        }
    }

    getProductComments() {
        const allComments = getLocalStorage("so-comments") || {};
        return allComments[this.product.Id] || [];
    }

    addComment(event) {
        event.preventDefault();

        const nameInput = document.getElementById("commentName");
        const textInput = document.getElementById("commentText");
        const name = nameInput.value.trim();
        const text = textInput.value.trim();

        if (!name || !text) {
            return;
        }

        const allComments = getLocalStorage("so-comments") || {};
        const productComments = allComments[this.product.Id] || [];

        productComments.push({
            name,
            text,
            date: new Date().toISOString(),
        });

        allComments[this.product.Id] = productComments;
        setLocalStorage("so-comments", allComments);

        nameInput.value = "";
        textInput.value = "";

        this.renderComments();
    }

    renderComments() {
        const list = document.getElementById("commentsList");
        if (!list) {
            return;
        }

        const productComments = this.getProductComments();

        if (productComments.length === 0) {
            list.innerHTML = `<li class="comment-empty">No comments yet. Be the first to comment!</li>`;
            return;
        }

        list.innerHTML = productComments
            .map((comment) => commentTemplate(comment))
            .join("");
    }
}

function productDetailsTemplate(product) {
    const brandName = product.Brand ? product.Brand.Name : "Sleep Outside";
    const colorName = (product.Colors && product.Colors[0]) ? product.Colors[0].ColorName : "Standard";

    return `<section class="product-detail">
        <h3>${brandName}</h3>
        <h2 class="divider">${product.NameWithoutBrand}</h2>
        <img class="divider" id="productImage" src="${product.Image}" alt="${product.NameWithoutBrand}" />
        <p id="productPrice" class="product-card__price">$${product.FinalPrice}</p>
        <p id="productColor" class="product__color">${colorName}</p>
        <p id="productDesc" class="product__description">${product.DescriptionHtmlSimple}</p>
        <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
        </div>
        </section>
        <section class="product-comments">
        <h3>Customer Comments</h3>
        <ul id="commentsList" class="comments-list"></ul>
        <form id="commentForm" class="comment-form">
            <label for="commentName">Name</label>
            <input type="text" id="commentName" name="commentName" required />
            <label for="commentText">Comment</label>
            <textarea id="commentText" name="commentText" required></textarea>
            <button type="submit">Submit Comment</button>
        </form>
        </section>`;
}

function commentTemplate(comment) {
    const formattedDate = new Date(comment.date).toLocaleDateString();
    return `<li class="comment-item">
        <p class="comment-item__name">${comment.name}</p>
        <p class="comment-item__text">${comment.text}</p>
        <p class="comment-item__date">${formattedDate}</p>
        </li>`;
}