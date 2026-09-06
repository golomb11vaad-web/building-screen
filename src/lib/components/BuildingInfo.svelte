<script lang="ts">
  export let buildingName: string;
  export let phones: string[];
</script>

<div class="building-info">
  {#if buildingName}
    <h2 class="building-name">{buildingName}</h2>
  {/if}
  {#if phones.length > 0}
    <ul class="building-phones">
      {#each phones as phone}
        <li class="building-phone">{phone}</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .building-info {
    padding: 0;
  }

  .building-name {
    font: 700 clamp(26px, 2.35vw, 38px)/1.15 'Heebo', sans-serif;
    color: var(--color-primary);
    margin: 0 0 clamp(6px, 1vh, 14px);
  }

  .building-phones {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .building-phone {
    font: 500 clamp(21px, 1.65vw, 27px)/1.28 'Heebo', sans-serif;
    color: var(--color-on-surface);
    padding: clamp(4px, 0.7vh, 10px) 0;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .building-phone:last-child {
    border-bottom: none;
  }
</style>
