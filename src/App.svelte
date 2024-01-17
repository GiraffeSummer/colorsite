<script lang="ts">
  import { loadLocalStorage, saveLocalStorage } from "./lib/lib";
  import { onMount } from "svelte";
  import ColorPicker from "svelte-awesome-color-picker";
  import { writable } from "svelte/store";

  const colorpresets = ["#000000", "#ffffff", "#00ff00"];

  let hex: string = loadLocalStorage("color") || "#ffffff";
  const isFullScreen = writable(document.fullscreenElement != null);

  let fullscreenElement: HTMLElement;
  function changeColor() {
    fullscreenElement = document.getElementById("fullscreen") as HTMLElement;
    fullscreenElement.style.backgroundColor = hex;
    saveLocalStorage("color", hex);
  }

  onMount(() => {
    changeColor();
    fullscreenElement.addEventListener(
      "fullscreenchange",
      (e) => {
        $isFullScreen = document.fullscreenElement != null;
      },
      false,
    );
  });

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      fullscreenElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    $isFullScreen = document.fullscreenElement != null;
  }

  function handleKey(e: KeyboardEvent) {
    const keycode = e.code;
    let promise;
    if (keycode == "F11") {
      e.preventDefault();
      if (!document.fullscreenElement) {
        promise = fullscreenElement.requestFullscreen();
      }
    } else if (keycode == "Escape") {
      if (document.fullscreenElement && document.exitFullscreen) {
        promise = document.exitFullscreen();
      }
    }

    promise?.then(() => {});
  }
</script>

<svelte:body on:keydown={handleKey} />
<main style="background-color: {hex};">
  <div id="fullscreen" style="width: 100%; height: 100%;"></div>

  {#if !$isFullScreen}
    <div class="grid container">
      <div />
      <article>
        <ColorPicker
          on:input={changeColor}
          bind:hex
          isDialog={false}
          isAlpha={false}
          --picker-width={"18vw"}
        />
        <div class="grid" style="margin: 1vh 0">
          {#each colorpresets as color}
            <button
              class="secondary outline"
              style="background-color: {color};"
              on:click={() => {
                hex = color;
              }}
            />
          {/each}
        </div>
        <button
          class="secondary outline"
          style="margin-bottom: 0;"
          on:click={toggleFullScreen}
        >
          Fullscreen <small>(F11)</small>
        </button>
      </article>
      <div />
    </div>
  {/if}
</main>
