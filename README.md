
# Library Management System API
## Introduction
If you're here, you're about to explore some of the great features of the Library API! This API enables users to do various things in the online library management system. You can create, read, update, and delete books. Additionally, you can register, log in, and even ask book admins questions. There's a lot more to discover too! Let's get started

## Authentication
This API uses JSON Web Tokens `JWT` for authentication. To access protected endpoints, include the `Authorization` header in your requests with the value `Bearer <token>`, where `<token>` is the JWT obtained during the login process.

## Controllers

The API revolves around two main controllers: the user controller and the book controller.

- **User Controller:** Manages user-related operations such as signing up, logging in, updating, or deleting user accounts.
    
- **Book Controller:** Handles book-related operations, including creating, reading, updating, or deleting books, borrowing book, late charge, paid charge and managing transactions.

### User Sign Up - POST
#### Endpoint: `/api/users/signup`
This endpoint allows a new user to sign up for the library management system. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| avatar     | String   | No          | The image of the user |
| name       | String   | Yes         | The name of the user |
| email      | String   | Yes         | The email of the user |
| role       | String   | Yes         | This field specifies the role or permission level of the user, it must be `admin` or `customer` |
| password   | String   | Yes         | The password of the user |

The endpoint will hash the password using bcrypt and save the user in the database using the user model. 
If the user is created successfully, it will return a JSON response with the status code `201` and a message
``` json
{
    "status": 201,
    "message": "User created successfully"
}
```
If the user email already exists, it will return a JSON response with the status code `409` and the message `User email already exists`.
If the user is not created, it will return a JSON response with the status code `400` and the message `User was not created!`.

If there is any internal server error, it will return a JSON response with the status code `500` and an error message:
``` json
{
    "status": 500,
    "message": "Internal Server Error",
    "error": "<error message>"
}
```

### User Login - POST
#### Endpoint: `/api/users/login`
This endpoint allows an existing user to log in to the library management system. It requires the following parameters in the request body:

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| email      | String   | Yes         | The email of the user |
| password   | String   | Yes         | The password of the user |

The endpoint will find the user by email in the database using the user model.
 If the user email is not found, it will return a JSON response with the status code `404` and the message `User email not found`.

If either email or password is missing, it will return a JSON response with the status code `400` and a message
``` json
{
    "status": 400,
    "message": "<field> required field missing!"
}
```
The endpoint will compare the password with the hashed password stored in the database using bcrypt. If the password is not correct, it will return a JSON response with the status code `401` and a message:
``` json
{
    "status": 401,
    "message": "Password is not correct!"
}
```

If the password is correct, it will generate a JSON web token `(JWT)` using jsonwebtoken and sign it with a secret key stored in an environment variable. The token will have an expiration time of 7 days. It will return a JSON response with the status code `200`, a message, and a token:
``` json
{
    "status": 200,
    "message": "User logged in successfully",
    "token": "<token>"
}
```
### Get Users - GET
#### Endpoint: `/api/users`
This endpoint returns all the users in the database using the user model. It does not require any parameters in the request body or query.

The endpoint will find all the users in the database and select all their fields except for their password. If there are users found, it will return a JSON response with an array of users and their fields:
```json
[
    {
        "_id": "<user id>",
        "name": "<user name>",
        "email": "<user email>"
    },
    ...
]
```
If there are no users found, it will return a JSON response with the status code `404` and a message `Users not found`

### Get User - GET
#### Endpoint: `/api/users/user`
This endpoint returns the current user based on the JWT token in the request header. It does not require any parameters in the request body or query.

The endpoint will verify the token using jsonwebtoken and extract the user id from it. It will then find the user by ID in the database using the user model and select all their fields except for their password. If the user is found, it will return a JSON response with the user and their fields:

``` json
{
    "_id": "<user id>",
    "name": "<user name>",
    "email": "<user email>"
}
```
If the user is not found, it will return a JSON response with the status code `404` and a message `user not found`

### Update User - PUT
#### Endpoint: `/api/users/update`
This endpoint allows the currently logged-in user to update their information in the database using the user model. It requires the following parameters in the request body:

#### Request Parameters

| Parameter  | Type     | Required    | Description |
|------------| -------- | ------------|-------------|
| avater     | String   | No          | The image of the user |
| name      | String   | No         | The Name of the user |
| email      | String   | No         | The email of the user |

