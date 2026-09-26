import Link from "next/link";
import type { ReactNode } from "react";

export function ArticleText({ text }: { text: string }) {
  const pattern = /\[([^\]]+)\]\((\/[^)\s]+)\)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;

  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(text.slice(cursor, index));
    const href = match[2];
    if (href.startsWith("/") && !href.startsWith("//")) {
      nodes.push(
        <Link key={`${index}-${href}`} href={href} className="font-semibold text-[#1d4ed8] hover:underline">
          {match[1]}
        </Link>,
      );
    } else {
      nodes.push(match[0]);
    }
    cursor = index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return <>{nodes}</>;
}
