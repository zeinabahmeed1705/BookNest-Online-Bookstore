**Course:** Electronic Business Development (BINF 503) · Winter 2026\
**Instructor:** Dr. Nourhan Hamdi\
**Teaching Assistants:** Mr. Nour Gaser, Mr. Omar Alaa, Ms. Mariam
Khalid, Mr. Younes Zied, Mr. Mahmoud Hani

## 1. Team

| Name | Student ID | Tutorial group | GitHub username |
|---|---|---|---|
| Zeinab Ahmed | 13003261 | T6 | ZeinabAhmeed1705 |
| Farah Elhelaly | 13001774 | T6 | FarahElhelaly |
| Jana Shoura | 10000520 | T6 | JanaElshoura |
| Yassin Eltourky | 13001103 | T6 | YassinaTourky-ai |
| Ali Haytham | 13002329 | T8 | AliHaythamMoh |
| Eyad Radwan | 13001536 | T04 | Eyadd06 |

## 2. The idea

BookNest is an online bookstore web application designed to make buying
books easier and more convenient. It allows customers to browse and
search for books, view book details, add books to their shopping carts
and wishlists, place orders, and write reviews and ratings. The
application also provides administrators with tools to manage books,
update inventory, and manage customer orders. BookNest aims to provide
book lovers with an accessible and organized platform where they can
easily find and purchase their favorite books.

## 3. Features

### 3.1 The full product

-   User registration and login.
-   Customer profile management.
-   Browsing all available books.
-   Searching for books by title, author, or keyword.
-   Filtering books by category and price.
-   Viewing detailed book information, including descriptions, prices,
    authors, and availability.
-   Discovering popular and recommended books.
-   Adding books to a shopping cart.
-   Updating quantities and removing books from the shopping cart.
-   Creating and managing personal wishlists.
-   Placing orders and receiving order confirmations.
-   Selecting delivery addresses.
-   Choosing payment methods.
-   Viewing previous orders and tracking order status.
-   Cancelling eligible orders.
-   Writing, editing, and deleting book reviews.
-   Rating books and reading reviews from other customers.
-   Administrator management of books and inventory.
-   Administrator management of customer orders and order statuses.
-   Administrator management of customer accounts.
-   Viewing sales and inventory reports.

### 3.2 The use cases we will build

  --------------------------------------------------------------------------------

| # | Use case | What the user does | What they see | What is stored |
|---|---|---|---|---|
| 1 | Registration and Login | Registers with name, email, and password, then logs in. | Registration and login forms; after successful login, the customer sees the bookstore home page. | A User document containing name, email, role, and bcrypt-hashed password. Login verifies the password hash and returns a JWT. |
| 2 | Book Management | An administrator adds, edits, and deletes books. | An administration page showing the book collection, with forms and controls to add, edit, and delete books. | Book documents containing title, author, description, category, price, stock, and optional image reference. |
| 3 | Shopping Cart Management | A customer adds books to the cart, changes quantities, and removes books. | A cart page showing selected books, quantities, prices, and the calculated total. | A Cart document associated with the customer, referencing Book documents and storing quantities. Removed items are deleted from the cart. |
| 4 | Order Management | A customer places an order using their cart. An administrator views orders and updates their statuses. | Customers see order confirmation and order history. Administrators see an order management page with order details and status controls. | An Order document containing customer reference, ordered book references, quantities, purchase-time prices, total price, and status. The administrator can update the status. |
| 5 | Book Reviews and Ratings | A customer submits a rating and written review, then edits or deletes their own review. | A review section on the book details page showing existing reviews and a form to submit or edit the customer's review. | Review documents referencing the customer and book, with a rating and comment. |
| 6 | Wishlist Management | A customer adds books to their personal wishlist and removes books they are no longer interested in. | A personal wishlist page displaying saved books and an option to remove each book. | A Wishlist document associated with the customer, storing references to saved Book documents. Removing a book deletes its reference from the wishlist. |

  --------------------------------------------------------------------------------

## 4. Who owns what

  Member   Use case
  -------- ------------------------------
  zeinab   1\. Registration and login
  farah    2\. Book Management
  jana     3\. Shopping Cart Management
  yassin   4\. Order Management
  ali      5\. Book Reviews and Ratings
  eyad     6\. Wishlist Management

## 5. Data model

The BookNest application will use MongoDB Atlas as its database and
Mongoose to define and manage its data models. The application will
contain six models: User, Book, Cart, Order, Review, and Wishlist.
ObjectId references connect related documents. Passwords will be hashed
using bcrypt before they are stored.

### User

``` js
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // stored hashed, never as plain text
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer"
  }
});
```

### Book

``` js
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 0, min: 0 },
  image: { type: String }
});
```

### Cart

``` js
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  items: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    quantity: { type: Number, required: true, default: 1, min: 1 }
  }]
});
```

### Order

``` js
const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [{
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true
    },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }
  }],
  totalPrice: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  }
}, {
  timestamps: true
});
```

### Review

``` js
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true
  },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, {
  timestamps: true
});
```

### Wishlist

``` js
const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  books: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  }]
});
```

The application will support Create, Read, Update, and Delete (CRUD)
operations on at least two models:

-   **Book:** Administrators can create new books, view the book
    collection, update book information, and delete books.
-   **Review:** Customers can create reviews, view reviews, update their
    own reviews, and delete their own reviews.

The other models will support the database operations required by their
respective use cases.

## 6. Run it locally

> Leave this section as it is until Submission 2 (Thursday 10 December
> 2026, 23:59). Then fill it in: we follow these steps to run your
> project.

### Back end

``` bash
cd backend
npm install
# create backend/.env from backend/.env.example (see the table below)
npm start
```

The API runs on http://localhost:3000.

  Variable in `.env`       What it is
  ------------------------ ------------------------------------------------------
  `MONGODB_URI`            The connection string of your MongoDB Atlas database
  `JWT_SECRET`             Any long random text, used to sign login tokens
  \[Any other variable\]   \[What it is\]

### Front end

``` bash
cd frontend
npm install
npm run dev
```

The app runs on \[the address `npm run dev` prints,
e.g. http://localhost:5173\].
