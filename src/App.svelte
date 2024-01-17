<script lang="ts">
  import { loadLocalStorage, saveLocalStorage } from "./lib/lib";
  import { onMount } from "svelte";
  import ColorPicker from "svelte-awesome-color-picker";
  import { writable } from "svelte/store";

  let hex, rgb, color, hsv;
  hex = loadLocalStorage("color") || "#ffffff";
  const isFullScreen = writable(document.fullscreenElement != null);

  function changeColor() {
    window.document.body.style.backgroundColor = hex;
    saveLocalStorage("color", hex);
  }

  onMount(changeColor);

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    $isFullScreen = document.fullscreenElement != null;
  }

  function handleKey(e) {
    const keycode = e.code;
    let promise;
    if (keycode == "F11") {
      e.preventDefault();
      console.log("f11 pressed");
      if (!document.fullscreenElement) {
        promise = document.documentElement.requestFullscreen();
      }
    } else if (keycode == "Escape") {
      console.log("escape");
      if (document.fullscreenElement && document.exitFullscreen) {
        promise = document.exitFullscreen();
      }
    }
    if (promise) {
      promise
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    }
  }
  document.documentElement.addEventListener(
    "fullscreenchange",
    (e) => {
      $isFullScreen = document.fullscreenElement != null;
    },
    false,
  );
</script>

<svelte:body on:keydown={handleKey} />
<main>
  {#if !$isFullScreen}
    <div class="grid">
      <div></div>
      <article>
        <ColorPicker
          on:input={changeColor}
          bind:hex
          bind:rgb
          bind:hsv
          bind:color
          isDialog={false}
          isAlpha={false}
          --picker-width={"18vw"}
        />
        <button
          style="margin-top: 3vh; margin-bottom:0vh;"
          class="secondary outline"
          on:click={toggleFullScreen}>Fullscreen</button
        >
      </article>
      <div></div>
    </div>
  {/if}
</main>

<style>
  @media (prefers-color-scheme: dark) {
    :root {
      --cp-bg-color: #333;
      --cp-border-color: white;
      --cp-input-color: #555;
      --cp-button-hover-color: #777;
    }
  }
</style>
