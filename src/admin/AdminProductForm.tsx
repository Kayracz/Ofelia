
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Product } from "../data/products";
import { useProducts } from "../context/useProducts";

type ProductFormData = Omit<Product, "id">;

const emptyProduct: ProductFormData = {
  name: "",
  category: "panolletas",
  price: 0,
  isNew: false,
  description: "",
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, addProduct, updateProduct } = useProducts();

  const existingProduct = id
    ? products.find((product) => product.id === Number(id))
    : undefined;

  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (!existingProduct) {
      return { ...emptyProduct };
    }

    return {
      name: existingProduct.name,
      category: existingProduct.category,
      price: existingProduct.price,
      isNew: existingProduct.isNew,
      description: existingProduct.description,
    };
  });

  const notFound = Boolean(id && !existingProduct);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    if (name === "isNew" && event.target instanceof HTMLInputElement) {
      const checked = event.target.checked;

      setFormData((current) => ({
        ...current,
        isNew: checked,
      }));

      return;
    }

    if (name === "category") {
      setFormData((current) => ({
        ...current,
        category: value as Product["category"],
      }));

      return;
    }

    if (name === "price") {
      setFormData((current) => ({
        ...current,
        price: value === "" ? 0 : Number(value),
      }));

      return;
    }

    if (name === "name" || name === "description") {
      setFormData((current) => ({
        ...current,
        [name]: value,
      }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedProduct: ProductFormData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
    };

    if (
      !cleanedProduct.name ||
      !cleanedProduct.description ||
      !Number.isFinite(cleanedProduct.price) ||
      cleanedProduct.price <= 0
    ) {
      return;
    }

    if (id) {
      if (!existingProduct) return;

      updateProduct(existingProduct.id, cleanedProduct);
    } else {
      addProduct(cleanedProduct);
    }

    navigate("/admin/productos");
  }

  if (notFound) {
    return (
      <section className="admin-form-page">
        <h1>Producto no encontrado</h1>
        <p>Puede que el producto haya sido eliminado.</p>

        <Link
          to="/admin/productos"
          className="admin-text-action"
        >
          Volver a productos
        </Link>
      </section>
    );
  }

  return (
    <section className="admin-form-page">
      <div className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">CATÁLOGO OFELIA</span>

          <h1>{id ? "Editar producto" : "Nuevo producto"}</h1>

          <p>
            Completa la información que se mostrará en tu tienda.
          </p>
        </div>
      </div>

      <form className="admin-product-form" onSubmit={handleSubmit}>
        <div className="admin-form-section">
          <h2>Información general</h2>

          <label>
            Nombre del producto
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ej. Isabella"
              required
            />
          </label>

          <label>
            Categoría
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="panolletas">Pañolletas</option>
              <option value="flecos">Flecos</option>
              <option value="twillys">Twillys</option>
            </select>
          </label>

          <label>
            Precio (Bs)
            <input
              type="number"
              name="price"
              min="0.01"
              step="0.01"
              value={formData.price || ""}
              onChange={handleChange}
              placeholder="159"
              required
            />
          </label>

          <label>
            Descripción
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el diseño, los materiales y los detalles..."
              rows={5}
              required
            />
          </label>

          <label className="admin-checkbox-label">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleChange}
            />

            <span>Destacar como New In</span>
          </label>
        </div>

        <div className="admin-form-actions">
          <Link
            to="/admin/productos"
            className="admin-secondary-button"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
          >
            {id ? "Guardar cambios" : "Crear producto"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminProductForm;
