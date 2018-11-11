function browseProducts() {
    var productsCollection = firebase.firestore().collection('products');
    var limit = 2;
    var cursor = null;

    var lock = false;

    function loadProducts() {
        if (lock) {
            return;
        }
        lock = true;
        $('#loader').removeClass('hide');
        var query = productsCollection.orderBy('timestamp', 'desc')
        if (cursor) {
            query = query.startAfter(cursor)
        }
        query.limit(limit).get().then(function(snapshot) {
            snapshot.forEach(function(product) {
                cursor = product;
                renderProduct(product.id, product.data());
            });

            if (snapshot.size < limit) {
                $('#see-more').addClass('hide');
            } else {
                $('#see-more').removeClass('hide');
            }
            lock = false;
            $('#loader').addClass('hide');
        });
    };
    loadProducts();

    (function enableSeeMore() {
        $('#see-more').on('click', function(e) {
            e.preventDefault();
            loadProducts();
        });
    })();

    function renderProduct(id, product) {
        var template = $('<div class="col m3 s6">' +
          '<div class="card hoverable">' +
            '<div class="card-image waves-effect waves-block waves-light">' +
              '<img class="activator" src="' + product.imageUrl + '">' +
            '</div>' +
            '<div class="card-content">' +
              '<span class="card-title activator grey-text text-darken-4">' + product.name + '<i class="material-icons right">more_vert</i></span>' +
              '<p><a href="/product.html?product=' + id + '">Buy</a></p>' +
            '</div>' +
            '<div class="card-reveal">' +
              '<span class="card-title grey-text text-darken-4">' + product.name + '<i class="material-icons right">close</i></span>' +
              '<p>' + product.description + '</p>' +
            '</div>' +
          '</div>' +
        '</div>');
        $('#products-list').append(template);
    }
}

$(document).ready(browseProducts);