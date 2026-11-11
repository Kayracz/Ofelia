
import { Link } from "react-router-dom";

interface ProductInfo {
  id?: number;
  name: string;
  price: number;
  imageUrl?: string;
  images?: string[];
}

interface OrderItem {
  product?: ProductInfo;
  name?: string;
  price?: number;
  imageUrl?: string;
  quantity: number;
  variantLabel?: string;
  variant?: {
    label?: string;
    price?: number;
  };
}

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
  items: OrderItem[];
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

  const whatsappNumber = "59175086484";

  // Obtener el nombre del producto.
  const getItemName = (item: OrderItem) =>
    item.product?.name || item.name || "Producto";

  // Obtener el precio de la variante seleccionada.
  const getItemPrice = (item: OrderItem) =>
    item.variant?.price ??
    item.product?.price ??
    item.price ??
    0;

  // Obtener la fotografía del producto.
  const getItemImage = (item: OrderItem) =>
    item.product?.imageUrl ||
    item.product?.images?.[0] ||
    item.imageUrl ||
    "";

  // Obtener la medida seleccionada.
  const getVariantLabel = (item: OrderItem) =>
    item.variant?.label || item.variantLabel || "";

  // Formato de moneda boliviana.
  const formatPrice = (price: number) =>
    price.toLocaleString("es-BO", {
      style: "currency",
      currency: "BOB",
      maximumFractionDigits: 2,
    });

  // Mensaje de WhatsApp con todos los detalles.
  const message = [
    "Hola, quiero coordinar el pago de mi pedido en OFELIA.",
    "",
    `Pedido: ${order.orderNumber}`,
    `Cliente: ${order.name} ${order.lastName}`,
    `Teléfono: ${order.phone}`,
    `Email: ${order.email}`,
    "",
    "PRODUCTOS",
    ...order.items.map((item) => {
      const variant = getVariantLabel(item);
      const name = getItemName(item);
      const price = getItemPrice(item) * item.quantity;

      return `${name}${variant ? ` (${variant})` : ""} x${item.quantity} — ${formatPrice(price)}`;
    }),
    "",
    `Total: ${formatPrice(order.totalPrice)}`,
    `Entrega: ${order.delivery === "envio" ? "Envío" : "Retiro"}`,
    `Departamento: ${order.department}`,
    `Ciudad: ${order.city}`,
    `Dirección: ${order.address || "Por coordinar"}`,
    `Referencia: ${order.reference || "Sin referencia"}`,
    "",
    "Quedo pendiente de los detalles para realizar el pago. ¡Gracias!",
  ].join("\n");

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <main className="confirmation-page">
      {/* ENCABEZADO */}

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

        <p className="eyebrow">
          THANK YOU FOR CHOOSING OFELIA
        </p>

        <h1>Tus detalles han sido guardados.</h1>

        <p className="confirmation-intro">
          Gracias por elegirnos. Tu pedido está registrado.
          El siguiente paso es coordinar el pago y la entrega
          para confirmar tu compra.
        </p>
      </div>

      <div className="confirmation-layout">
        <section className="confirmation-details">

          {/* NÚMERO DE PEDIDO */}

          <div className="confirmation-order-number">
            <span>NÚMERO DE PEDIDO</span>
            <strong>{order.orderNumber}</strong>
          </div>

          {/* ESTADO */}

          <div className="confirmation-status">
            <span className="status-dot" />

            <div>
              <strong>Pendiente de pago</strong>

              <p>
                Tus datos están guardados. Para confirmar tu
                compra, continúa por WhatsApp y coordina el pago.
              </p>
            </div>
          </div>

          {/* PRODUCTOS */}

          <div className="confirmation-section">
            <h2>Tu selección</h2>

            {order.items.map((item, index) => {
              const imageUrl = getItemImage(item);
              const variant = getVariantLabel(item);
              const productName = getItemName(item);
              const itemPrice = getItemPrice(item);

              return (
                <div
                  className="confirmation-item"
                  key={`${productName}-${variant}-${index}`}
                >
                  <div className="confirmation-item-image">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span>OFELIA</span>
                    )}
                  </div>

                  <div className="confirmation-item-info">
                    <strong>{productName}</strong>

                    {variant && <span>{variant}</span>}

                    <span>
                      Cantidad: {item.quantity}
                    </span>
                  </div>

                  <span className="confirmation-item-price">
                    {formatPrice(itemPrice * item.quantity)}
                  </span>
                </div>
              );
            })}

            <div className="confirmation-total">
              <span>Total de productos</span>
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>

            <p className="confirmation-shipping-note">
              El coste de envío, si corresponde, se confirmará
              al coordinar la entrega.
            </p>
          </div>

          {/* DATOS DE ENTREGA */}

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

        {/* SIGUIENTE PASO */}

        <aside className="confirmation-next">
          <p className="eyebrow">SIGUIENTE PASO</p>

          <h2>Completemos tu compra por WhatsApp.</h2>

          <p>
            Tu pedido está registrado. Escríbenos para coordinar
            el método de pago, el envío y cualquier detalle
            de tu compra.
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="confirmation-button"
          >
            CONTINUAR A WHATSAPP PARA PAGAR
            <span>↗</span>
          </a>

          <p className="confirmation-small-note">
            Tu compra se confirmará una vez recibido y
            verificado el pago.
          </p>

          <div className="confirmation-divider" />

          <p className="eyebrow">NEED ANYTHING ELSE?</p>

          <Link
            to="/productos"
            className="confirmation-back-link"
          >
            SEGUIR EXPLORANDO <span>↗</span>
          </Link>
        </aside>
      </div>
    </main>
  );
}

export default OrderConfirmation;
