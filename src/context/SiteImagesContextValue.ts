
import { createContext } from "react";
import type { SiteImages } from "./SiteImagesContext";

export interface SiteImagesContextValue {
  siteImages: SiteImages;
  updateImage: (
    key: "heroImage" | "storyImage",
    url: string
  ) => Promise<void>;
  updateStylingImage: (
    index: number,
    url: string
  ) => Promise<void>;
}

export const SiteImagesContext =
  createContext<SiteImagesContextValue | undefined>(undefined);
