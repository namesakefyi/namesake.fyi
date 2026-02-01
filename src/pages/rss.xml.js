import rss from "@astrojs/rss";
import sanitizeHtml from "sanitize-html";
import { loadQuery } from "@/sanity/lib/loadQuery";

export async function GET(context) {
  const { data: posts } = await loadQuery({
    query: `*[_type == "post" && defined(slug) && publishDate <= now()]{
      title,
      slug,
      publishDate,
      description,
      "contentText": pt::text(content)
    } | order(publishDate desc)`,
  });

  return await rss({
    title: "Namesake",
    description: "News and updates from Namesake Collaborative.",
    site: context.site,
    trailingSlash: false,
    stylesheet: "/rss/pretty-feed-v3.xsl",
    items: posts.map((post) => ({
      title: post.title,
      pubDate: post.publishDate,
      description: post.description,
      link: `/blog/${post.slug.current}`,
      content: sanitizeHtml(post.contentText || post.description || ""),
    })),
  });
}
