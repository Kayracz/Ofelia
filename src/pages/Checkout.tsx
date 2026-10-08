import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";

function Checkout() {
  const navigate = useNavigate();

  const {
    items,
    totalPrice,
  } = useCart();

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

    localStorage.setItem(
      "ofelia-order",
      JSON.stringify(order)
    );

    navigate("/confirmacion");
  };

  if (items.length === 0) {
    return (
      <section>
        <h1>CHECKOUT</h1>

        <p>
          Tu carrito está vacío.
        </p>

        <Link to="/productos">
          VOLVER A PRODUCTOS
        </Link>
      </section>
    );
  }

  return (
    <section>
      <div>
        <h1>CHECKOUT</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <h2>DATOS DEL CLIENTE</h2>

            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <h2>DIRECCIÓN</h2>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">
                Seleccionar departamento
              </option>

              <option value="Santa Cruz">
                Santa Cruz
              </option>

              <option value="La Paz">
                La Paz
              </option>

              <option value="Cochabamba">
                Cochabamba
              </option>

              <option value="Oruro">
                Oruro
              </option>

              <option value="Potosí">
                Potosí
              </option>

              <option value="Chuquisaca">
                Chuquisaca
              </option>

              <option value="Tarija">
                Tarija
              </option>

              <option value="Beni">
                Beni
              </option>

              <option value="Pando">
                Pando
              </option>
            </select>

            <input
              type="text"
              name="city"
              placeholder="Ciudad"
              value={formData.city}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Dirección"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="reference"
              placeholder="Referencia"
              value={formData.reference}
              onChange={handleChange}
            />
          </div>

          <div>
            <h2>MÉTODO DE ENTREGA</h2>

            <label>
              <input
                type="radio"
                name="delivery"
                value="envio"
                checked={formData.delivery === "envio"}
                onChange={handleChange}
              />

              Envío
            </label>

            <label>
              <input
                type="radio"
                name="delivery"
                value="retiro"
                checked={formData.delivery === "retiro"}
                onChange={handleChange}
              />

              Retiro
            </label>
          </div>

          <div>
            <h2>RESUMEN</h2>

            <p>
              Productos: {items.length}
            </p>

            <p>
              Total: {totalPrice} USD
            </p>

            <button type="submit">
              CONFIRMAR PEDIDO
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Checkout;