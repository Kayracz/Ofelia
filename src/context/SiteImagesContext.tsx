import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

const defaultImages: SiteImages = {
  heroImage: "",
  storyImage: "",
  stylingImages: ["", "", "", ""],
};

function getInitialImages(): SiteImages {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed: unknown = JSON.parse(saved);

      if (parsed && typeof parsed === "object") {
        const data = parsed as Partial<SiteImages>;

        return {
          heroImage:
            typeof data.heroImage === "string"
              ? data.heroImage
              : "",
          storyImage:
            typeof data.storyImage === "string"
              ? data.storyImage
              : "",
          stylingImages: Array.from(
            { length: 4 },
            (_, index) =>
              typeof data.stylingImages?.[index] === "string"
                ? data.stylingImages[index]
                : ""
          ),
        };
      }
    }
  } catch (error) {
    console.error(
      "No se pudieron cargar las imágenes:",
      error
    );
  }

  return defaultImages;
}

export function SiteImagesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [siteImages, setSiteImages] =
    useState<SiteImages>(getInitialImages);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(siteImages)
      );
    } catch (error) {
      console.error(
        "No se pudieron guardar las imágenes:",
        error
      );
    }
  }, [siteImages]);

  function updateImage(
    key: "heroImage" | "storyImage",
    url: string
  ) {
    setSiteImages((current) => ({
      ...current,
      [key]: url,
    }));
  }

  function updateStylingImage(
    index: number,
    url: string
  ) {
    setSiteImages((current) => ({
      ...current,
      stylingImages: current.stylingImages.map(
        (image, i) => (i === index ? url : image)
      ),
    }));
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