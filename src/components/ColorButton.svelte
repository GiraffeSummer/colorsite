<script lang="ts">
  let { color, onClick } = $props();
</script>

<button
  aria-label={color}
  class="btn w-12 col-span-1"
  style="background-color: {color};"
  onclick={onClick}
></button>
