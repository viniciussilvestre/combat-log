<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { currentUser, pb } from "./pocketbase";
    import { darkMode, tableToLoadId } from "./stores";
    import type { RecordModel } from "pocketbase";

    let combatItens: RecordModel[] = [];
    let unsubscribe: () => void;

    function signOut() {
        pb.authStore.clear();
    }

    function toogleDarkMode() {
        if ($darkMode) {
            $darkMode = false;
        }
        else {
            $darkMode = true;
        }
    }

    function goBack() {
        $tableToLoadId = '';
    }

    async function updateCombat(combatId: string, value: boolean, label: string) {
        if (label == 'action') {
            await pb.collection('combat').update(combatId, {
                'action': value
            });
        }
        else if (label == 'bonusAction') {
            await pb.collection('combat').update(combatId, {
                'bonusAction': value
            });
        }
        else if (label == 'movement') {
            await pb.collection('combat').update(combatId, {
                'movement': value
            });
        }
    }

    onMount(async () => {
        const result = await pb.collection('tables').getOne($tableToLoadId);
        if ($currentUser != null) {
            if ($currentUser.id == result.gmId) {
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
                const resultList = await pb.collection('combat').getList(1, 1, {filter: combatIdFilter, expand: 'player'});
                combatItens = resultList.items;
            }
            else {
                const resultList = await pb.collection('combat').getList(1, 1, {filter: 'player="' + $currentUser.id + '"', expand: 'player'});
                combatItens = resultList.items;
            }

            unsubscribe = await pb.collection('combat').subscribe('*', async ({ action, record}) => {
                if (action == 'update') {
                    let objIndex: number = combatItens.findIndex(item => item.id == record.id);
                    if (objIndex != -1) {
                        const user = await pb.collection('users').getOne(record.player);
                        record.expand = { user };
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

<div>
    <div class="grid grid-cols-3 grid-rows-1 grid-flow-col">
        <div class="mt-5 ml-5 col-start-1 row-start-1 flex justify-start">
            <div class="text-3xl text-on-background-light dark:text-on-background-dark">
                Combat Log
            </div>
            <div>
                <button on:click={goBack} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 mb-5 max-w-32 max-h-10">Go Back</button>
            </div>
        </div>
        <div class="col-start-3 row-start-1 flex justify-end">
            <button on:click={toogleDarkMode} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mr-5 mt-5 mb-5 max-w-32 max-h-10">Light/Dark</button>
            <button on:click={signOut} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mr-5 mt-5 mb-5 max-w-32 max-h-10">Sign Out</button>
        </div>
    </div>

    <div class="grid grid-flow-col m-10 auto-cols-auto">
        {#each combatItens as combat (combat.id)}
            <div class="shadow-all w-64 h-44 rounded-3xl p-4 grid grid-flow-row">
                <div class="place-self-center text-xl font-semibold">
                    {combat.expand != null ? combat.expand.player.username : ''}
                </div>
                <div class="flex">
                    <div class="grow">
                        <div class="mb-2">
                            Action:
                        </div>
                        <div class="mb-2">
                            Bonus action:
                        </div>
                        <div class="mb-2">
                            Movement:
                        </div>
                    </div>
                    <div class="flex flex-col">
                        <label class="inline-flex items-center cursor-pointer select-none mb-2">
                            <input type="checkbox" bind:checked={combat.action} on:click={() => updateCombat(combat.id, combat.action, 'action')} class="sr-only peer">
                            <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                        </label>
                        <label class="inline-flex items-center cursor-pointer select-none mb-2">
                            <input type="checkbox" bind:checked={combat.bonusAction} on:click={() => updateCombat(combat.id, combat.bonusAction, 'bonusAction')} class="sr-only peer">
                            <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                        </label>
                        <label class="inline-flex items-center cursor-pointer select-none mb-2">
                            <input type="checkbox" bind:checked={combat.movement} on:click={() => updateCombat(combat.id, combat.movement, 'movement')} class="sr-only peer">
                            <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                        </label>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>