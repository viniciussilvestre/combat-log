<script lang='ts'>
    import { onDestroy, onMount } from "svelte";
    import { currentUser, pb } from "./pocketbase";
    import { darkMode, combatLogId, gmId } from "./stores";
    import type { RecordModel } from "pocketbase";
    import Modal from "./Modal.svelte";

    let showModal: Boolean = false;
    let combatItens: RecordModel[] = [];
    let unsubscribe: () => void;
    let combatDate: string;
    let createAction: boolean = true;
    let createBonusAction: boolean= true;
    let createMovement: boolean = true;
    let combatentName: string = '';
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
        $combatLogId = '';
    }

    async function updateCombat(combatId: string, value: boolean, label: string, name: string) {
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
        else if (label == 'character') {
            await pb.collection('combat').update(combatId, {
                'character': name
            });
        }
    }

    async function createCombatent() {
        const individualCombat = await pb.collection('combat').create({
            'user': userId,
            'action': createAction,
            'bonusAction': createBonusAction,
            'movement': createMovement,
            'character': combatentName
        });
        const combatLog = await pb.collection('combatLog').getOne($combatLogId);
        let combatents = combatLog.combats;
        combatents.push(individualCombat.id);
        await pb.collection('combatLog').update($combatLogId, {
            'combats': combatents
        });
    }

    async function deleteCombatent(combatentId: string) {
        await pb.collection('combat').delete(combatentId);
    }

    async function resetTurns() {
        for (let i = 0; i < combatItens.length; i++) {
            await pb.collection('combat').update(combatItens[i].id, {
                'action': true,
                'bonusAction': true,
                'movement': true
            });
        }
    }

    onMount(async () => {
        const result = await pb.collection('combatLog').getOne($combatLogId, {expand: 'combats'});
        if ($currentUser != null) {
            userId = $currentUser.id;
            combatDate = result.date.split(' ')[0].replaceAll('-', ' ');
            if (result.expand != null) {
                combatItens = result.expand.combats;
            }

            unsubscribe = await pb.collection('combat').subscribe('*', async ({ action, record }) => {
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
                    combatItens = combatItens.filter((combatent) => combatent.id != record.id);
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
        <div class="text-2xl">Create new combatent</div>
    </div>
    <div slot="body">
        <input class="shadow appearance-none border rounded-3xl w-full py-2 px-3 mb-5 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Character name" bind:value={combatentName}>
        <div class="flex">
            <div class="grow">
                <div class="mb-2 text-on-background-light dark:text-on-background-dark">
                    Action:
                </div>
                <div class="mb-2 text-on-background-light dark:text-on-background-dark">
                    Bonus action:
                </div>
                <div class="mb-2 text-on-background-light dark:text-on-background-dark">
                    Movement:
                </div>
            </div>
            <div class="flex flex-col">
                <label class="inline-flex items-center cursor-pointer select-none mb-2">
                    <input type="checkbox" bind:checked={createAction} class="sr-only peer">
                    <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                </label>
                <label class="inline-flex items-center cursor-pointer select-none mb-2">
                    <input type="checkbox" bind:checked={createBonusAction} class="sr-only peer">
                    <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                </label>
                <label class="inline-flex items-center cursor-pointer select-none mb-2">
                    <input type="checkbox" bind:checked={createMovement} class="sr-only peer">
                    <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                </label>
            </div>
        </div>
    </div>
    <div slot="footer" class="flex justify-center">
        <button on:click={createCombatent} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline max-w-32 max-h-10">Create</button>
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
            <button on:click={() => (showModal = true)} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 mb-5 min-w-48 max-w-48 max-h-10">Add combatent</button>
        </div>
        <div class="text-3xl basis-0 grow text-on-background-light dark:text-on-background-dark text-center mr-5 ml-5 mt-5">
            {combatDate}
        </div>
        <div class="flex basis-0 grow justify-end mr-5 ml-5 mt-5">
            {#if userId == $gmId}
                <button on:click={resetTurns} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 min-w-32 max-w-32 max-h-10">Reset turns</button>
            {/if}
            <button on:click={toogleDarkMode} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 min-w-32 max-w-32 max-h-10">Light/Dark</button>
            <button on:click={signOut} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline ml-5 min-w-32 max-w-32 max-h-10">Sign Out</button>
        </div>
    </div>

    <div class="flex justify-evenly flex-wrap m-10">
        {#each combatItens as combat (combat.id)}
            <div class="shadow-all w-64 h-44 rounded-3xl p-4 flex flex-col mr-12 ml-12 mb-12">
                <div class="flex justify-between mb-4">
                    {#if userId == $gmId || userId == combat.user}
                        <input bind:value={combat.character} on:blur={() => updateCombat(combat.id, false, 'character', combat.character)} class="text-xl font-semibold box-border w-full mr-5 px-3 shadow appearance-none border rounded-3xl text-on-background-light" />
                        <button class="outline-none text-xl text-on-background-light dark:text-on-background-dark" on:click={() => deleteCombatent(combat.id)}>x</button>
                        {:else}
                            <div class="text-xl font-semibold text-on-background-light dark:text-on-background-dark">
                                {combat.character}
                            </div>
                    {/if}
                </div>
                <div class="flex">
                    <div class="grow">
                        <div class="mb-2 text-on-background-light dark:text-on-background-dark">
                            Action:
                        </div>
                        <div class="mb-2 text-on-background-light dark:text-on-background-dark">
                            Bonus action:
                        </div>
                        <div class="mb-2 text-on-background-light dark:text-on-background-dark">
                            Movement:
                        </div>
                    </div>
                    <div class="flex flex-col">
                        {#if userId == $gmId || userId == combat.user}
                            <label class="inline-flex items-center cursor-pointer select-none mb-2">
                                <input type="checkbox" bind:checked={combat.action} on:change={() => updateCombat(combat.id, combat.action, 'action', '')} class="sr-only peer">
                                <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                            </label>
                            <label class="inline-flex items-center cursor-pointer select-none mb-2">
                                <input type="checkbox" bind:checked={combat.bonusAction} on:change={() => updateCombat(combat.id, combat.bonusAction, 'bonusAction', '')} class="sr-only peer">
                                <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                            </label>
                            <label class="inline-flex items-center cursor-pointer select-none mb-2">
                                <input type="checkbox" bind:checked={combat.movement} on:change={() => updateCombat(combat.id, combat.movement, 'movement', '')} class="sr-only peer">
                                <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                            </label>
                            {:else}
                                <label class="inline-flex items-center cursor-pointer select-none mb-2">
                                    <input disabled type="checkbox" bind:checked={combat.action} on:change={() => updateCombat(combat.id, combat.action, 'action', '')} class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                                </label>
                                <label class="inline-flex items-center cursor-pointer select-none mb-2">
                                    <input disabled type="checkbox" bind:checked={combat.bonusAction} on:change={() => updateCombat(combat.id, combat.bonusAction, 'bonusAction', '')} class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                                </label>
                                <label class="inline-flex items-center cursor-pointer select-none mb-2">
                                    <input disabled type="checkbox" bind:checked={combat.movement} on:change={() => updateCombat(combat.id, combat.movement, 'movement', '')} class="sr-only peer">
                                    <div class="relative w-11 h-6 bg-neutral-60 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-primary-100 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-source"></div>
                                </label>
                        {/if}
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>