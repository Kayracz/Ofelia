
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Product } from "../data/products";
import { useProducts } from "../context/useProducts";

type ProductFormData = Omit<Product, "id">;

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const emptyProduct: ProductFormData = {
  name: "",
  category: "panolletas",
  price: 0,
  isNew: false,
  description: "",
  imageUrl: "",
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, addProduct, updateProduct } = useProducts();

  const existingProduct = id
    ? products.find((product) => product.id === Number(id))
    : undefined;

  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (!existingProduct) return { ...emptyProduct };

    return {
      name: existingProduct.name,
      category: existingProduct.category,
      price: existingProduct.price,
      isNew: existingProduct.isNew,
      description: existingProduct.description,
      imageUrl: existingProduct.imageUrl ?? "",
    };
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

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

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setUploadError("");

    if (!file.type.startsWith("image/")) {
      setUploadError("Selecciona un archivo de imagen válido.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadError("Usa una imagen JPG, PNG o WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("La imagen no puede superar los 5 MB.");
      return;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setUploadError(
        "Falta configurar Cloudinary en el archivo .env."
      );
      return;
    }

    setUploading(true);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET);
      body.append("folder", "ofelia/products");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body,
        }
      );

      const result: {
        secure_url?: string;
        error?: { message?: string };
      } = await response.json();

      if (!response.ok || !result.secure_url) {
        throw new Error(
          result.error?.message || "No se pudo subir la imagen."
        );
      }

      setFormData((current) => ({
        ...current,
        imageUrl: result.secure_url!,
      }));
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al subir la imagen."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploading || saving) return;

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

    setSaving(true);

    try {
      if (id) {
        if (!existingProduct) return;
        updateProduct(existingProduct.id, cleanedProduct);
      } else {
        addProduct(cleanedProduct);
      }

      navigate("/admin/productos");
    } finally {
      setSaving(false);
    }
  }

  if (notFound) {
    return (
      <section className="admin-form-page">
        <h1>Producto no encontrado</h1>
        <p>Puede que el producto haya sido eliminado.</p>
        <Link to="/admin/productos" className="admin-text-action">
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
          <p>Completa la información que se mostrará en tu tienda.</p>
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

        <div className="admin-form-section">
          <h2>Fotografía del producto</h2>
          <p>Formatos JPG, PNG o WebP. Máximo 5 MB.</p>

          {formData.imageUrl && (
            <div className="admin-image-preview">
              <img
                src={formData.imageUrl}
                alt={`Vista previa de ${formData.name || "tu producto"}`}
              />

              <button
                type="button"
                className="admin-secondary-button"
                onClick={() =>
                  setFormData((current) => ({
                    ...current,
                    imageUrl: "",
                  }))
                }
                disabled={uploading}
              >
                Quitar imagen
              </button>
            </div>
          )}

          <label className="admin-upload-label">
            {uploading ? "Subiendo imagen..." : "Seleccionar fotografía"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>

          {uploading && <p>Estamos subiendo tu fotografía a Cloudinary…</p>}

          {uploadError && (
            <p className="admin-upload-error" role="alert">
              {uploadError}
            </p>
          )}

          <p className="admin-upload-help">
            La imagen se sube al seleccionarla. Guarda el producto para
            conservar su URL en el catálogo.
          </p>
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
            disabled={uploading || saving}
          >
            {uploading
              ? "Subiendo imagen..."
              : saving
                ? "Guardando..."
                : id
                  ? "Guardar cambios"
                  : "Crear producto"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AdminProductForm;
