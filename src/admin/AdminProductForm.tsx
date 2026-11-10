
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import type { Product } from "../data/products";
import { useProducts } from "../context/useProducts";

interface ProductVariant {
  label: string;
  price: number;
}

type ProductFormData = Omit<Product, "id"> & {
  variants: ProductVariant[];
};

type ProductWithVariants = Product & {
  variants?: ProductVariant[];
};

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
  variants: [],
};

function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { products, addProduct, updateProduct } = useProducts();

  const existingProduct = id
    ? (products.find(
        (product) => product.id === Number(id)
      ) as ProductWithVariants | undefined)
    : undefined;

  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (!existingProduct) return { ...emptyProduct };

    const productImages =
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
      imageUrl: productImages[0] ?? "",
      images: productImages,
      variants: existingProduct.variants ?? [],
    };
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const notFound = Boolean(id && !existingProduct);
  const images = formData.images ?? [];

function handleChange(
  event: ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) {
  const target = event.target;
  const { name, value } = target;

  if (name === "isNew" && target instanceof HTMLInputElement) {
    setFormData((current) => ({
      ...current,
      isNew: target.checked,
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

  function addVariant() {
    setFormData((current) => ({
      ...current,
      variants: [
        ...current.variants,
        { label: "", price: 0 },
      ],
    }));
  }

  function updateVariant(
    index: number,
    field: keyof ProductVariant,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      variants: current.variants.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]:
                field === "price"
                  ? value === "" ? 0 : Number(value)
                  : value,
            }
          : variant
      ),
    }));
  }

  function removeVariant(index: number) {
    setFormData((current) => ({
      ...current,
      variants: current.variants.filter(
        (_, i) => i !== index
      ),
    }));
  }

  async function uploadImage(file: File): Promise<string> {
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
      setUploadError(
        "Falta configurar Cloudinary en el archivo .env."
      );
      return;
    }

    if (images.length + files.length > MAX_IMAGES) {
      setUploadError(
        `Puedes tener un máximo de ${MAX_IMAGES} fotos por producto.`
      );
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type) ||
        file.size > MAX_FILE_SIZE
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
        uploadedUrls.push(await uploadImage(file));
      }

      setFormData((current) => {
        const nextImages = [
          ...(current.images ?? []),
          ...uploadedUrls,
        ];

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();

    if (uploading || saving) return;

    setSaveError("");

    const cleanedVariants = formData.variants.map((variant) => ({
      label: variant.label.trim(),
      price: Number(variant.price),
    }));

    const hasInvalidVariant = cleanedVariants.some(
      (variant) =>
        !variant.label ||
        !Number.isFinite(variant.price) ||
        variant.price <= 0
    );

    const duplicateLabels =
      cleanedVariants.some((variant, index) =>
        cleanedVariants.some(
          (other, otherIndex) =>
            otherIndex !== index &&
            other.label.toLowerCase() === variant.label.toLowerCase()
        )
      );

    if (hasInvalidVariant) {
      setSaveError(
        "Completa el nombre y el precio de cada tamaño."
      );
      return;
    }

    if (duplicateLabels) {
      setSaveError(
        "No puedes repetir el mismo tamaño."
      );
      return;
    }

    const cleanedProduct: ProductFormData = {
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      images,
      imageUrl: images[0] ?? "",
      variants: cleanedVariants,
    };

    if (
      !cleanedProduct.name ||
      !cleanedProduct.description ||
      !Number.isFinite(cleanedProduct.price) ||
      cleanedProduct.price <= 0
    ) {
      setSaveError(
        "Completa el nombre, la descripción y un precio válido."
      );
      return;
    }

    setSaving(true);

    try {
      if (id) {
        if (!existingProduct) {
          setSaveError(
            "No se encontró el producto que quieres editar."
          );
          return;
        }

        await updateProduct(existingProduct.id, cleanedProduct);
      } else {
        await addProduct(cleanedProduct);
      }

      navigate("/admin/productos");
 } catch (error: unknown) {
  console.error("Error completo al guardar producto:", error);

  const err = error as {
    response?: {
      status?: number;
      data?: {
        message?: string;
        error?: string;
      };
    };
    message?: string;
  };

  const message =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    "Error desconocido";

  console.error("HTTP status:", err.response?.status);
  console.error("Respuesta del servidor:", err.response?.data);

  setSaveError(
    `No se pudo guardar el producto: ${message} ${
      err.response?.status
        ? `(HTTP ${err.response.status})`
        : ""
    }`
  );
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
        {saveError && (
          <p className="admin-upload-error" role="alert">
            {saveError}
          </p>
        )}

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
            Precio base (Bs)
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
          <h2>Tamaños y precios</h2>
          <p>
            Agrega diferentes opciones para este producto.
            Cada tamaño puede tener su propio precio.
          </p>

          {formData.variants.map((variant, index) => (
            <div
              key={index}
              className="admin-variant-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr auto",
                gap: "12px",
                alignItems: "end",
                marginBottom: "14px",
              }}
            >
              <label>
                Tamaño
                <input
                  value={variant.label}
                  onChange={(event) =>
                    updateVariant(index, "label", event.target.value)
                  }
                  placeholder="Ej. 55 x 55 cm"
                />
              </label>

              <label>
                Precio (Bs)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={variant.price || ""}
                  onChange={(event) =>
                    updateVariant(index, "price", event.target.value)
                  }
                  placeholder="159"
                />
              </label>

              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={saving}
                aria-label="Eliminar tamaño"
                style={{
                  padding: "12px 16px",
                  marginBottom: "0",
                }}
              >
                Eliminar
              </button>
            </div>
          ))}

          <button
            type="button"
            className="admin-secondary-button"
            onClick={addVariant}
            disabled={saving}
          >
            + Agregar tamaño
          </button>

          {formData.variants.length === 0 && (
            <p className="admin-upload-help">
              Este producto se venderá con su precio base,
              sin opciones de tamaño.
            </p>
          )}
        </div>

        <div className="admin-form-section">
          <h2>Galería del producto</h2>

          <p>
            Hasta {MAX_IMAGES} fotos. JPG, PNG o WebP,
            máximo 5 MB cada una.
          </p>

          {images.length > 0 && (
            <div className="admin-gallery-grid">
              {images.map((url, index) => (
                <div className="admin-gallery-item" key={url}>
                  <img
                    src={url}
                    alt={`${formData.name || "Producto"} ${index + 1}`}
                  />

                  {index === 0 && (
                    <span className="admin-gallery-main-label">
                      FOTO PRINCIPAL
                    </span>
                  )}

                  <button
                    type="button"
                    className="admin-gallery-remove"
                    onClick={() => removeImage(index)}
                    disabled={uploading || saving}
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
              {uploading
                ? "Subiendo imágenes..."
                : "Seleccionar fotografías"}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImagesChange}
                disabled={uploading || saving}
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
            La primera foto será la imagen principal. Guarda
            el producto para conservar la galería.
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
