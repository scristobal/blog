import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE, SITE_URL } from "../consts";

export const GET: APIRoute = async (context) => {
  const posts = await getCollection("blog");
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`,
      pubDate: post.data.publication,
    })),
  });
};
