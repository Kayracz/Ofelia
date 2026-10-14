import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useSiteImages } from "../context/useSiteImages";

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type ImageSlot = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "hero" | "story" | "styling";
  index?: number;
};

function AdminSiteImages() {
  const { siteImages, updateImage, updateStylingImage } =
    useSiteImages();

  const [uploadingKey, setUploadingKey] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const imageSlots: ImageSlot[] = [
    {
      id: "hero",
      title: "Portada principal",
      description: "La primera imagen que ven tus visitantes.",
      imageUrl: siteImages.heroImage,
      type: "hero",
    },
    {
      id: "story",
      title: "Nuestra historia",
      description: "La fotografía de la sección editorial.",
      imageUrl: siteImages.storyImage,
      type: "story",
    },
    ...siteImages.stylingImages.map((imageUrl, index) => ({
      id: `styling-${index}`,
      title: `Foto de estilo ${index + 1}`,
      description: `Imagen editorial ${index + 1} de 4.`,
      imageUrl,
      type: "styling" as const,
      index,
    })),
  ];

  async function handleUpload(
    event: ChangeEvent<HTMLInputElement>,
    slot: ImageSlot
  ) {
    const input = event.currentTarget;
    const file = input.files?.[0];

    input.value = "";

    if (!file) return;

    setError("");
    setSuccess("");

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setError(
        "Falta configurar Cloudinary en el archivo .env."
      );
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Utiliza una imagen JPG, PNG o WebP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("La imagen no puede superar los 5 MB.");
      return;
    }

    setUploadingKey(slot.id);

    try {
      const body = new FormData();

      body.append("file", file);
      body.append("upload_preset", UPLOAD_PRESET);
      body.append("folder", "ofelia/editorial");

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
          result.error?.message ||
            "No se pudo subir la imagen."
        );
      }

      if (slot.type === "hero") {
        updateImage("heroImage", result.secure_url);
      } else if (slot.type === "story") {
        updateImage("storyImage", result.secure_url);
      } else if (typeof slot.index === "number") {
        updateStylingImage(slot.index, result.secure_url);
      }

      setSuccess(`${slot.title}: imagen actualizada.`);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Ocurrió un error al subir la imagen."
      );
    } finally {
      setUploadingKey(null);
    }
  }

  return (
    <main className="admin-site-images">
      <header className="admin-site-images-header">
        <div>
          <p className="admin-site-images-eyebrow">
            OFELIA / CONTENIDO
          </p>

          <h1>Imágenes editoriales</h1>

          <p className="admin-site-images-intro">
            Gestiona las fotografías que dan personalidad a
            tu tienda.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          rel="noreferrer"
          className="admin-site-images-preview-link"
        >
          Ver tienda ↗
        </Link>
      </header>

      {error && (
        <div className="admin-site-images-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-site-images-message success">
          {success}
        </div>
      )}

      <section className="admin-site-images-grid">
        {imageSlots.map((slot) => {
          const isUploading = uploadingKey === slot.id;

          return (
            <article
              className="admin-site-image-card"
              key={slot.id}
            >
              <div className="admin-site-image-frame">
                {slot.imageUrl ? (
                  <img
                    src={slot.imageUrl}
                    alt={slot.title}
                  />
                ) : (
                  <div className="admin-site-image-empty">
                    <span>OFELIA</span>
                    <p>Sin imagen</p>
                  </div>
                )}

                {isUploading && (
                  <div className="admin-site-image-loading">
                    Subiendo imagen...
                  </div>
                )}
              </div>

              <div className="admin-site-image-info">
                <h2>{slot.title}</h2>
                <p>{slot.description}</p>

                <label
                  className={`admin-site-image-upload ${
                    isUploading ? "is-disabled" : ""
                  }`}
                >
                  {isUploading
                    ? "Subiendo..."
                    : slot.imageUrl
                      ? "Cambiar imagen"
                      : "Subir imagen"}

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    disabled={uploadingKey !== null}
                    onChange={(event) =>
                      handleUpload(event, slot)
                    }
                  />
                </label>
              </div>
            </article>
          );
        })}
      </section>

      <p className="admin-site-images-note">
        Formatos permitidos: JPG, PNG y WebP. Tamaño máximo:
        5 MB por imagen. Los cambios se guardan en este
        navegador y las fotografías se alojan en Cloudinary.
      </p>
    </main>
  );
}

export default AdminSiteImages;