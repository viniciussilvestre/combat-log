<script lang="ts">
    import Login from "./lib/Login.svelte";
    import { darkMode, tableToLoadId } from "./lib/stores";
    import { currentUser } from "./lib/pocketbase";
    import Home from "./lib/Home.svelte";
    import Table from "./lib/Table.svelte";

</script>

<main class="min-h-screen m-0 grid grid-flow-col bg-background-light dark:bg-background-dark">
    {#key $darkMode}
        {#if $currentUser}
            {#key $tableToLoadId}
                {#if $tableToLoadId == ''}
                    <Home />
                    {:else}
                        <Table />
                {/if}
            {/key}
            {:else}
            <Login />
        {/if}
    {/key}
</main>