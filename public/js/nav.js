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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#nav-user').addClass('logout').html('<img src=" ' + user.photoURL + '" width="30px" style="margin-top: 18px">');
    }
    $(window).trigger('auth', user);
});

$(document).ready(handleNav);