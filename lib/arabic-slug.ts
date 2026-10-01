/** Public article path segment: the title, with spaces as hyphens. */
export function titleToPublicSlug(title: string) {
  return title
    .trim()
    .replace(/[?؟:：!！,،.。…«»"()]/g, "")
    .replace(/[/\\#%&=+]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
