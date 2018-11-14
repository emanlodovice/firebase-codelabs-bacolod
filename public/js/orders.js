var adminsCollection = firebase.firestore().collection('admins');
var productCollection = firebase.firestore().collection('products');
var ordersCollection = firebase.firestore().collection('orders');

function orders(user, isAdmin) {
    var limit = 2;
    var cursor = null;

    var lock = false;

    function loadOrders() {
        if (lock) {
            return;
        }
        lock = true;
        var query = ordersCollection;
        $('#loader').removeClass('hide');
        if (!isAdmin) {
            query = query.where('uid', '==', user.uid)
        }
        query = query.orderBy('timestamp', 'desc').limit(limit)
        if (cursor) {
            query = query.startAfter(cursor);
        }
        query.get().then(function(snapshot) {
            snapshot.forEach(function(order) {
                cursor = order;
                renderOrder(order.id, order.data());
            });

            if (snapshot.size < limit) {
                $('#see-more').addClass('hide');
            } else {
                $('#see-more').removeClass('hide');
            }
            lock = false;
            $('#loader').addClass('hide');
        });
    }
    loadOrders();

    (function enableSeeMore() {
        $('#see-more').on('click', function(e) {
            e.preventDefault();
            loadOrders();
        });
    })();

    (function enableFulfill() {
        $(document).on('click', '.fulfill', function(e) {
            var button = $(this);
            var orderId = button.data('id');
            ordersCollection.doc(orderId).set({
                'status': 'done'
            }, {merge: true}).then(function(snapshot) {
                button.remove();
                M.toast({html: 'Order Fulfilled', classes: 'rounded'});
            });
        });
    })();

    function renderOrder(orderId, order) {
        var productPromise = productCollection.doc(order.product).get().then(function(snapshot) {
            var product = snapshot.data();
            var cost = parseFloat(product.price) * parseFloat(order.quantity);
            var template = '<div class="col s12 offset-m1 m10" id="' + orderId + '">' +
                  '<div class="col s4 m2">' +
                    '<img src="' + product.imageUrl + '" alt="" width="100%">' +
                  '</div>' +
                  '<div class="col s8 m7">' +
                    '<h5>' + product.name + '</h5>' +
                    '<h6>P ' + cost.toFixed(2) + ' for ' + order.quantity + ' items</h6>' +
                    '<p>' + order.firstName + ' ' + order.lastName +'</p>' +
                    '<p>' + order.address +'</p>';
            if (isAdmin && order.status) {
                template += '<p>' + order.status + '</p>'
            }
            template += '</div>';
            if (isAdmin && order.status == 'pending') {
                template += '<div class="col s12 m3 center-align">' +
                    '<a class="waves-effect waves-light btn-large red darken-1 fulfill" data-id="' + orderId + '"><i class="material-icons left">add_shopping_cart</i>Fulfill</a>' +
                  '</div>';
            }
            template += '</div>';
            $('#orders').append(template);
        });
    }
}

$(window).on('auth', function(e, user) {
    if (user) {
        adminsCollection.doc(user.uid).get().then(function(snapshot) {
            orders(user, snapshot.exists);
        });
    } else {
        window.location = '/';
    }
});