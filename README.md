# Gen-Ai-assignment

# Prompt 1
Create a Spring Boot Maven project with dependencies: **Spring Web**, **Spring Data JPA**, **Spring Security**, **JWT (jjwt)**, and **MySQL Driver**. Configure `application.properties` for **MySQL connection**. Implement two entities: `User` *(id, username, password, email, roles)* and `Product` *(id, name, description, price, quantity)* with corresponding **Spring Data JPA repositories**. Add **authentication with JWT**: provide `POST /auth/register` to register a new user and `POST /auth/login` to login and return a **JWT token**. Configure **Spring Security** so that `GET /products` and `GET /products/{id}` are **public**, while `POST /products/purchase/{id}` **requires authentication**. Implement **CRUD endpoints** for products and a **purchase endpoint** that reduces the product quantity by 1 and is **only accessible to authenticated users**

# Prompt 2
Add a feature that allows users to add products to their cart and complete a dummy purchase transaction for those products

# Prompt 3 - For Frontend
I have developed a Spring Boot backend with a MySQL database. I will provide the HTTP methods, endpoint URLs, response examples, request bodies, and descriptions. I want you to create an Angular-based e-commerce frontend for this backend with the following features:
* A responsive navbar containing Login and Register buttons, which navigate to their respective pages.
* A homepage that displays all available products.
* Functionality to add products to the cart and checkout.
