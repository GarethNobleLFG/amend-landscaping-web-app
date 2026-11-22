import { useSignal, $ } from "@builder.io/qwik";
import {
  searchApprovedProfiles,
  type PaginatedApprovedJobProfilesResponse,
  type ProfileCategory,
} from "../../../../hooks/job-profile-handling";

export function useApprovedProfileSearch(debounceMs = 250, pageSize = 20) {
  const query = useSignal("");
  const results = useSignal<PaginatedApprovedJobProfilesResponse | null>(null);
  const isSearching = useSignal(false);
  const error = useSignal<string | null>(null);
  const limit = useSignal(pageSize);
  const offset = useSignal(0);

  const debounceTimerId = useSignal<number | null>(null);
  const latestRequestId = useSignal(0);

  const runQuery = $(
    async (
      rawQuery: string,
      category: ProfileCategory,
      nextLimit: number,
      nextOffset: number,
      token?: string
    ) => {
      const trimmed = rawQuery.trim();
      const requestId = ++latestRequestId.value;

      if (debounceTimerId.value !== null) {
        window.clearTimeout(debounceTimerId.value);
        debounceTimerId.value = null;
      }

      if (!trimmed) {
        results.value = null;
        error.value = null;
        isSearching.value = false;
        offset.value = 0;
        return;
      }

      isSearching.value = true;
      error.value = null;

      try {
        const data = await searchApprovedProfiles({
          q: trimmed,
          type: category,
          limit: nextLimit,
          offset: nextOffset,
          token,
        });

        if (requestId !== latestRequestId.value) return;
        results.value = data;
        limit.value = data.limit ?? nextLimit;
        offset.value = data.offset ?? nextOffset;
      } catch (err) {
        if (requestId !== latestRequestId.value) return;
        error.value = err instanceof Error ? err.message : "Failed to search profiles";
        results.value = null;
      } finally {
        if (requestId === latestRequestId.value) {
          isSearching.value = false;
        }
      }
    }
  );

  const searchNow = $(
    (rawQuery: string, category: ProfileCategory, token?: string) => {
      offset.value = 0;
      return runQuery(rawQuery, category, limit.value, 0, token);
    }
  );

  const setQuery = $(
    (nextQuery: string, category: ProfileCategory, token?: string) => {
      query.value = nextQuery;
      offset.value = 0;

      if (debounceTimerId.value !== null) {
        window.clearTimeout(debounceTimerId.value);
        debounceTimerId.value = null;
      }

      if (!nextQuery.trim()) {
        results.value = null;
        error.value = null;
        isSearching.value = false;
        return;
      }

      isSearching.value = true;
      debounceTimerId.value = window.setTimeout(() => {
        runQuery(nextQuery, category, limit.value, 0, token);
      }, debounceMs);
    }
  );

  const goToOffset = $(
    (nextOffset: number, category: ProfileCategory, token?: string) => {
      const safeOffset = Math.max(0, nextOffset);
      return runQuery(query.value, category, limit.value, safeOffset, token);
    }
  );

  const refresh = $((category: ProfileCategory, token?: string) => {
    if (query.value.trim()) {
      return runQuery(query.value, category, limit.value, offset.value, token);
    }
    return Promise.resolve();
  });

  const clear = $(() => {
    if (debounceTimerId.value !== null) {
      window.clearTimeout(debounceTimerId.value);
      debounceTimerId.value = null;
    }
    query.value = "";
    results.value = null;
    error.value = null;
    isSearching.value = false;
    offset.value = 0;
  });

  return {
    query,
    results,
    isSearching,
    error,
    limit,
    offset,
    setQuery,
    searchNow,
    goToOffset,
    refresh,
    clear,
  };
}