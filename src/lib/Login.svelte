<script lang="ts">
    import { currentUser, pb } from "./pocketbase";
    import { writable } from 'svelte/store';

    let email: string;
    let password: string;
    let retypedPassword: string;
    let username: string;
    let singUpClicked = writable(false);

    async function login() {
        try {
            await pb.collection('users').authWithPassword(email, password);
        }
        catch (err) {

        }
    }

    function signUpClicked() {
        $singUpClicked = true;
    }

    async function signUp() {
        try {
            const data = {
                email,
                password,
                passwordConfirm: retypedPassword,
                username
            };
            const createdUser = await pb.collection('users').create(data);
            $singUpClicked = false;
        }
        catch (err) {

        }
    }

    function signOut() {
        pb.authStore.clear();
    }

</script>

{#if $currentUser}
    <div class="w-full max-w-xs">
        <p>Signed in as {$currentUser.username}</p>
        <button on:click={signOut} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Sign Out</button>
    </div>

{:else}
    {#if $singUpClicked}
        <div class="w-full max-w-xs">
            <form on:submit|preventDefault class="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div class="mb-4">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Email">
                        Email
                    </label>
                    <input class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" bind:value={email}>
                </div>
                <div class="mb-6">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Username">
                        Username
                    </label>
                    <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Username" bind:value={username}>
                </div>
                <div class="mb-6">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" bind:value={password}>
                </div>
                <div class="mb-6">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="retypedPassword">
                        Retype password
                    </label>
                    <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" bind:value={retypedPassword}>
                </div>
                <div class="flex items-center justify-between">
                    <button on:click={signUp} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Create User
                    </button>
                </div>
            </form>
        </div>
        {:else}
            <div class="w-full max-w-xs">
                <form on:submit|preventDefault class="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Email">
                            Email
                        </label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="email" bind:value={email}>
                    </div>
                    <div class="mb-6">
                        <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Password">
                            Password
                        </label>
                        <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" bind:value={password}>
                    </div>
                    <div class="flex items-center justify-between">
                        <button on:click={login} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Login
                        </button>
                        <button on:click={signUpClicked} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Sign Up
                        </button>
                    </div>
                </form>
            </div>
            <!-- <form on:submit|preventDefault class="shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <input
                    placeholder="Email"
                    type="email"
                    bind:value={email}
                />

                <input
                    placeholder="Password"
                    type="password"
                    bind:value={password}
                />

                <button on:click={login}>Login</button>
                <button on:click={signUpClicked}>Sign Up</button>
            </form> -->

    {/if}

{/if}