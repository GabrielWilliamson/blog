import { domain, information } from "@/utils/information";
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";

export async function GET(context: APIRoute) {
  const blog = await getCollection("articles");
  return rss({
    title: information.title,
    description: information.description,
    site: `${domain}/`,
    items: blog
      .filter((post) => !post.data.draft)
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: `${domain}/articles/${post.id}/`,
      })),

    customData: `<language>es</language>`,
  });
}
