<script lang="ts">
    import Login from "./lib/Login.svelte";
    import { combatLogId, darkMode, tableToLoadId } from "./lib/stores";
    import { currentUser } from "./lib/pocketbase";
    import Home from "./lib/Home.svelte";
    import Table from "./lib/Table.svelte";
    import Combat from "./lib/Combat.svelte";

</script>

<main class="min-h-screen m-0 grid grid-flow-col bg-background-light dark:bg-background-dark">
    {#key $darkMode}
        {#if $currentUser}
            {#key $tableToLoadId}
                {#if $tableToLoadId == ''}
                    <Home />
                    {:else}
                    {#key $combatLogId}
                        {#if $combatLogId == ''}
                            <Table />
                            {:else}
                            <Combat />
                        {/if}
                    {/key}
                {/if}
            {/key}
            {:else}
            <Login />
        {/if}
    {/key}
</main>