export function formatTitleFromFilename(filename) {
  if (!filename) return "Untitled Artwork";
  const base = filename.replace(/\.[^/.]+$/, "");
  const clean = base.replace(/[-_]+/g, " ").trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Untitled Artwork";
}
