import { useContext } from "react";
import { SiteImagesContext } from "./SiteImagesContextValue";

export function useSiteImages() {
  const context = useContext(SiteImagesContext);

  if (!context) {
    throw new Error(
      "useSiteImages debe utilizarse dentro de SiteImagesProvider."
    );
  }

  return context;
}