If the user is updated successfully, it will return a JSON response with the status code `200` and a message

#### Response

``` json
{
    "status": 200,
    "message": "User updated successfully"
}
```
If the user is not updated, it will return a JSON response with the status code `400` and the message `User was not updated!`

###  Delete User - DELETE
#### Endpoint: `/api/users/delete`
This endpoint allows the currently logged-in user to delete their account from the database using the user model. It does not require any parameters in the request body or query.

The endpoint will delete the user from the database by id using the user model. If the user is deleted successfully, it will return a JSON response with the status code `200` and a message 

#### Response

``` json
{
    "status": 200,
    "message": "User deleted successfully"
}
```

### Get Books and Search Filter - GET
#### Endpoint: `/api/books/getBooks`
This endpoint returns all the books in the database using the book model. It allows filtering by query parameters in the request URL.

#### Request Parameters:

| Parameter  | Type     | Required        | Description |
| title      | String   | Filter by title | `/books/title=Nafteyda Gacalo` |
| price      | Number   | Filter by price | `/books/price=20` |
| available  | Boolean  | Filter by availability | `/books/available=true` |

The endpoint will find all the books in the database that match the query parameters using the book model. If there are books found, it will return a JSON response with an array of books and their fields:
#### Response

```
[
    {
        "_id": "65c8f73b8c6bc4a62410133c",
        "title": "Nafteyda Gacalo",
        "image": "https://html.scribdassets.com/3bttgrg8owbd8bnk/images/1-07b911a30a.jpg",
        "price": 20,
        "available": true,
        "admin": {
            "_id": "65c66b258f006dc3b5c8eca6",
            "avatar": "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
            "name": "Ali Key",
            "email": "alikey@gmail.com"
        },
        "createdAt": "2024-02-11T16:35:07.947Z",
        "updatedAt": "2024-02-11T16:35:07.947Z",
        "__v": 0
    }
]
```

### Create Book - POST
#### Endpoint: `/api/books/createBook`
Create a new book listing. This endpoint is accessible to users with the "admin" role.
It requires the following parameters in the 
#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| title      | String   | Yes         | The title of the book |
| imageUrl   | String   | No          | The image url of the book |
| price      | Number   | Yes         | The price of the book |
| available  | Boolean  | Yes         | The availability of the book |

The endpoint will create a new book in the database using the book model with the provided parameters and the owner ID. If the book is created successfully, it will return a JSON response with the status code `200` and a message:

#### Response

``` json
{
    "status": 200,
    "message": "Book created successfully"
}
```
If the book is not created, it will return a JSON response with the status code `400` and the message `Book was not created!`

### Update Book - PUT
#### Endpoint: `/api/books/updateBook/:id`
Update an existing book listing. This endpoint is accessible to users with the "admin" role. it requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| title      | String   | No          | The title of the book |
| imageUrl   | String   | No          | The image url of the book |
| price      | Number   | No          | The price of the book |
| available  | Boolean  | No          | The availability of the book |
| id         | String   | Yes         | The id of the book |

The endpoint will update the book in the database using the book model with the provided parameters and the book ID. If the book is updated successfully, it will return a JSON response with the status code `200` and a message:

``` json
{
    "status": 200,
    "message": "Book updated successfully"
}
```
If the book is not updated, it will return a JSON response with the status code `400` and the message `Book was not updated!`

### Delete Book - DELETE
#### Endpoint: `/api/books/deleteBook/:id`
Delete an existing book listing. This endpoint is accessible to users with the "admin" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| id         | String   | Yes         | The id of the book |

The endpoint will delete the book from the database by id using the book model. If the book is deleted successfully, it will return a JSON response with the status code `200` and a message:

#### Response

``` json
{
    "status": 200,
    "message": "Book deleted successfully"
}
```
If there is any internal server error, it will return a JSON response with the status code 500 and an error message:

#### Response

``` json
{
    "status": 500,
    "message": "Internal server error"
}
```
### Get Borrowing and Search Filter - GET
#### Endpoint: `/api/books/getBorrows`
This endpoint returns all the borrowing in the database using the borrowing model. It allows filtering by query parameters in the request URL.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| startDate  | Date     | Yes        | Filter by start date |
| endDate    | Date     | Yes        | Filter by end date |

