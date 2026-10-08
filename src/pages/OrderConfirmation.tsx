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
      name: string;
      price: number;
    };
    quantity: number;
  }[];
}

function getSavedOrder(): Order | null {
  const savedOrder = localStorage.getItem("ofelia-order");

  if (!savedOrder) {
    return null;
  }

  try {
    return JSON.parse(savedOrder);
  } catch {
    return null;
  }
}

function OrderConfirmation() {
  const order = getSavedOrder();

  if (!order) {
    return (
      <section>
        <h1>NO HAY PEDIDO</h1>

        <p>
          No encontramos información del pedido.
        </p>

        <Link to="/productos">
          VOLVER A PRODUCTOS
        </Link>
      </section>
    );
  }

  const whatsappNumber = "59178000375";

  const message = `
Hola, quiero confirmar mi pedido en OFELIA.

Pedido:
${order.orderNumber}

Cliente:
${order.name} ${order.lastName}

Teléfono:
${order.phone}

Productos:
${order.items
  .map(
    (item) =>
      `${item.product.name} x${item.quantity} - ${
        item.product.price * item.quantity
      } USD`
  )
  .join("\n")}

Total:
${order.totalPrice} USD

Entrega:
${order.delivery === "envio" ? "Envío" : "Retiro"}

Dirección:
${order.address}

Ciudad:
${order.city}

Departamento:
${order.department}

Referencia:
${order.reference || "Sin referencia"}
  `.trim();

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}` +
    `?text=${encodeURIComponent(message)}`;

  return (
    <section>
      <div>
        <p>GRACIAS POR TU COMPRA</p>

        <h1>PEDIDO CONFIRMADO</h1>

        <p>
          Tu pedido ha sido registrado correctamente.
        </p>

        <div>
          <p>NÚMERO DE PEDIDO</p>

          <strong>
            {order.orderNumber}
          </strong>
        </div>

        <div>
          <h2>RESUMEN</h2>

          {order.items.map((item) => (
            <div key={item.product.name}>
              <span>
                {item.product.name}
              </span>

              <span>
                x{item.quantity}
              </span>

              <span>
                {item.product.price * item.quantity} USD
              </span>
            </div>
          ))}

          <strong>
            TOTAL {order.totalPrice} USD
          </strong>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          CONFIRMAR POR WHATSAPP
        </a>

        <Link to="/productos">
          SEGUIR COMPRANDO
        </Link>
      </div>
    </section>
  );
}

export default OrderConfirmation;