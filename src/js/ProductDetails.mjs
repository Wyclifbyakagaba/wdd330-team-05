import { getLocalStorage, setLocalStorage, cartSuperscript } from "./utils.mjs";

// Default CLASS
export default class ProductDetails {
  constructor(productId, dataSource){
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }  
  
  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
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
}

// Does this function need to be exported?
export function getDiscountInfo(product) {
  if (!product) return null;

  const suggestedRetailPrice = Number(product.SuggestedRetailPrice);
  const finalPrice = Number(product.FinalPrice);

  if (Number.isNaN(suggestedRetailPrice) || Number.isNaN(finalPrice)) return null;
  if (finalPrice >= suggestedRetailPrice) return null;

  const amount = Number((suggestedRetailPrice - finalPrice).toFixed(2));

  return {
    amount,
    message: `Save $${amount.toFixed(2)}!`
  };
}

// Returns a number in US currency format "$12.34"
function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

// Returns a template for the product to be displayed
function productDetailsTemplate(product) {
  const brandName = product.Brand ? product.Brand.Name : "Sleep Outside";
  const colorName = (product.Colors && product.Colors[0]) ? product.Colors[0].ColorName : "Standard";

  const discountInfo = getDiscountInfo(product);
  // If "FinalPrice" < "SuggestedRetailPrice" = Display discount
  if (discountInfo) {
    const finalPrice = formatCurrency(product.FinalPrice);
    const originalPrice = formatCurrency(product.SuggestedRetailPrice);
    return `
    <section class="product-detail">
      <h3>${brandName}</h3>
      <h2 class="divider">${product.NameWithoutBrand}</h2>
      <img class="divider" id="productImage" src="${product.Image}" alt="${product.NameWithoutBrand}" />

      <p id="productPrice" class="product-card__price">${finalPrice}</p>
      <p id="productOriginalPrice" class="product-card__price">MSRP: ${originalPrice}</p>
      <p id="discountIndicator" class="product-card__price">${discountInfo.message}</p>
      
      <p id="productColor" class="product__color">${colorName}</p>
      <p id="productDesc" class="product__description">${product.DescriptionHtmlSimple}</p>
      <div class="product-detail__add">
        <button id="addToCart" data-id="${product.Id}">Add to Cart</button>
      </div>
    </section>
    `;

  } else {
    return `
    <section class="product-detail">
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
    `;
  }
}

// ************* Alternative Display Product Details Method *******************
//  function productDetailsTemplate(product) {
//   document.querySelector("h2").textContent = product.Brand.Name;
//   document.querySelector("h3").textContent = product.NameWithoutBrand;

//   const productImage = document.getElementById("productImage");
//   productImage.src = product.Image;
//   productImage.alt = product.NameWithoutBrand;

//   const discountInfo = getDiscountInfo(product);
//    const productPrice = document.getElementById("productPrice");
//   //  ???
//   const originalPrice = document.getElementById("productOriginalPrice");
//   const discountIndicator = document.getElementById("discountIndicator");

//   productPrice.textContent = formatCurrency(product.FinalPrice);

//   if (discountInfo) {
//     originalPrice.textContent = formatCurrency(product.SuggestedRetailPrice);
//     originalPrice.classList.remove("hidden");
//     discountIndicator.textContent = discountInfo.message;
//     discountIndicator.classList.remove("hidden");
//   } else {
//     originalPrice.textContent = "";
//     originalPrice.classList.add("hidden");
//     discountIndicator.textContent = "";
//     discountIndicator.classList.add("hidden");
//   }

//   document.getElementById("productColor").textContent = product.Colors?.[0]?.ColorName || "N/A";
//   document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

//   document.getElementById("addToCart").dataset.id = product.Id;
// }


