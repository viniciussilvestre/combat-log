<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { currentUser, pb } from "./pocketbase";
    import { combatLogId, darkMode, tableToLoadId } from "./stores";
    import type { RecordModel } from "pocketbase";
    import Modal from "./Modal.svelte";

    let showModal: Boolean = false;
    let combatItens: RecordModel[] = [];
    let unsubscribe: () => void;
    let tableName: string;
    let gmId: string;
    let userId: string;
    let playerNumber: number;
    let npcNumber: number;
    let enemiesNumber: number;

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

    function goBack() {
        $tableToLoadId = '';
    }

    function selectCombat(combatId: string) {
        $combatLogId = combatId;
    }

    async function createCombat() {
        try {
            const result = await pb.collection('tables').getOne($tableToLoadId);
            
        }
        catch (err) {
            
        }
    }

    onMount(async () => {
        const result = await pb.collection('tables').getOne($tableToLoadId);
        if ($currentUser != null) {
            userId = $currentUser.id;
            gmId = result.gmId;
            tableName = result.name;
            let combatIds = result.combat;
            let combatIdFilter: string = '';
            for (let i = 0; i < combatIds.length; i++) {
                if (i != (combatIds.length - 1)) {
                    combatIdFilter = combatIdFilter + 'id="' + combatIds[i] + '" || ';
                }
                else {
                    combatIdFilter = combatIdFilter + 'id="' + combatIds[i] + '"';
                }
            }
            if (combatIdFilter != '') {
                const resultList = await pb.collection('combatLog').getList(1, 50, {filter: combatIdFilter});
                combatItens = resultList.items;
            }

            unsubscribe = await pb.collection('combat').subscribe('*', async ({ action, record }) => {
                if (action == 'update') {
                    let objIndex: number = combatItens.findIndex(item => item.id == record.id);
                    if (objIndex != -1) {
                        const user = await pb.collection('users').getOne(record.user);
                        combatItens[objIndex] = record;
                    }
                }
            });
        }
    });

    onDestroy(() => {
        unsubscribe?.();
    });

</script>

<Modal bind:showModal>
	<div slot="header" class="text-on-background-light dark:text-on-background-dark">
        <div class="text-2xl">Create new combat</div>
    </div>
    <div slot="body">
        <div class="text-base">Enter the number of player</div>
        <input class="shadow appearance-none border rounded-3xl w-full py-2 px-3 mb-2 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Number of players" bind:value={playerNumber}>
        <div class="text-base">Enter the number of npcs</div>
        <input class="shadow appearance-none border rounded-3xl w-full py-2 px-3 mb-2 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Number of npcs" bind:value={npcNumber}>
        <div class="text-base">Enter the number of enemies</div>
        <input class="shadow appearance-none border rounded-3xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Number of enemies" bind:value={enemiesNumber}>
    </div>
    <div slot="footer" class="flex justify-center">
        <button on:click={createCombat} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline max-w-32 max-h-10">Create</button>
    </div>
</Modal>

<div>
    <div class="flex flex-wrap">
        <div class="flex basis-0 grow justify-start mr-5 ml-5 mt-5">
            <div class="text-3xl text-on-background-light dark:text-on-background-dark">
                Combat Log
            </div>
            <div>
                <button on:click={goBack} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 mb-5 min-w-32 max-w-32 max-h-10">Go Back</button>
            </div>
            {#if userId == gmId}
                <div>
                    <button on:click={() => (showModal = true)} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 mb-5 min-w-36 max-w-36 max-h-10">New Combat</button>
                </div>
            {/if}
        </div>
        <div class="text-3xl basis-0 grow text-on-background-light dark:text-on-background-dark text-center mr-5 ml-5 mt-5">
            {tableName}
        </div>
        <div class="flex basis-0 grow justify-end mr-5 ml-5 mt-5">
            <button on:click={toogleDarkMode} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline min-w-32 max-w-32 max-h-10">Light/Dark</button>
            <button on:click={signOut} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 min-w-32 max-w-32 max-h-10">Sign Out</button>
        </div>
    </div>

    <div class="flex justify-evenly flex-wrap m-10">
        {#each combatItens as combat (combat.id)}
            <button on:click={() => selectCombat(combat.id)} class="rounded-3xl shadow-all px-8 pt-6 pb-8 mr-16 ml-16 mb-12 w-64 h-64 place-self-center grid grid-flow-row auto-rows-auto text-on-background-light dark:text-on-background-dark">
                <div class="text-lg">{combat.date}</div>
            </button>
        {/each}
    </div>
</div>