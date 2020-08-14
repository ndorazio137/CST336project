$(document).ready(function() {

    $(".add-to-cart").on("click", function(event) {
        event.preventDefault();

        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let product_id = urlParams.get("product_id");

        $.ajax({
            method: "POST",
            url: "/api/addToCart",
            data: {
                "product_id": product_id
            },
            success: function(data, status) {
                console.log("Returned from addToCart AJAX");
            }
        }); //ajax
    });

    $(".remove-cart-item").on("click", function() {
        let queryString = window.location.search;
        let urlParams = new URLSearchParams(queryString);
        let product_id = urlParams.get("product_id");

        $.ajax({
            method: "POST",
            url: "/api/removeFromCart",
            data: {
                "product_id": product_id
            },
            success: function(data, status) {
                console.log("Deleted From Cart");
            }
        });
    });

    $("#updateProduct").on("click", function(event) {
        event.preventDefault();
    });
});
