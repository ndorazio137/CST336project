$(document).ready(function() {

    $(".add-to-cart").on("click", function(event) {
        event.preventDefault();

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let product_id = urlParams.get("product_id");
        let product_name = urlParams.get("product_name");
        let product_price = urlParams.get("product_price");

        $.ajax({
            method: "GET",
            url: "/api/addToCart",
            data: {
                "product_id": product_id,
                "product_name": product_name,
                "product_price": product_price
            },
            success: function(data, status) {
                console.log("Returned from addToCart AJAX");
            }
        }); //ajax
    });

    $("#addProduct").on("submit", function(event) {
        event.preventDefault();

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let product_name = urlParams.get("product_name");
        let product_category = urlParams.get("product_category");
        let product_price = urlParams.get("product_price");
        let product_description = urlParams.get("product_description");
        let product_image = urlParams.get("product_image");
        let product_quantity = urlParams.get("product_quantity");

        $.ajax({
            method: "POST",
            url: "/api/addProduct",
            data: {
                "product_name": product_name,
                "product_category": product_category,
                "product_price": product_price,
                "product_description": product_description,
                "product_image": product_image,
                "product_quantity": product_quantity
            },
            success: function(data, status) {
                console.log("Returned from addProduct AJAX");
            }
        });
    });
});
