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
}

$(document).ready(handleNav);