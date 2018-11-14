function handleNav() {
    $('#search-icon').on('click', function(e) {
        e.preventDefault();
        $('.main-nav-content').addClass('hide');
        $('#search-form').removeClass('hide');
        $('#search').focus();
    });

    $('#close-search').on('click', function(e) {
        e.preventDefault();
        $('.main-nav-content').removeClass('hide');
        $('#search-form').addClass('hide');
    });

    $('nav').on('click', '.logout', function(e) {
        e.preventDefault();
        firebase.auth().signOut().then(function() {
            window.location = '/login.html'
        });
    });
}

function enableMessaging() {
    var messaging = firebase.messaging();
    messaging.usePublicVapidKey("BBW-bj5T-lLmluj9m0abIVGAyKx4nalZf22xesuBct2VmRsEs2MxKZmcqzWItu2-FsgNLEqZpszM1d1k4g5hzhg");

    function requestPermission() {
        messaging.requestPermission().then(function() {
            getToken();
            messaging.onTokenRefresh(getToken);
        }).catch(function(err) {
            console.log('Permission denied.', err);
        });
    }

    function getToken() {
        messaging.getToken().then(function(token) {
            if (token) {
                var uid = firebase.auth().currentUser.uid;
                // save token to db
                firebase.firestore().collection('tokens').doc(uid).set({
                    token: token
                });
            }
        }).catch(function(err) {
            console.log('Failed to retrieve token.');
        });;
    }

    requestPermission();

    messaging.onMessage(function(payload) {
        var notification = payload.notification;
        M.toast({html: '<a href="' + notification.click_action + '">Your order was fulfilled.</a>', classes: 'rounded'});
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#nav-user').addClass('logout').html('<img src=" ' + user.photoURL + '" width="30px" style="margin-top: 18px">');
        enableMessaging();
    }
    $(window).trigger('auth', user);
});

$(document).ready(handleNav);