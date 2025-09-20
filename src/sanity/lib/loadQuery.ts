import { sanityClient } from "sanity:client";
import type { QueryParams } from "sanity";

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
