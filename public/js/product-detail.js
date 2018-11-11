function productDetail() {
    var url = new URL(window.location);
    var urlParams = new URLSearchParams(url.search);
    var productId = urlParams.get('product');

    if (!productId) {
        window.location = '/';
    }

    (function renderProduct() {
        var productsCollection = firebase.firestore().collection('products');
        productsCollection.doc(productId).get().then(function(snapshot) {
            if(!snapshot.exists) {
                window.location = '/';
            }
            var product = snapshot.data();

            $('#image-preview').attr('src', product.imageUrl);
            $('#name').text(product.name);
            $('#description').text(product.description);
            $('#price').text('P ' + parseFloat(product.price).toFixed(2));
            $('#checkout').attr('href', '/checkout.html?product=' + productId);

            $('#product-detail').removeClass('hide');
            $('#loader').addClass('hide');
        });
    })();
}

$(document).ready(productDetail);