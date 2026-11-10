
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

  const formatPrice = (price: number) =>
    `Bs ${price.toLocaleString("es-BO")}`;

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

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
        <p>{totalQuantity} piezas seleccionadas</p>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          <div className="cart-list-heading">
            <span>PRODUCTO</span>
            <span>TOTAL</span>
          </div>

          {items.map((item) => {
            const image =
              item.product.images?.[0] ||
              item.product.imageUrl ||
              "";

            const itemPrice = item.variant
              ? item.variant.price
              : item.product.price;

            const variantLabel =
              item.variant?.label;

            const cartKey = `${item.product.id}-${variantLabel ?? "default"}`;

            return (
              <article
                className="cart-item"
                key={cartKey}
              >
                <Link
                  to={`/productos/${item.product.name.toLowerCase()}`}
                  className="cart-item-image"
                  aria-label={`Ver ${item.product.name}`}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={item.product.name}
                      className="cart-product-image"
                    />
                  ) : (
                    <span>PRODUCT IMAGE</span>
                  )}
                </Link>

                <div className="cart-item-details">
                  <Link
                    to={`/productos/${item.product.name.toLowerCase()}`}
                    className="cart-item-name"
                  >
                    {item.product.name}
                  </Link>

                  {variantLabel && (
                    <p className="cart-item-variant">
                      Tamaño: <strong>{variantLabel}</strong>
                    </p>
                  )}

                  <p className="cart-item-price">
                    {formatPrice(itemPrice)} / pieza
                  </p>

                  <div className="cart-quantity">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(
                          item.product.id,
                          variantLabel
                        )
                      }
                      aria-label={`Disminuir cantidad de ${item.product.name}`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(
                          item.product.id,
                          variantLabel
                        )
                      }
                      aria-label={`Aumentar cantidad de ${item.product.name}`}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cart-remove"
                    onClick={() =>
                      removeFromCart(
                        item.product.id,
                        variantLabel
                      )
                    }
                  >
                    ELIMINAR
                  </button>
                </div>

                <p className="cart-item-total">
                  {formatPrice(itemPrice * item.quantity)}
                </p>
              </article>
            );
          })}

          <Link
            to="/productos"
            className="cart-continue-link"
          >
            ← SEGUIR EXPLORANDO
          </Link>
        </div>

        <aside className="cart-summary">
          <h2>Resumen del pedido</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <p className="cart-summary-note">
            El coste de envío se confirmará según el destino.
          </p>

          <div className="cart-summary-total">
            <span>TOTAL</span>
            <strong>{formatPrice(totalPrice)}</strong>
          </div>

          <Link
            to="/checkout"
            className="cart-checkout-button"
          >
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
