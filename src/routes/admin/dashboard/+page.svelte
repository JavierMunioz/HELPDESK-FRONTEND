<script>
    import { onMount } from "svelte";
    import { api } from "$lib/api";
    import { goto } from "$app/navigation";
    let tickets = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const res = await api("/tickets/");
            tickets = await res.json();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    });

    function logout() {
        // Borrar cookie
        document.cookie = "auth_token=; path=/; max-age=0";
        // Redirigir
        window.location.href = "/admin/login";
    }
</script>

<main>
    <header>
        <h1>📋 Panel de Administración - Tickets</h1>
        <button on:click={logout}>🚪 Cerrar Sesión</button>
    </header>

    {#if loading}
        <p>Cargando tickets...</p>
    {:else if error}
        <div class="error">❌ {error}</div>
    {:else if tickets.length === 0}
        <p>📭 No hay tickets aún.</p>
    {:else}
        <div class="tickets">
            {#each tickets as ticket}
                <div class="ticket">
                    <h3>{ticket.title}</h3>
                    <p><strong>Nombre:</strong> {ticket.name}</p>
                    <p><strong>Email:</strong> {ticket.email}</p>
                    <p><strong>Descripcion:</strong> {ticket.subject}</p>
                    <p><strong>Estado:</strong> {ticket.status}</p>
                    <div>
                        <button
                            on:click={() =>
                                goto(`/tickets/${ticket.ticket_ref}`)}
                            >Responder</button
                        >
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    <style>
        main {
            max-width: 800px;
            margin: 2rem auto;
            padding: 1rem;
            font-family: system-ui;
        }
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        button {
            padding: 0.5rem 1rem;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .tickets {
            display: grid;
            gap: 1rem;
        }
        .ticket {
            border: 1px solid #eee;
            padding: 1rem;
            border-radius: 8px;
            background: #fafafa;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border-radius: 4px;
            margin: 1rem 0;
        }
    </style>
</main>
