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

});
