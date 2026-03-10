<script lang="ts">
  import type { SearchResult, SearchMode } from "../types";
  import ResourceCard from "./ResourceCard.svelte";

  let {
    result,
    searchMode = "hybrid",
    showScore = true,
  }: {
    result: SearchResult;
    searchMode?: SearchMode;
    showScore?: boolean;
  } = $props();
</script>

<ResourceCard
  resource={result}
  score={result.score}
  size="normal"
  showDescription={true}
  showContent={true}
  {searchMode}
  {showScore}
/>
