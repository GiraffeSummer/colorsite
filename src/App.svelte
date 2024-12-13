<script lang="ts">
  import { onMount } from 'svelte';
  import { loadLocalStorage, saveLocalStorage } from './lib/lib';
  import ColorPicker from 'svelte-awesome-color-picker';
  import ColorButton from './components/ColorButton.svelte';

  let historyTimer: number;
  let hex: string = $state(loadLocalStorage('color') || '#ffffff');
  let isFullScreen = $state(document.fullscreenElement != null);
  let fullscreenElement: HTMLElement | undefined = $state<HTMLElement>();

  const defaultArray: string[] = ['#000000', '#ffffff', '#00ff00', '#0000ff'];

  let historyHex: { color: string }[] = $state(
    loadLocalStorage('history') ||
      defaultArray.map((c) => {
        color: c;
      }),
  );

  function changeColor(e: any) {
    if (fullscreenElement) {
      fullscreenElement.style.backgroundColor = hex;
    }
    document.body.style.backgroundColor = hex;
    clearTimeout(historyTimer);
    historyTimer = setTimeout(function () {
      if (!historyHex.every((h) => h.color == e.detail.hex)) {
        if (historyHex.length > 3) historyHex.pop();
        historyHex = [{ color: e.detail.hex }, ...historyHex];
        saveLocalStorage('history', historyHex);
      }
    }, 200);
    saveLocalStorage('color', hex);
  }

  onMount(() => {
    changeColor({ detail: { hex } });
    fullscreenElement?.addEventListener(
      'fullscreenchange',
      (e: any) => {
        isFullScreen = document.fullscreenElement != null;
      },
      false,
    );
  });

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      fullscreenElement?.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    isFullScreen = document.fullscreenElement != null;
  }

  function handleKey(e: KeyboardEvent) {
    const keycode = e.code;
    let promise;
    if (!isFullScreen && keycode == 'F11') {
      e.preventDefault();
      if (!document.fullscreenElement) {
        promise = fullscreenElement?.requestFullscreen().catch(() => {
          //make notification that fullscreen not supported
        });
      }
    } else if (['F11', 'Escape'].includes(keycode)) {
      e.preventDefault();
      if (document.fullscreenElement && document.exitFullscreen) {
        promise = document.exitFullscreen();
      }
    }

    promise?.then(() => {});
  }
</script>

<svelte:body onkeydown={handleKey} />
<main class="grid content-center justify-items-center gap-4">
  <div id="fullscreen" class="cursor-none" bind:this={fullscreenElement}></div>

  {#if !isFullScreen}
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
            <ColorButton
              color={color.color}
              onClick={() => (hex = color.color)}
            />
          {/each}
        </div>
        <div class="grid justify-center grid-flow-col gap-3">
          {#each defaultArray as color}
            <ColorButton {color} onClick={() => (hex = color)} />
          {/each}
        </div>
        <button class="btn" onclick={toggleFullScreen}>
          Fullscreen <small>(F11)</small>
        </button>
      </div>
      <div></div>
    </div>
    <div></div>
  {/if}
</main>
