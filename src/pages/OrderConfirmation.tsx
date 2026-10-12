
import { Link } from "react-router-dom";

interface Order {
  orderNumber: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  reference: string;
  delivery: string;
  totalPrice: number;
  createdAt: string;
  items: {
    product: {
      id?: number;
      name: string;
      price: number;
    };
    quantity: number;
  }[];
}

function getSavedOrder(): Order | null {
  try {
    const savedOrder = localStorage.getItem("ofelia-order");

    if (!savedOrder) return null;

    return JSON.parse(savedOrder) as Order;
  } catch {
    return null;
  }
}

function OrderConfirmation() {
  const order = getSavedOrder();

  if (!order) {
    return (
      <section className="confirmation-empty">
        <p className="eyebrow">OFELIA · CUSTOMER CARE</p>
        <h1>No encontramos tu pedido.</h1>
        <p>
          Puedes volver a la colección para preparar tu compra.
        </p>
        <Link to="/productos" className="confirmation-button">
          VOLVER A LA COLECCIÓN <span>↗</span>
        </Link>
      </section>
    );
  }

  const whatsappNumber = "59178000375";

  const message = [
    "Hola, quiero coordinar mi pedido en OFELIA.",
    "",
    `Pedido: ${order.orderNumber}`,
    `Cliente: ${order.name} ${order.lastName}`,
    `Teléfono: ${order.phone}`,
    `Email: ${order.email}`,
    "",
    "PRODUCTOS",
    ...order.items.map(
      (item) =>
        `${item.product.name} x${item.quantity} — ${
          item.product.price * item.quantity
        } USD`
    ),
    "",
    `Subtotal: ${order.totalPrice} USD`,
    `Entrega: ${order.delivery === "envio" ? "Envío" : "Retiro"}`,
    `Departamento: ${order.department}`,
    `Ciudad: ${order.city}`,
    `Dirección: ${order.address || "Por coordinar"}`,
    `Referencia: ${order.reference || "Sin referencia"}`,
    "",
    "Quedo pendiente de los detalles de pago y entrega. ¡Gracias!",
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="confirmation-page">
      <div className="confirmation-top">
        <div className="confirmation-check" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 4 4L19 6" />
          </svg>
        </div>

        <p className="eyebrow">THANK YOU FOR CHOOSING OFELIA</p>
        <h1>Tu pedido está registrado.</h1>
        <p className="confirmation-intro">
          Gracias por elegirnos. El siguiente paso es coordinar
          el pago y la entrega de tu pedido.
        </p>
      </div>

      <div className="confirmation-layout">
        <section className="confirmation-details">
          <div className="confirmation-order-number">
            <span>NÚMERO DE PEDIDO</span>
            <strong>{order.orderNumber}</strong>
          </div>

          <div className="confirmation-status">
            <span className="status-dot" />
            <div>
              <strong>Pendiente de coordinación</strong>
              <p>
                Tu pedido está registrado. El pago aún no está confirmado.
              </p>
            </div>
          </div>

          <div className="confirmation-section">
            <h2>Tu selección</h2>

            {order.items.map((item, index) => (
              <div
                className="confirmation-item"
                key={`${item.product.name}-${index}`}
              >
                <div className="confirmation-item-image">
                  <span>OFELIA</span>
                </div>

                <div className="confirmation-item-info">
                  <strong>{item.product.name}</strong>
                  <span>Cantidad: {item.quantity}</span>
                </div>

                <span className="confirmation-item-price">
                  {item.product.price * item.quantity} USD
                </span>
              </div>
            ))}

            <div className="confirmation-total">
              <span>Subtotal de productos</span>
              <strong>{order.totalPrice} USD</strong>
            </div>

            <p className="confirmation-shipping-note">
              El coste de envío, si corresponde, se confirmará
              al coordinar la entrega.
            </p>
          </div>

          <div className="confirmation-section">
            <h2>Datos de entrega</h2>

            <div className="confirmation-address">
              <p>
                <span>Cliente</span>
                {order.name} {order.lastName}
              </p>
              <p>
                <span>Contacto</span>
                {order.phone}
              </p>
              <p>
                <span>Método</span>
                {order.delivery === "envio" ? "Envío" : "Retiro"}
              </p>
              <p>
                <span>Ubicación</span>
                {[order.address, order.city, order.department]
                  .filter(Boolean)
                  .join(", ") || "Por coordinar"}
              </p>
              {order.reference && (
                <p>
                  <span>Referencia</span>
                  {order.reference}
                </p>
              )}
            </div>
          </div>
        </section>

        <aside className="confirmation-next">
          <p className="eyebrow">WHAT HAPPENS NEXT</p>
          <h2>Hablemos por WhatsApp.</h2>
          <p>
            Escríbenos para coordinar el método de pago,
            el envío y cualquier detalle de tu pedido.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="confirmation-button"
          >
            CONTINUAR POR WHATSAPP <span>↗</span>
          </a>

          <p className="confirmation-small-note">
            Tu pedido no se considera pagado hasta que confirmemos
            la recepción del pago.
          </p>

          <div className="confirmation-divider" />

          <p className="eyebrow">NEED ANYTHING ELSE?</p>
          <Link to="/productos" className="confirmation-back-link">
            SEGUIR EXPLORANDO <span>↗</span>
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default OrderConfirmation;
