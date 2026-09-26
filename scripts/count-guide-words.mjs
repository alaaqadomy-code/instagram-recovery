import fs from "fs";

const files = [
  "../lib/articles/keywords-a.ts",
  "../lib/articles/keywords-b.ts",
  "../lib/articles/guides.ts",
  "../lib/articles/guides-more.ts",
];

function words(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .split(/\s+/)
    .filter(Boolean).length;
}

function paragraphsOf(part) {
  const faqsAt = part.indexOf("faqs:");
  const body = faqsAt === -1 ? part : part.slice(0, faqsAt);
  const chunks = [];
  const marker = /paragraphs:\s*\[/g;
  let match;
  while ((match = marker.exec(body))) {
    let index = match.index + match[0].length;
    let depth = 1;
    const start = index;
    while (index < body.length && depth > 0) {
      if (body[index] === "[") depth += 1;
      else if (body[index] === "]") depth -= 1;
      index += 1;
    }
    chunks.push(body.slice(start, index - 1));
  }
  return chunks.flatMap((chunk) => [...chunk.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((item) => item[1]));
}

for (const file of files) {
  const ts = fs.readFileSync(new URL(file, import.meta.url), "utf8");
  for (const part of ts.split('slug: "').slice(1)) {
    const slug = part.slice(0, part.indexOf('"'));
    const description = (part.match(/description:\s*\n\s*"([^"]+)"/) ?? [])[1] ?? "";
    console.log(`${slug}\twords=${words(paragraphsOf(part).join(" "))}\tdesc=${[...description].length}`);
  }
}
