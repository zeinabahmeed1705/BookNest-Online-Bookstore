function ShoppingCart({ cartItems = [], onRemoveItem, onUpdateQuantity }) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item._id}>
            <h3>{item.title}</h3>
            <p>{item.price} EGP</p>

            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>

            {item.quantity}

            <button
              onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
            >
              +
            </button>

            <button onClick={() => onRemoveItem(item._id)}>
              Remove
            </button>
          </div>
        ))
      )}

      <h3>Total: {total} EGP</h3>
    </div>
  );
}

export default ShoppingCart;