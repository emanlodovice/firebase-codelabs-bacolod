function checkout() {
    var url = new URL(window.location);
    var urlParams = new URLSearchParams(url.search);
    var productId = urlParams.get('product');

    if (!productId) {
        window.location = '/';
    }

    var product = null;

    (function renderProduct() {
        var productsCollection = firebase.firestore().collection('products');
        productsCollection.doc(productId).get().then(function(snapshot) {
            if(!snapshot.exists) {
                window.location = '/';
            }
            product = snapshot.data();

            $('#image-preview').attr('src', product.imageUrl);
            $('#name').text(product.name);
            $('#description').text(product.description);
            $('#price').text('P ' + parseFloat(product.price).toFixed(2));
            $('#checkout').attr('href', '/checkout.html?product=' + productId);

            updateTotalCost();

            $('#product-detail').removeClass('hide');
            $('#loader').addClass('hide');
        });
    })();

    function updateTotalCost() {
        var quantity = $('#quantity').val();
        var cost = parseFloat(product.price) *  quantity;
        $('#total').val('P ' + cost.toFixed(2));
    }

    (function enableQuantityChange() {
        $('#quantity').on('change', updateTotalCost);
    })();

    (function enableCheckout() {
        var ordersCollection = firebase.firestore().collection('orders');
        var lock = false;

        $('#checkout-form').on('submit', function(e) {
            e.preventDefault();
            if (lock) {
                return;
            }
            lock = true;
            $('#pay').addClass('hide');
            $('#loader').removeClass('hide');

            var quantity = $('#quantity').val();
            var fname = $('#first_name').val();
            var lname = $('#last_name').val();
            var address =  $('#address').val();
            var contact = $('#contact').val();
            var uid = firebase.auth().currentUser.uid;

            ordersCollection.add({
                product: productId,
                uid: uid,
                quantity: quantity,
                firstName: fname,
                lastName: lname,
                address: address,
                contact: contact,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(order) {
                order.onSnapshot(function(updatedOrder) {
                    var newOrderData = updatedOrder.data();
                    console.log(newOrderData);
                    if (newOrderData.paypalRedirectUrl) {
                        window.location = newOrderData.paypalRedirectUrl;
                    } else if (newOrderData.status == 2) {
                        M.toast({html: 'Failed to process order.', classes: 'rounded'});
                        $('#pay').removeClass('hide');
                        $('#loader').addClass('hide');
                    }
                });
            }).catch(function(error) {
                M.toast({html: error.message, classes: 'rounded'});
                lock = false;
                $('#pay').removeClass('hide');
                $('#loader').addClass('hide');
            });
        });
    })();;
}

$(document).ready(checkout);

$(window).on('auth', function(e, user) {
    if (!user) {
        window.location = '/login.html'
    }
});