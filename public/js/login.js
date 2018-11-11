var fromCreateFormName = '';

function login() {
    
    (function googleLogin() {
        var provider = new firebase.auth.GoogleAuthProvider();

        $('#google-login').on('click', function(e) {
            firebase.auth().signInWithPopup(provider).then(function(result){
                console.log(result.user);
            }).catch(function(error) {
                M.toast({html: error.message, classes: 'rounded'});
            });
        });
    })();

    (function createAccount() {
        $('#create-account-form').on('submit', function(e) {
            e.preventDefault();

            fromCreateFormName = $('#c-name').val();
            var email = $('#c-email').val();
            var password = $('#c-password').val();

            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                M.toast({html: error.message, classes: 'rounded'});
                fromCreateFormName = '';
            });
        });
    })();

    (function loginForm() {
        $('#login-form').on('submit', function(e) {
            e.preventDefault();

            var email = $('#l-email').val();
            var password = $('#l-password').val();

            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                M.toast({html: 'Invalid Email or Password!', classes: 'rounded'});
            });
        });
    })();
}

$(window).on('auth', function(e, user) {
    if (user) {
        if (fromCreateFormName) {
            user.updateProfile({
                displayName: fromCreateFormName,
                photoURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/User_with_smile.svg/256px-User_with_smile.svg.png'
            }).then(function() {
                window.location = '/';        
            });
        } else {
            window.location = '/';
        }
    }
});

$(document).ready(login);