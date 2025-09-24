import { sanityClient } from "sanity:client";
import type { QueryParams } from "sanity";

/**
 * Load a query from Sanity using the GROQ query language
 * @reference https://www.sanity.io/docs/content-lake/query-cheat-sheet
 * @example
 * loadQuery({ query: "*[0]{title,slug,publishDate,description}" })
 */
export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  const { result } = await sanityClient.fetch<QueryResponse>(
    query,
    params ?? {},
    { filterResponse: false },
  );

  return { data: result };
}
