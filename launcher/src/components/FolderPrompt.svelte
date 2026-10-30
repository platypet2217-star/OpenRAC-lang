<script lang="ts">
  // The first-run question, at the top of the game page: a player who has set nothing up and named
  // no games folder is asked for one, once; a folder that holds no game OpenRAC knows says so.
  import { onAndroid } from "$lib/api";
  import { app } from "$lib/app.svelte";
  import { chooseGamesFolder } from "$lib/player.svelte";
  import Icon from "./Icon.svelte";
  import { i18n } from '../lib/i18n/i18n';

  /** On a game's page its Play band holds the one main button, so the folder's is a plain one. */
  let { primary = true }: { primary?: boolean } = $props();

  const lib = $derived(app.library);
  const nothingYet = $derived(!!lib && !lib.games.some((g) => g.install?.extracted));
  const askFolder = $derived(nothingYet && !app.config?.discsDir);
  const emptyFolder = $derived(nothingYet && !!app.config?.discsDir && app.discs.length === 0);
  let looking = $state(false);
  async function choose() {
    looking = true;
    await chooseGamesFolder();
    looking = false;
  }
</script>

{#if askFolder || emptyFolder}
  <section class="panel folder">
    <Icon name="folder" size={22} />
    <div class="grow">
      {#if onAndroid}
        <h2>{i18n.t.folderPrompt?.androidTitle}</h2>
        <p class="muted">
          {i18n.t.folderPrompt?.androidDesc}
        </p>
      {:else if askFolder}
        <h2>{i18n.t.folderPrompt?.pcTitle}</h2>
        <p class="muted">
          {i18n.t.folderPrompt?.pcDesc}
        </p>
      {:else}
        <h2>{i18n.t.folderPrompt?.emptyFolderTitle}</h2>
        <p class="muted">
          {i18n.t.folderPrompt?.emptyFolderDesc}
        </p>
      {/if}
    </div>
    <button class:primary disabled={looking} onclick={() => void choose()}>
      {#if looking}<span class="spinner"></span>{/if}{onAndroid
        ? "Choose disc image"
        : askFolder
          ? i18n.t.folderPrompt?.chooseFolder
          : "Choose another"}
    </button>
  </section>
{/if}

<style>
  .folder {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 16px;
    border-color: color-mix(in srgb, var(--amber) 45%, transparent);
  }

  .folder h2 {
    margin-bottom: 2px;
  }

  .folder p {
    margin: 0;
    font-size: 0.875rem;
    overflow-wrap: anywhere;
  }

  .folder button {
    flex: none;
  }

  @media (max-width: 700px) {
    .folder {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