#### Response

```
{
    "status": 200,
    "message": "Borrowing found successfully",
    "data": [
        {
            "_id": "65c9086d6a867aa387697eff",
            "startDate": "2024-02-10T00:00:00.000Z",
            "endDate": "2024-04-10T00:00:00.000Z",
            "status": "borrowed",
            "customer": {
                "_id": "65c8cc46705405e86a912a0b",
                "avatar": "https://t4.ftcdn.net/jpg/03/32/59/65/360_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg",
                "name": "Ali Omar",
                "email": "alioamr@gmail.com"
            },
            "createdAt": "2024-02-11T17:48:29.790Z",
            "updatedAt": "2024-02-11T17:48:29.790Z",
            "__v": 0
        },
       
    ]
}

```


### Create Borrowing - POST
#### Endpoint: `/api/books/BorrowingCreate`
Create a new borrowing. This endpoint is accessible to users with the "customer" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| startDate  | Date     | Yes        | The start date of the borrowing |
| endDate    | Date     | Yes        | The end date of the borrowing |

The endpoint will create a new borrowing in the database using the borrowing model with the provided parameters and the customer ID. If the borrowing is created successfully, it will return a JSON response with the status code `200` and a message:

#### Response
    
    ``` json
    {
        "status": 200,
        "message": "Borrowing created successfully"
    }
    ```
If the borrowing is not created, it will return a JSON response with the status code `400` and the message `Borrowing was not created!`

### Update Borrowing - PUT
#### Endpoint: `/api/books/BorrowingUpdate`
Update an existing borrowing. This endpoint is accessible to users with the "admin" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| id         | String   | Yes         | The id of the borrowing |
| startDate  | Date     | No          | The start date of the borrowing |
| endDate    | Date     | No          | The end date of the borrowing |

The endpoint will update the borrowing in the database using the borrowing model with the provided parameters and the borrowing ID. If the borrowing is updated successfully, it will return a JSON response with the status code `200` and a message:

#### Response
    
    ``` json
    {
        "status": 200,
        "message": "Borrowing updated successfully"
    }
    ```
If the borrowing is not updated, it will return a JSON response with the status code `400` and the message `Borrowing was not updated!`

### Delete Borrowing - DELETE
#### Endpoint: `/api/books/BorrowingDelete`
Delete an existing borrowing. This endpoint is accessible to users with the "admin" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| id         | String   | Yes         | The id of the borrowing |

The endpoint will delete the borrowing from the database by id using the borrowing model. If the borrowing is deleted successfully, it will return a JSON response with the status code `200` and a message:

#### Response
    
    ``` json
    {
        "status": 200,
        "message": "Borrowing deleted successfully"
    }
    ```
If there is any internal server error, it will return a JSON response with the status code 500 and an error message:

#### Response

        ``` json
        {
            "status": 500,
            "message": "Internal server error"
        }
        ```

### Get Transactions and Search Filter - GET
#### Endpoint: `/api/books/getTransactions`
This endpoint returns all the transactions in the database using the transaction model. It allows filtering by query parameters in the request URL.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| amount     | Number   | Yes         | The amount  of the transaction |

The endpoint returns all the transactions in the database using the transaction model. It allows filtering by query parameters in the request URL. 

#### Response
    
    ```
    {
        "status": 200,
        "message": "Transaction found successfully",
        "data": [
            {
                {
                    "_id": "65c906f66a867aa387697eee",
                    "amount": 20,
                    "createdAt": "2024-02-11T17:42:14.686Z",
                    "updatedAt": "2024-02-11T17:42:14.686Z",
                    "__v": 0
                }
            }
        ]
    }
    ```
if the transaction is not found, it will return a JSON response with the status code `400` and the message `Transaction was not found!`

### Create Transaction - POST
#### Endpoint: `/api/books/createTransaction`
Create a new transaction. This endpoint is accessible to users with the "admin" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| amount     | Number   | Yes         | The amount  of the transaction |

The endpoint will create a new transaction in the database using the transaction model with the provided parameters. If the transaction is created successfully, it will return a JSON response with the status code `200` and a message:

#### Response
        
        ``` json
        {
            "status": 200,
            "message": "Transaction created successfully"
        }
        ```
