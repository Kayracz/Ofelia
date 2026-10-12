
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
      <section className="cart-empty-page">
        <p className="eyebrow">YOUR OFELIA SELECTION</p>
        <h1>Tu carrito está esperando.</h1>
        <p>Descubre piezas especiales para hacerlas tuyas.</p>
        <Link to="/productos" className="cart-primary-link">
          DESCUBRIR LA COLECCIÓN <span>↗</span>
        </Link>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-page-heading">
        <p className="eyebrow">YOUR OFELIA SELECTION</p>
        <h1>Tu carrito</h1>
        <p>{items.reduce((total, item) => total + item.quantity, 0)} piezas seleccionadas</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-list-heading">
            <span>PRODUCTO</span>
            <span>TOTAL</span>
          </div>

          {items.map((item) => (
            <article className="cart-item" key={item.product.id}>
              <Link
                to={`/productos/${item.product.name.toLowerCase()}`}
                className="cart-item-image"
                aria-label={`Ver ${item.product.name}`}
              >
                <span>PRODUCT IMAGE</span>
              </Link>

              <div className="cart-item-details">
                <Link
                  to={`/productos/${item.product.name.toLowerCase()}`}
                  className="cart-item-name"
                >
                  {item.product.name}
                </Link>

                <p>{item.product.price} USD / pieza</p>

                <div className="cart-quantity">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.product.id)}
                    aria-label={`Disminuir cantidad de ${item.product.name}`}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.product.id)}
                    aria-label={`Aumentar cantidad de ${item.product.name}`}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(item.product.id)}
                >
                  ELIMINAR
                </button>
              </div>

              <p className="cart-item-total">
                {item.product.price * item.quantity} USD
              </p>
            </article>
          ))}

          <Link to="/productos" className="cart-continue-link">
            ← SEGUIR EXPLORANDO
          </Link>
        </div>

        <aside className="cart-summary">
          <h2>Resumen del pedido</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{totalPrice} USD</span>
          </div>

          <p className="cart-summary-note">
            El coste de envío se confirmará según el destino.
          </p>

          <div className="cart-summary-total">
            <span>TOTAL</span>
            <strong>{totalPrice} USD</strong>
          </div>

          <Link to="/checkout" className="cart-checkout-button">
            CONTINUAR CON LA COMPRA <span>↗</span>
          </Link>

          <p className="cart-payment-note">
            EL PAGO SE COORDINARÁ CONTIGO POR WHATSAPP
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Cart;
