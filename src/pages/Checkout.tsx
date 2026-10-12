
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    city: "",
    address: "",
    reference: "",
    delivery: "envio",
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const orderNumber = `OF-${Math.floor(
      100000 + Math.random() * 900000
    )}`;

    const order = {
      orderNumber,
      ...formData,
      items,
      totalPrice,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("ofelia-order", JSON.stringify(order));
    clearCart();
    navigate("/confirmacion");
  };

  if (items.length === 0) {
    return (
      <section className="checkout-empty">
        <h1>No hay productos en tu carrito.</h1>
        <Link to="/productos" className="text-link">
          VOLVER A LA COLECCIÓN ↗
        </Link>
      </section>
    );
  }

  return (
    <section className="checkout-page">
      <div className="checkout-heading">
        <p className="eyebrow">OFELIA · CHECKOUT</p>
        <h1>Completa tu pedido.</h1>
        <p>Déjanos tus datos para coordinar la entrega.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section">
            <p className="checkout-section-number">01</p>
            <div className="checkout-section-content">
              <h2>Datos personales</h2>

              <div className="checkout-fields two-columns">
                <label>
                  Nombre
                  <input
                    type="text"
                    name="name"
                    autoComplete="given-name"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Apellido
                  <input
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="nombre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Teléfono / WhatsApp
                  <input
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="+591 ..."
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="checkout-section">
            <p className="checkout-section-number">02</p>
            <div className="checkout-section-content">
              <h2>Entrega</h2>

              <div className="checkout-fields">
                <label>
                  Departamento
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccionar departamento</option>
                    <option value="Santa Cruz">Santa Cruz</option>
                    <option value="La Paz">La Paz</option>
                    <option value="Cochabamba">Cochabamba</option>
                    <option value="Oruro">Oruro</option>
                    <option value="Potosí">Potosí</option>
                    <option value="Chuquisaca">Chuquisaca</option>
                    <option value="Tarija">Tarija</option>
                    <option value="Beni">Beni</option>
                    <option value="Pando">Pando</option>
                  </select>
                </label>

                <label>
                  Ciudad
                  <input
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Tu ciudad"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </label>

                <label>
                  Dirección
                  <input
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    placeholder="Calle, número, zona..."
                    value={formData.address}
                    onChange={handleChange}
                    required={formData.delivery === "envio"}
                  />
                </label>

                <label>
                  Referencia <span>(opcional)</span>
                  <input
                    type="text"
                    name="reference"
                    placeholder="Indicaciones adicionales"
                    value={formData.reference}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="delivery-options">
                <label className={formData.delivery === "envio" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="delivery"
                    value="envio"
                    checked={formData.delivery === "envio"}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Envío</strong>
                    <small>Recibe tu pedido en tu dirección.</small>
                  </span>
                </label>

                <label className={formData.delivery === "retiro" ? "selected" : ""}>
                  <input
                    type="radio"
                    name="delivery"
                    value="retiro"
                    checked={formData.delivery === "retiro"}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Retiro</strong>
                    <small>Coordinaremos los detalles contigo.</small>
                  </span>
                </label>
              </div>
            </div>
          </section>

          <button type="submit" className="checkout-submit">
            CONFIRMAR PEDIDO <span>↗</span>
          </button>

          <p className="checkout-legal-note">
            Al confirmar, registraremos tu pedido y podrás
            coordinar los siguientes pasos por WhatsApp.
          </p>
        </form>

        <aside className="checkout-summary">
          <p className="eyebrow">YOUR SELECTION</p>
          <h2>Resumen del pedido</h2>

          {items.map((item) => (
            <div className="checkout-summary-item" key={item.product.id}>
              <div className="checkout-summary-image">
                <span>{item.quantity}</span>
              </div>
              <div>
                <p>{item.product.name}</p>
                <span>Cantidad: {item.quantity}</span>
              </div>
              <strong>
                {item.product.price * item.quantity} USD
              </strong>
            </div>
          ))}

          <div className="checkout-summary-total">
            <span>Subtotal</span>
            <strong>{totalPrice} USD</strong>
          </div>

          <p className="checkout-summary-note">
            El coste de envío se confirmará según el destino.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Checkout;
