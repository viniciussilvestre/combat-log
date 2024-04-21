import { writable } from "svelte/store";

export let darkMode = writable(false)

export let tableToLoadId = writable('');

export let combatLogId = writable('');