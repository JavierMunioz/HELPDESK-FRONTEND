<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { api } from '$lib/api';
  import { goto } from '$app/navigation';

  const ticket_ref = $page.params.ticket_ref;

  let ticket = null;
  let messages = [];
  let loading = true;
  let error = null;

  // Campos del formulario
  let response = '';
  let isSubmitting = false;
  let submitError = null;
  let submitSuccess = false;

  onMount(async () => {
    try {
      // Cargar ticket
      const ticketRes = await api(`/ticket/${ticket_ref}`);
      ticket = await ticketRes.json();

      // Cargar mensajes
      const messagesRes = await api(`/ticket/${ticket_ref}/messages`);
      messages = await messagesRes.json();
    } catch (err) {
      error = err.message;
    } finally {
      loading = false;
    }
  });

  async function handleSubmit() {
    if (!response.trim()) {
      alert('Por favor, escribe una respuesta.');
      return;
    }

    isSubmitting = true;
    submitError = null;
    submitSuccess = false;

    try {
      const res = await api(`/ticket/${ticket_ref}/respond`, {
        method: 'POST',
        body: JSON.stringify({
          response: response.trim(),
          status: 'Respondido'
        })
      });

      if (res.ok) {
        submitSuccess = true;

        // Recargar mensajes
        const messagesRes = await api(`/ticket/${ticket_ref}/messages`);
        messages = await messagesRes.json();

        // Limpiar textarea
        response = '';

        // Opcional: notificación visual
        setTimeout(() => {
          submitSuccess = false;
        }, 3000);
      } else {
        const data = await res.json();
        submitError = data.detail || 'Error al enviar respuesta';
      }
    } catch (err) {
      submitError = err.message;
    } finally {
      isSubmitting = false;
    }
  }

  function goBack() {
    goto('/admin/dashboard');
  }

  // Formatear fecha
  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
</script>

<main>
  <header>
    <h1>📨 Responder Ticket: {ticket_ref}</h1>
    <button on:click={goBack}>⬅️ Volver</button>
  </header>

  {#if loading}
    <p>Cargando datos del ticket y mensajes...</p>
  {:else if error}
    <div class="error">❌ {error}</div>
    <button on:click={goBack}>Volver al dashboard</button>
  {:else if ticket}
    <div class="ticket-info">
      <h2>{ticket.title}</h2>
      <p><strong>Nombre:</strong> {ticket.name}</p>
      <p><strong>Email:</strong> {ticket.email}</p>
      <p><strong>Descripción:</strong> {ticket.subject}</p>
      <p><strong>Estado:</strong> {ticket.status}</p>
      <p><strong>Número:</strong> {ticket.ticket_number}</p>
    </div>

    <!-- Historial de mensajes -->
    <div class="messages-section">
      <h3>💬 Historial de Mensajes ({messages.length})</h3>
      {#if messages.length === 0}
        <p class="no-messages">No hay mensajes aún.</p>
      {:else}
        <div class="messages-list">
          {#each messages as msg}
            <div class="message">
              <div class="message-header">
                <span class="author">{msg.author || 'Soporte'}</span>
                <span class="date">{formatDate(msg.created_at)}</span>
              </div>
              <div class="message-content">
                {msg.content}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Formulario de nueva respuesta -->
    <form on:submit|preventDefault={handleSubmit} class="response-form">
      <div class="form-group">
        <label for="response">Escribe tu respuesta</label>
        <textarea
          id="response"
          bind:value={response}
          placeholder="Escribe tu respuesta aquí..."
          rows="6"
          required
        ></textarea>
      </div>

      {#if submitError}
        <div class="error">❌ {submitError}</div>
      {/if}

      {#if submitSuccess}
        <div class="success">✅ ¡Respuesta enviada con éxito!</div>
      {/if}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Respuesta'}
      </button>
    </form>
  {/if}

  <style>
    main {
      max-width: 900px;
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
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button[disabled] {
      background: #ccc;
      cursor: not-allowed;
    }
    .ticket-info {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      margin-bottom: 2rem;
      border: 1px solid #e9ecef;
    }
    .messages-section {
      margin-bottom: 2rem;
    }
    .messages-section h3 {
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #007bff;
    }
    .no-messages {
      color: #6c757d;
      font-style: italic;
    }
    .messages-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .message {
      background: white;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .message-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      color: #495057;
    }
    .author {
      font-weight: bold;
      color: #007bff;
    }
    .date {
      color: #6c757d;
    }
    .message-content {
      line-height: 1.5;
    }
    .response-form {
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: inherit;
      font-size: 1rem;
      resize: vertical;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
    .success {
      background: #d4edda;
      color: #155724;
      padding: 1rem;
      border-radius: 4px;
      margin: 1rem 0;
    }
  </style>
</main>