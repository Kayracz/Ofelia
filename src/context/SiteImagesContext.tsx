
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

import {
  SiteImagesContext,
  type SiteImagesContextValue,
} from "./SiteImagesContextValue";

export interface SiteImages {
  heroImage: string;
  storyImage: string;
  stylingImages: string[];
}

const STORAGE_KEY = "ofelia-site-images";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

const defaultImages: SiteImages = {
  heroImage: "",
  storyImage: "",
  stylingImages: ["", "", "", ""],
};

function normalizeImages(data: Partial<SiteImages>): SiteImages {
  return {
    heroImage:
      typeof data.heroImage === "string" ? data.heroImage : "",
    storyImage:
      typeof data.storyImage === "string" ? data.storyImage : "",
    stylingImages: Array.from(
      { length: 4 },
      (_, index) =>
        typeof data.stylingImages?.[index] === "string"
          ? data.stylingImages[index]
          : ""
    ),
  };
}

function getCachedImages(): SiteImages {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeImages(JSON.parse(saved));
  } catch (error) {
    console.error("No se pudieron leer las imágenes locales:", error);
  }

  return defaultImages;
}

export function SiteImagesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [siteImages, setSiteImages] =
    useState<SiteImages>(getCachedImages);

  useEffect(() => {
    let cancelled = false;

    async function loadImages() {
      try {
        const response = await axios.get<SiteImages>(
          `${API_URL}/api/site-images`
        );

        if (!cancelled) {
          const images = normalizeImages(response.data);
          setSiteImages(images);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
        }
      } catch (error) {
        console.error(
          "No se pudieron cargar las imágenes del servidor:",
          error
        );
      }
    }

    void loadImages();

    return () => {
      cancelled = true;
    };
  }, []);

  async function saveImages(nextImages: SiteImages) {
    const response = await axios.put<SiteImages>(
      `${API_URL}/api/site-images`,
      nextImages,
      {
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("ofelia-admin-token") || ""
          }`,
        },
      }
    );

    const savedImages = normalizeImages(response.data);

    setSiteImages(savedImages);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(savedImages)
    );
  }

  async function updateImage(
    key: "heroImage" | "storyImage",
    url: string
  ) {
    await saveImages({
      ...siteImages,
      [key]: url,
    });
  }

  async function updateStylingImage(
    index: number,
    url: string
  ) {
    const stylingImages = [...siteImages.stylingImages];
    stylingImages[index] = url;

    await saveImages({
      ...siteImages,
      stylingImages,
    });
  }

  const contextValue: SiteImagesContextValue = {
    siteImages,
    updateImage,
    updateStylingImage,
  };

  return (
    <SiteImagesContext.Provider value={contextValue}>
      {children}
    </SiteImagesContext.Provider>
  );
}
