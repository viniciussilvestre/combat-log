<script lang="ts">
    import { pb } from "./pocketbase";
    import { darkMode } from "./stores";

    let email: string;
    let password: string;
    let retypedPassword: string;
    let username: string;
    let singUpClicked = false;

    async function login() {
        try {
            await pb.collection('users').authWithPassword(email, password);
        }
        catch (err) {

        }
    }

    function signUpClicked() {
        singUpClicked = true;
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
            singUpClicked = false;
        }
        catch (err) {
            
        }
    }

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

</script>

{#if singUpClicked}
    <div class=" w-full h-full grid grid-cols-3 grid-flow-col auto-col-auto">
        <div class="grid grid-flow-col col-start-3">
            <div class="place-self-start w-full flex justify-end">
                <button on:click={toogleDarkMode} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mr-5 mt-5">Light/Dark</button>
            </div>
        </div>
        <div class="max-w-xs place-self-center col-start-2">
            <form on:submit|preventDefault class="rounded-3xl shadow-all px-8 pt-6 pb-8 mb-4">
                <div class="ml-auto mr-auto mb-5 text-3xl text-center text-on-background-light dark:text-on-background-dark">
                    Combat Log
                </div>
                <div class="mb-4">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Email">
                        Email
                    </label>
                    <input class="shadow appearance-none border rounrounded-3xlded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="Email" bind:value={email}>
                </div>
                <div class="mb-6">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Username">
                        Username
                    </label>
                    <input class="shadow appearance-none border border-red-500 rounded-3xl w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Username" bind:value={username}>
                </div>
                <div class="mb-6">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="password">
                        Password
                    </label>
                    <input class="shadow appearance-none border border-red-500 rounded-3xl w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" bind:value={password}>
                </div>
                <div class="mb-6">
                    <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="retypedPassword">
                        Retype password
                    </label>
                    <input class="shadow appearance-none border border-red-500 rounded-3xl w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" bind:value={retypedPassword}>
                </div>
                <div class="flex items-center justify-center">
                    <button on:click={signUp} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline">
                        Create User
                    </button>
                </div>
            </form>
        </div>
    </div>
    {:else}
        <div class="w-full h-full grid grid-rows-3">
            <div class="place-self-start w-full grid grid-flow-col">
                <div class="place-self-end">
                    <button on:click={toogleDarkMode} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline mr-5 mt-5">Light/Dark</button>
                </div>
            </div>
            <div class="max-w-xs place-self-center">
                <form on:submit|preventDefault class="rounded-3xl shadow-all px-8 pt-6 pb-8 mb-4">
                    <div class="ml-auto mr-auto mb-5 text-3xl text-center text-on-background-light dark:text-on-background-dark">
                        Combat Log
                    </div>
                    <div class="mb-4">
                        <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Email">
                            Email
                        </label>
                        <input class="shadow appearance-none border rounded-3xl w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline" type="email" placeholder="email" bind:value={email}>
                    </div>
                    <div class="mb-6">
                        <label class="block text-on-background-light dark:text-on-background-dark text-sm font-bold mb-2" for="Password">
                            Password
                        </label>
                        <input class="shadow appearance-none border border-red-500 rounded-3xl w-full py-2 px-3 mb-3 leading-tight focus:outline-none focus:shadow-outline" type="password" placeholder="******************" bind:value={password}>
                    </div>
                    <div class="flex items-center justify-evenly">
                        <button on:click={signUpClicked} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline">
                            Sign Up
                        </button>
                        <button on:click={login} class="bg-primary-container-light dark:bg-primary-container-dark text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
{/if}