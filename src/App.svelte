<script lang="ts">
  import { loadLocalStorage, saveLocalStorage } from "./lib/lib";
  import { onMount } from "svelte";
  import ColorPicker from "svelte-awesome-color-picker";
  import { writable } from "svelte/store";

  let historyTimer: number;
  let hex: string = loadLocalStorage("color") || "#ffffff";
  const isFullScreen = writable(document.fullscreenElement != null);

  let fullscreenElement: HTMLElement;
  let historyHex: string[] = loadLocalStorage("history") || [
    "#000000",
    "#ffffff",
    "#00ff00",
  ];
  function changeColor(e) {
    fullscreenElement.style.backgroundColor = hex;
    document.body.style.backgroundColor = hex;
    clearTimeout(historyTimer);
    historyTimer = setTimeout(function () {
      if (!historyHex.includes(hex)) {
        if (historyHex.length > 3) historyHex.shift();
        historyHex = [...historyHex, e.detail.hex];
        saveLocalStorage("history", historyHex);
      }
    }, 200);
    saveLocalStorage("color", hex);
  }

  onMount(() => {
    changeColor({ detail: { hex } });
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
<main class="grid content-center justify-items-center gap-4">
  <div id="fullscreen" bind:this={fullscreenElement}></div>

  {#if !$isFullScreen}
  <div></div>
    <div class="card w-80 bg-base-100 shadow-xl">
      <div class="card-body">
        <ColorPicker
          on:input={changeColor}
          bind:hex
          isDialog={false}
          isAlpha={false}
        />
        <div class="grid justify-center grid-flow-col gap-3">
          {#each historyHex as color}
            <button
              class="btn w-12 col-span-1"
              style="background-color: {color};"
              on:click={() => {
                hex = color;
              }}
            />
          {/each}
        </div>
        <button class="btn" on:click={toggleFullScreen}>
          Fullscreen <small>(F11)</small>
        </button>
      </div>
      <div />
    </div>
    <div></div>
  {/if}
</main>
