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
    font: var(--text-headline-md);
    color: var(--color-primary);
    margin: 0 0 var(--space-stack-md);
  }

  .building-phones {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .building-phone {
    font: var(--text-body-md);
    color: var(--color-on-surface);
    padding: var(--space-stack-sm) 0;
    border-bottom: 1px solid var(--color-outline-variant);
  }

  .building-phone:last-child {
    border-bottom: none;
  }
</style>
