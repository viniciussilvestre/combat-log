<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { currentUser, pb } from "./pocketbase";
    import { combatLogId, darkMode, tableToLoadId, gmId } from "./stores";
    import type { RecordModel } from "pocketbase";
    import Modal from "./Modal.svelte";

    let showModal: Boolean = false;
    let combatItens: RecordModel[] = [];
    let combatIds: string[] = [];
    let players: RecordModel[] = [];
    let playerIdsToAdd: string[] = [];
    let unsubscribe: () => void;
    let tableName: string;
    let userId: string;

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
        $gmId = '';
    }

    function selectCombat(combatId: string) {
        $combatLogId = combatId;
    }

    async function createCombat() {
        try {
            let individualCombatIds: string[] = [];
            for (let i = 0; i < playerIdsToAdd.length; i++) {
                const individualCombat = await pb.collection('combat').create({
                    'user': playerIdsToAdd[i],
                    'action': true,
                    'bonusAction': true,
                    'movement': true,
                    'character': 'name' + i
                });
                individualCombatIds.push(individualCombat.id);
            }
            const combatLog = await pb.collection('combatLog').create({
                'combats': individualCombatIds,
                'date': new Date()
            });
            combatIds.push(combatLog.id);
            await pb.collection('tables').update($tableToLoadId, {
                'combat': combatIds
            });
            
        }
        catch (err) {
            console.log(err);
        }
    }

    function addPlayer(playerId: string) {
        if (playerIdsToAdd.includes(playerId)) {
            const index = playerIdsToAdd.indexOf(playerId);
            playerIdsToAdd.splice(index, 1);
        }
        else {
            playerIdsToAdd.push(playerId);
        }
        console.log(playerIdsToAdd);
    }

    onMount(async () => {
        const result = await pb.collection('tables').getOne($tableToLoadId, {expand: 'players'});
        if ($currentUser != null) {
            userId = $currentUser.id;
            $gmId = result.gmId;
            tableName = result.name;
            combatIds = result.combat;
            if (result.expand != null) {
                players = result.expand.players
            }
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
                const resultList = await pb.collection('combatLog').getList(1, 50, {filter: combatIdFilter, sort: 'created'});
                combatItens = resultList.items;
            }

            unsubscribe = await pb.collection('combatLog').subscribe('*', async ({ action, record }) => {
                if (action == 'update') {
                    let objIndex: number = combatItens.findIndex(item => item.id == record.id);
                    if (objIndex != -1) {
                        const user = await pb.collection('users').getOne(record.user);
                        combatItens[objIndex] = record;
                    }
                }
                if (action == 'create') {
                    combatItens = [...combatItens, record];
                }
                if (action == 'delete') {
                    combatItens = combatItens.filter((combat) => combat.id != record.id);
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
        {#each players as player (player.id)}
            <div class="flex items-center me-4">
                <input on:change={() => addPlayer(player.id)} type="checkbox" class="w-4 h-4 text-primary-container-light bg-neutral-50 border-neutral-30 rounded focus:ring-primary-container-light dark:focus:ring-primary-container-dark dark:ring-offset-gray-800 focus:ring-1 dark:bg-gray-700 dark:border-gray-600">
                <div class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{player.username}</div>
            </div>
        {/each}
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
            {#if userId == $gmId}
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