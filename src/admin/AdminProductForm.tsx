
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Product } from "../data/products";
import { useProducts } from "../context/useProducts";

type ProductFormData = Omit<Product, "id">;

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_IMAGES = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const emptyProduct: ProductFormData = {
  name: "",
  category: "panolletas",
  price: 0,
  isNew: false,
  description: "",
  imageUrl: "",
  images: [],
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

    const images =
      existingProduct.images?.length
        ? existingProduct.images
        : existingProduct.imageUrl
          ? [existingProduct.imageUrl]
          : [];

    return {
      name: existingProduct.name,
      category: existingProduct.category,
      price: existingProduct.price,
      isNew: existingProduct.isNew,
      description: existingProduct.description,
      imageUrl: images[0] ?? "",
      images,
    };
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);

  const notFound = Boolean(id && !existingProduct);
  const images = formData.images ?? [];

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    if (name === "isNew" && event.target instanceof HTMLInputElement) {
      const checked = event.target.checked;
      setFormData((current) => ({ ...current, isNew: checked }));
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
      setFormData((current) => ({ ...current, [name]: value }));
    }
  }

  async function uploadImage(file: File): Promise<string> {
    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", UPLOAD_PRESET);
    body.append("folder", "ofelia/products");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body }
    );

    const result: {
      secure_url?: string;
      error?: { message?: string };
    } = await response.json();

    if (!response.ok || !result.secure_url) {
      throw new Error(
        result.error?.message || "No se pudo subir una imagen."
      );
    }

    return result.secure_url;
  }

  async function handleImagesChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const input = event.target;
    const files = Array.from(input.files ?? []);
    input.value = "";

    if (!files.length) return;

    setUploadError("");

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setUploadError("Falta configurar Cloudinary en el archivo .env.");
      return;
    }

    if (images.length + files.length > MAX_IMAGES) {
      setUploadError(`Puedes tener un máximo de ${MAX_IMAGES} fotos por producto.`);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFile) {
      setUploadError(
        "Usa imágenes JPG, PNG o WebP de máximo 5 MB cada una."
      );
      return;
    }

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        const url = await uploadImage(file);
        uploadedUrls.push(url);
      }

      setFormData((current) => {
        const nextImages = [...(current.images ?? []), ...uploadedUrls];

        return {
          ...current,
          images: nextImages,
          imageUrl: nextImages[0] ?? "",
        };
      });
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al subir las imágenes."
      );
    } finally {
      setUploading(false);
    }
  }

  function removeImage(indexToRemove: number) {
    setFormData((current) => {
      const nextImages = (current.images ?? []).filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...current,
        images: nextImages,
        imageUrl: nextImages[0] ?? "",
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (uploading || saving) return;

    const cleanedProduct: ProductFormData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      images,
      imageUrl: images[0] ?? "",
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
          <h2>Galería del producto</h2>
          <p>Hasta {MAX_IMAGES} fotos. JPG, PNG o WebP, máximo 5 MB cada una.</p>

          {images.length > 0 && (
            <div className="admin-gallery-grid">
              {images.map((url, index) => (
                <div className="admin-gallery-item" key={url}>
                  <img src={url} alt={`${formData.name || "Producto"} ${index + 1}`} />

                  {index === 0 && (
                    <span className="admin-gallery-main-label">
                      FOTO PRINCIPAL
                    </span>
                  )}

                  <button
                    type="button"
                    className="admin-gallery-remove"
                    onClick={() => removeImage(index)}
                    disabled={uploading}
                    aria-label={`Quitar imagen ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {images.length < MAX_IMAGES && (
            <label className="admin-upload-label">
              {uploading ? "Subiendo imágenes..." : "Seleccionar fotografías"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
                disabled={uploading}
              />
            </label>
          )}

          {uploading && <p>Subiendo tus fotos a Cloudinary…</p>}

          {uploadError && (
            <p className="admin-upload-error" role="alert">
              {uploadError}
            </p>
          )}

          <p className="admin-upload-help">
            La primera foto será la imagen principal. Guarda el producto
            para conservar la galería.
          </p>
        </div>

        <div className="admin-form-actions">
          <Link to="/admin/productos" className="admin-secondary-button">
            Cancelar
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={uploading || saving}
          >
            {uploading
              ? "Subiendo imágenes..."
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
