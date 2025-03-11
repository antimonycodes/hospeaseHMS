// src/utils/imageUtils.ts

// Dynamically import all images from the assets folder using Vite's import.meta.glob
const images = import.meta.glob("/src/assets/*.(png|jpe?g|svg)", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/**
 * Retrieves the image source URL by filename.
 * @param filename - The image filename (e.g., "logo.png").
 * @returns The image URL or an empty string if not found.
 */
export const getImageSrc = (filename: string): string => {
  const path = Object.keys(images).find((key) => key.includes(filename));
  return path ? images[path] : "";
};
