/**
 * Vite glob import — loads all markdown files at build time from the
 * sibling Google-Preparation folder. No API needed, fully offline.
 */

// `?raw` tells Vite to import the file content as a string.
// From platform/ui/, the prep folder is two levels up.
const allNotes = import.meta.glob<boolean, string, string>(
  "../../**/*.md",
  { query: "?raw", import: "default", eager: true }
);

/**
 * Get the content of a note by its path relative to Google-Preparation/.
 * Example: getNote("dsa-patterns/01-sliding-window/README.md")
 */
export function getNote(relPath: string): string | null {
  // Try with and without leading slash
  const variants = [
    `../../${relPath}`,
    `../../${relPath.replace(/^\.\//, "")}`,
  ];

  for (const key of variants) {
    if (allNotes[key]) return allNotes[key];
  }

  // Try matching by filename
  const fileName = relPath.split("/").pop();
  for (const key of Object.keys(allNotes)) {
    if (key.endsWith(relPath) || key.endsWith(`/${relPath}`) || key.endsWith(fileName ?? "")) {
      return allNotes[key];
    }
  }

  return null;
}

/**
 * List all loaded notes (key → first 80 chars preview).
 * Useful for debugging.
 */
export function listNotes(): Array<{ path: string; preview: string }> {
  return Object.entries(allNotes).map(([path, content]) => ({
    path: path.replace("../../Google-Preparation/", ""),
    preview: content.slice(0, 80).replace(/\n/g, " "),
  }));
}