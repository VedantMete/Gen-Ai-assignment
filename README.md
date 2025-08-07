# Gen-Ai-assignment

# Prompt 1
Create a Spring Boot Maven project with dependencies: **Spring Web**, **Spring Data JPA**, **Spring Security**, **JWT (jjwt)**, and **MySQL Driver**. Configure `application.properties` for **MySQL connection**. Implement two entities: `User` *(id, username, password, email, roles)* and `Product` *(id, name, description, price, quantity)* with corresponding **Spring Data JPA repositories**. Add **authentication with JWT**: provide `POST /auth/register` to register a new user and `POST /auth/login` to login and return a **JWT token**. Configure **Spring Security** so that `GET /products` and `GET /products/{id}` are **public**, while `POST /products/purchase/{id}` **requires authentication**. Implement **CRUD endpoints** for products and a **purchase endpoint** that reduces the product quantity by 1 and is **only accessible to authenticated users**

# Prompt 2
Add a feature that allows users to add products to their cart and complete a dummy purchase transaction for those products

# Prompt 3
Integrate a payment gateway into the application using Razorpay. The implementation should support secure transactions, generate unique payment IDs, handle payment success and failure callbacks, and store transaction details in the database for future reference

# Prompt 4 - For Frontend
I have developed a Spring Boot backend with a MySQL database. I will provide the HTTP methods, endpoint URLs, response examples, request bodies, and descriptions. I want you to create an Angular-based e-commerce frontend for this backend with the following features:
* A responsive navbar containing Login and Register buttons, which navigate to their respective pages.
* A homepage that displays all available products.
* Functionality to add products to the cart and checkout.
1) GET -  http://localhost:8080/api/products
response example - [
    {
        "id": 1,
        "name": "Example Product",
        "description": "This is a test product",
        "price": 99.99,
        "quantity": 6
    },
    {
        "id": 2,
        "name": "Example",
        "description": "test",
        "price": 299.99,
        "quantity": 3
    },
    {
        "id": 3,
        "name": "Product",
        "description": "product",
        "price": 9.99,
        "quantity": 9
    }
]
on this endpoint all products should be displayed without any authentication


2) POST - http://localhost:8080/api/auth/register
request body/input - {
    "username": "user9",
    "email":"assdad@gmail.com",
    "password": "test"
}

response example - User registered successfully!
This endpoint is responsible for users to register, it takes input as username, email, password


3) POST - http://localhost:8080/api/auth/login
request body/input - {
    "username": "user9",
    "password": "test"
}

response example - {
    "token": "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJ1c2VyOSIsImlhdCI6MTc1NDM2ODg0OCwiZXhwIjoxNzU0NDU1MjQ4fQ.aJCIJfa6eDg5dUeieTAhyBnKtDrDJIybw0FBP_FQNeMP4yBXkNdMQXGkE0gFyfZp",
    "type": "Bearer",
    "id": 6,
    "username": "user9",
    "email": "assdad@gmail.com"
}
This endpoint is responsible for users to login, it takes input as username and password and generates a bearer token 


4) POST - http://localhost:8080/api/cart/add/2?quantity=2
response example - {
    "id": 4,
    "items": [
        {
            "productId": 2,
            "quantity": 2,
            "price": 299.99,
            "productName": "Example"
        }
    ],
    "total": 599.98
}
This endpoint is responsible for adding a product to the cart so and its syntax is like this, where it takes productid and quantity in url itself, also bearer token(generated during login) is required to perform this request 
http://localhost:8080/api/cart/add/{productId}?{quantity}=2


5) POST - http://localhost:8080/api/cart/checkout
response example - Checkout successful
This endpoint is responsible to simulate a dummy checkout, response message should pop up after clicking on a "checkout" button 

6) 
Payment - 
Add Products to Cart
POST http://localhost:8080/api/cart/add/1?quantity=2
Authorization: Bearer YOUR_JWT_TOKEN_HERE

Initiate Payment (Checkout)
POST http://localhost:8080/api/cart/checkout
Authorization: Bearer YOUR_JWT_TOKEN_HERE
Expected Response -
{
    "orderId": "order_R2J058bcv0FXiI",
    "currency": "INR",
    "amount": "199.98",
    "key": "rzp_test_fx2oFMmBAS7UDc",
    "name": "ShopEase",
    "description": "Payment for your order",
    "prefillEmail": null,
    "prefillContact": null,
    "themeColor": "#3399cc"
}
