<script>
    import { pb } from "./pocketbase";
    import { darkMode, tableToLoadId } from "./stores";

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

</script>

<div>
    <div class="grid grid-cols-3 grid-rows-1 grid-flow-col">
        <div class="mt-5 ml-5 col-start-1 row-start-1 flex justify-start">
            <div class="text-3xl text-on-background-light dark:text-on-background-dark">
                Combat Log
            </div>
            <div>
                <button on:click={goBack} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-5 mb-5 max-w-32 max-h-10">Go Back</button>
            </div>
        </div>
        <div class="col-start-3 row-start-1 flex justify-end">
            <button on:click={toogleDarkMode} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-5 mt-5 mb-5 max-w-32 max-h-10">Light/Dark</button>
            <button on:click={signOut} class="bg-primary-container-light dark:bg-primary-container-dark hover:bg-blue-700 text-on-background-light dark:text-on-background-dark font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-5 mt-5 mb-5 max-w-32 max-h-10">Sign Out</button>
        </div>
    </div>

    
</div>