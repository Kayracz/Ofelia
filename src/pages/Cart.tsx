import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function Cart() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalPrice,
  } = useCart();

  if (items.length === 0) {
    return (
      <section>
        <h1>CARRITO</h1>

        <p>Tu carrito está vacío.</p>

        <Link to="/productos">
          VER PRODUCTOS
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div>
        <h1>CARRITO</h1>

        {items.map((item) => (
          <article key={item.product.id}>
            <div>
              IMAGEN
            </div>

            <div>
              <h2>{item.product.name}</h2>

              <p>
                {item.product.price} USD
              </p>

              <div>
                <button
                  onClick={() =>
                    decreaseQuantity(item.product.id)
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    increaseQuantity(item.product.id)
                  }
                >
                  +
                </button>
              </div>

              <button
                onClick={() =>
                  removeFromCart(item.product.id)
                }
              >
                ELIMINAR
              </button>
            </div>
          </article>
        ))}
      </div>

      <aside>
        <h2>RESUMEN</h2>

        <div>
          <span>SUBTOTAL</span>

          <span>
            {totalPrice} USD
          </span>
        </div>

        <Link to="/checkout">
          CONTINUAR
        </Link>
      </aside>
    </section>
  );
}

export default Cart;