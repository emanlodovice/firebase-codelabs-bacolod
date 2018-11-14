function addProduct() {

    var storageRef = firebase.storage().ref();

    (function enableImageUpload() {
        $('#image').on('change', function(e) {
            var image = this.files[0];
            previewImage(image);

            var fname = image.name;
            var extension = fname.split('.')[1].toLowerCase();
            
            var meta = {
                contentType: 'image/jpeg'
            };
            if (extension === 'png') {
                meta.contentType = 'image/png';
            }

            var  uploadName = guid() + '.' + extension;

            var uploadTask = storageRef.child('productImages/' + uploadName).put(image, meta);
            uploadTask.on('state_changed',
                function(snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                function(error) {
                    M.toast({html: error.message, classes: 'rounded'});
                },
                function() {
                    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                        $('#imageUrl').val(downloadURL);
                    });
                });
        });
    })();


    function previewImage(image) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#product-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(image);
    }

    (function enableCreateProduct() {
        var productsCollection = firebase.firestore().collection('products');
        var lock = false;

        $('#product-form').on('submit', function(e) {
            e.preventDefault();

            if (lock) {
                return;
            }
            lock = true;
            var name = $('#name').val();
            var description = $('#description').val();
            var price = $('#cost').val();
            var imageUrl = $('#imageUrl').val();

            productsCollection.add({
                name: name,
                description: description,
                price: price,
                imageUrl: imageUrl,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            }).then(function(doc) {
                M.toast({html: 'Product created with id ' + doc.id, classes: 'rounded'});
                // clear form
                $('#product-form').find('#name, #description, #cost').val('');
                lock = false;
            }).catch(function(error) {
                M.toast({html: error.message, classes: 'rounded'});
                lock = false;
            });
        });
    })();
}

$(document).ready(addProduct);

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

$(window).on('auth', function(e, user) {
    if (user) {
        var adminsCollection = firebase.firestore().collection('admins');
        adminsCollection.doc(user.uid).get().then(function(snapshot) {
            if (!snapshot.exists) {
                window.location = '/';
            }
        });
    } else {
        window.location = '/';
    }
});