If the transaction is not created, it will return a JSON response with the status code `400` and the message `Transaction was not created!`

### Update Transaction - PUT
#### Endpoint: `/api/books/updateTransaction`
Update an existing transaction. This endpoint is accessible to users with the "admin" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| amount     | Number   | No          | The amount  of the transaction |
| id         | String   | Yes         | The id of the transaction |

The endpoint will update the transaction in the database using the transaction model with the provided parameters and the transaction ID. If the transaction is updated successfully, it will return a JSON response with the status code `200` and a message:

#### Response
            
            ``` json
            {
                "status": 200,
                "message": "Transaction updated successfully"
            }
            ```
If the transaction is not updated, it will return a JSON response with the status code `400` and the message `Transaction was not updated!`

### Delete Transaction - DELETE
#### Endpoint: `/api/books/TransactionDelete`
Delete an existing transaction. This endpoint is accessible to users with the "admin" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| id         | String   | Yes         | The id of the transaction |

The endpoint will delete the transaction from the database by id using the transaction model. If the transaction is deleted successfully, it will return a JSON response with the status code `200` and a message:

#### Response
                
                ``` json
                {
                    "status": 200,
                    "message": "Transaction deleted successfully"
                }
                ```
If there is any internal server error, it will return a JSON response with the status code 500 and an error message:

#### Response
    
                        ``` json
                        {
                            "status": 500,
                            "message": "Internal server error"
                        }
                        ```

### Get Late Charges and Search Filter - GET
#### Endpoint: `/api/books/getLateCharges`
This endpoint returns all the late charges in the database using the late charge model. It allows filtering by query parameters in the request URL.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| amount     | Number   | Yes         | The amount  of the late charge |

The endpoint returns all the late charges in the database using the late charge model. It allows filtering by query parameters in the request URL.

#### Response

```
{
    "status": 200,
    "message": "Late charge found successfully",
    "data": [
        {
            "_id": "65c906f66a867aa387697eee",
            "amount": 20,
            "createdAt": "2024-02-11T17:42:14.686Z",
            "updatedAt": "2024-02-11T17:42:14.686Z",
            "__v": 0
        }
    ]
}
```
if the late charge is not found, it will return a JSON response with the status code `400` and the message `Late charge was not found!`

### Create Late Charge - POST
#### Endpoint: `/api/books/createLateCharge`
Create a new late charge. This endpoint is accessible to users with the "admin" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| amount     | Number   | Yes         | The amount  of the late charge |

The endpoint will create a new late charge in the database using the late charge model with the provided parameters. If the late charge is created successfully, it will return a JSON response with the status code `200` and a message:

#### Response
    
    ``` json
    {
        "status": 200,
        "message": "Late charge created successfully"
    }
    ```
If the late charge is not created, it will return a JSON response with the status code `400` and the message `Late charge was not created!`

### Get Paid Charges and Search Filter - GET
#### Endpoint: `/api/books/getPaidCharges`
This endpoint returns all the paid charges in the database using the paid charge model. It allows filtering by query parameters in the request URL.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| amount     | Number   | Yes         | The amount  of the paid charge |

The endpoint returns all the paid charges in the database using the paid charge model. It allows filtering by query parameters in the request URL.
#### Response

```
{
    "status": 200,
    "message": "Late charge found successfully",
    "data": [
        {
            "_id": "65c906f66a867aa387697eee",
            "amount": 30,
            "createdAt": "2024-02-11T17:42:14.686Z",
            "updatedAt": "2024-02-11T17:42:14.686Z",
            "__v": 0
        }
    ]
}
```
if the paid charge is not found, it will return a JSON response with the status code `400` and the message `Paid charge was not found!`

### Create Paid Charge - POST
#### Endpoint: `/api/books/createPaidCharge`
Create a new paid charge. This endpoint is accessible to users with the "customer" role. It requires the following parameters in the parameters in the.

#### Request Parameters:

| Parameter  | Type     | Required    | Description |
| amount     | Number   | Yes         | The amount  of the paid charge |

The endpoint will create a new paid charge in the database using the paid charge model with the provided parameters. If the paid charge is created successfully, it will return a JSON response with the status code `200` and a message:

#### Response

```
{
    "status": 200,
    "message": "Paid charge created successfully"
}
```









