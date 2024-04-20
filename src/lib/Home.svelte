<script lang="ts">
    import { currentUser, pb } from "./pocketbase";
    import { darkMode, tableToLoadId } from "./stores";
    import Modal from "./Modal.svelte";
    import { onMount, onDestroy } from "svelte";

	let showModal: Boolean = false;
    let tableCode: String;
    let tables: any[] = [];
    let unsubscribe: () => void;

    function signOut() {
        pb.authStore.clear();
    }

    function toogleDarkMode() {
        if ($darkMode) {
            $darkMode = false;
            document.documentElement.classList.remove('dark');
        }
        else {
            $darkMode = true;
            document.documentElement.classList.add('dark');
        }
    }

    async function joinTable() {
        try {
            const resultList = await pb.collection('tables').getList(1, 1, {skipTotal: true, filter: 'code="' + tableCode + '"'});
            if (resultList.items.length != 0) {
                let playerIds = resultList.items[0].data['player'];
                if ($currentUser != null) {
                    playerIds.add($currentUser.id);
                }
                const result = pb.collection('tables').update(resultList.items[0].id, {
                    'players': playerIds
			    });
            }
        }
        catch (err) {
            
        }
    }

    function selectTable(tableId: string) {
        $tableToLoadId = tableId
    }

    onMount(async () => {
        if ($currentUser != null) {
            const tableList = await pb.collection('tables').getList(undefined, undefined, {filter: 'gmId="' + $currentUser.id + '" || players~"' + $currentUser.id + '"'});
            tables = tableList.items;

            unsubscribe = await pb.collection('tables').subscribe('*', async ({ action, record }) => {
                
            });
        }
    });

    onDestroy(() => {
        unsubscribe?.();
    });

</script>

<Modal bind:showModal>
	<div slot="header" class="text-on-background-light dark:text-on-background-dark">
        <div class="text-2xl">Join table</div>
        <div class="text-base">Enter the table code</div>
    </div>
    <div slot="body">
        <input class="shadow appearance-none border rounded-3xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Table code" bind:value={tableCode}>
    </div>
    <div slot="footer" class="flex justify-center">
        <button on:click={joinTable} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline max-w-32 max-h-10">Join</button>
    </div>
</Modal>

<div>
    <div class="flex justify-between">
        <div class="mt-5 ml-5 col-start-1 row-start-1 flex justify-start">
            <div class="text-3xl text-on-background-light dark:text-on-background-dark">
                Combat Log
            </div>
            <div>
                <button on:click={() => (showModal = true)} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 mb-5 min-w-32 max-w-32 max-h-10">Join Table</button>
            </div>
        </div>
        <div class="col-start-3 row-start-1 flex justify-end">
            <button on:click={toogleDarkMode} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mr-5 mt-5 mb-5 min-w-32 max-w-32 max-h-10">Light/Dark</button>
            <button on:click={signOut} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mr-5 mt-5 mb-5 min-w-32 max-w-32 max-h-10">Sign Out</button>
        </div>
    </div>
    <div class="flex justify-evenly flex-wrap m-10">
        {#each tables as table (table.id)}
            <button on:click={() => selectTable(table.id)} class="rounded-3xl shadow-all px-8 pt-6 pb-8 mr-12 ml-12 mb-12 w-64 h-64 place-self-center grid grid-flow-row auto-rows-auto text-on-background-light dark:text-on-background-dark">
                <div class="text-lg">{table.name}</div>
                <img class="place-self-center overflow-clip object-cover w-28 h-28"
                    src={pb.files.getUrl(table, table.tableImg)}
                    alt="avatar"
                />
                <div class="text-lg">Gm: {table.gmName}</div>
            </button>
        {/each}
    </div>
</div>