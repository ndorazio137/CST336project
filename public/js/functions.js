$(document).ready(function() {

   // some data structure holders

   //create cart. Map for constant lookup and deletion, plus iteration on keys. 
   var cart = new Map();


   //push database product values to data structure holders

   //send form with hidden values to site html div

   //create form to dynamically fill sales grid divs //TO BE TESTED
   function createProduct(image, name, price, id) {
      //<div class="box blue-box product-container">
      let div = document.createElement("div");
      div.setAttribute("class", "box blue-box product-container");

      //<form action="/addToCart" method="POST"></form>
      let form = document.createElement("form");

      //<img src=image> 
      let productImage = document.createElement('img');
      productImage.src = image;

      //<h5>Product Name</h5>
      let productName = document.createElement("h5");
      productName.value = name;

      //<p>Price</p>
      let priceTag = document.createElement("p");
      priceTag.value = price.toString() + "Denar";

      //<input type="hidden" name="product_id" value=id>
      let hiddenId = document.createElement("input");
      hiddenId.setAttribute("type", "hidden");
      hiddenId.setAttribute("name", "product_id");
      hiddenId.setAttribute("value", id.toString());

      //<input type="hidden" name="product_name" value=name>
      let hiddenName = document.createElement("input");
      hiddenName.setAttribute("type", "hidden");
      hiddenName.setAttribute("name", "product_name");
      hiddenName.setAttribute("value", name.toString());

      //<input type="hidden" name="product_price" value=price>
      let hiddenPrice = document.createElement("input");
      hiddenPrice.setAttribute("type", "hidden");
      hiddenPrice.setAttribute("name", "product_price");
      hiddenPrice.setAttribute("value", price.toString());

      //<input class="add-to-cart" type="submit" value="Add To Cart">
      let submitButton = document.createElement("input");
      submitButton.setAttribute("class", "add-to-cart");
      submitButton.setAttribute("type", "submit");
      submitButton.setAttribute("value", "Add To Cart");

      form.appendChild(productImage);
      form.appendChild(productName);
      form.appendChild(priceTag);
      form.appendChild(hiddenId);
      form.appendChild(hiddenName);
      form.appendChild(hiddenPrice);
      form.appendChild(submitButton);

      div.appendChild(form);

      return div;
   }


});
