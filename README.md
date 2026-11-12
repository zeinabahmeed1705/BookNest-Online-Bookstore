# BookNest -- Online Bookstore

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
  \#             Use case       What the user   What they see     What is stored
                                does                              
  -------------- -------------- --------------- ----------------- ----------------
  1              Registration   Registers with  Registration and  A User document
                 and login      name, email,    login forms;      is created with
                                and password;   after successful  the customer's
                                logs in with    authentication,   name, email,
                                email and       the customer sees role, and
                                password.       the bookstore     bcrypt-hashed
                                                home page with    password. Login
                                                their name in the verifies the
                                                header.           stored password
                                                                  hash and returns
                                                                  a JWT.

  2              Book           An              An administration Book documents
                 Management     administrator   page showing the  are created,
                                adds a book,    book collection,  read, updated,
                                edits its       with forms and    and deleted.
                                information or  controls to add,  Each book stores
                                stock, and      edit, and delete  its title,
                                deletes a book. books.            author,
                                                                  description,
                                                                  category, price,
                                                                  stock, and
                                                                  optional image
                                                                  reference.

  3              Shopping Cart  A customer adds A shopping cart   A Cart document
                 Management     books to their  page showing      associated with
                                cart, changes   selected books,   the customer is
                                quantities, and quantities,       created or
                                removes books   individual        updated. Its
                                they no longer  prices, and the   items store
                                want.           calculated total. references to
                                                                  Book documents
                                                                  and their
                                                                  quantities;
                                                                  removed items
                                                                  are deleted from
                                                                  the cart.

  4              Order          A customer      Customers see an  An Order
                 Management     places an order order             document is
                                using their     confirmation and  created with the
                                cart. An        their order       customer
                                administrator   history.          reference,
                                views orders    Administrators    ordered book
                                and updates     see an order      references,
                                their statuses  management page   quantities,
                                as they are     with order        prices at the
                                processed.      details and       time of
                                                status controls.  purchase, total
                                                                  price, and
                                                                  status. The
                                                                  status is
                                                                  updated by the
                                                                  administrator.

  5              Book Reviews   A customer      A review section  Review documents
                 and Ratings    submits a       on the book       are created,
                                rating and      details page      read, updated,
                                written review  showing existing  and deleted.
                                for a book,     reviews and a     Each review
                                then edits or   form to submit or stores
                                deletes their   edit the          references to
                                own review.     customer's        its customer and
                                                review.           book, a rating,
                                                                  and a comment.

  6              Wishlist       A customer adds A personal        A Wishlist
                 Management     books to their  wishlist page     document
                                personal        displaying saved  associated with
                                wishlist and    books and an      the customer is
                                removes books   option to remove  created or
                                they are no     each book.        updated. It
                                longer                            stores
                                interested in.                    references to
                                                                  saved Book
                                                                  documents;
                                                                  removing a book
                                                                  deletes its
                                                                  reference from
                                                                  the wishlist.
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
