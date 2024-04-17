<script lang="ts">
    import Login from "./lib/Login.svelte";
    import { darkMode } from "./lib/stores";
    import { currentUser } from "./lib/pocketbase";
    import Home from "./lib/Home.svelte";

    if ($darkMode == true) {
        document.documentElement.classList.add('dark')
    } 
    else {
        document.documentElement.classList.remove('dark')
    }

</script>

<body class="min-h-screen m-0 grid grid-flow-col bg-background-light dark:bg-background-dark">
    {#if $currentUser}  
        <Home />
        {:else}
        <Login />
    {/if}
</body>