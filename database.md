# Setup Database

1. Create a firestore database in the firebase console, start in test mode
2. Add products collection
    ```json
    {
        "products": {
            "product-id": {
                "name": "Foo Bar",
                "description": "Good",
                "price": 1.5,
                "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/User_with_smile.svg/256px-User_with_smile.svg.png",
                "timestamp": 1231232
            }
        }
    }
    ```