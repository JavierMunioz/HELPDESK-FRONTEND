<script>
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';
  let error = '';

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
formData.append('username', username);
formData.append('password', password);

const res = await fetch('http://161.97.112.69:3443/login', {
  method: 'POST',
  headers: {
    // No pongas Content-Type: application/json
    // Deja que el navegador lo maneje automáticamente
  },
  body: formData
});

    const data = await res.json();

    if (res.ok && data.access_token) {
      // Guardar token en cookie
      const secureFlag = !import.meta.env.DEV ? '; Secure' : '';
      document.cookie = `auth_token=${data.access_token}; path=/; max-age=86400; SameSite=Strict${secureFlag}`;

      // Redirigir
      const url = new URL(window.location);
      const redirectTo = url.searchParams.get('redirectTo') || '/admin/dashboard';
      goto(redirectTo);
    } else {
      error = data.detail || 'Credenciales inválidas';
    }
  }
</script>

<main>
  <h1>🔐 Iniciar Sesión (Admin)</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form on:submit={handleSubmit}>
    <div>
      <label for="email">Email</label>
      <input
        id="email"
        type="email"
        bind:value={username}
        required
        placeholder="admin@example.com"
      />
    </div>

    <div>
      <label for="password">Contraseña</label>
      <input
        id="password"
        type="password"
        bind:value={password}
        required
        placeholder="••••••••"
      />
    </div>

    <button type="submit">Iniciar Sesión</button>
  </form>

  <style>
    main {
      max-width: 400px;
      margin: 3rem auto;
      padding: 1.5rem;
      font-family: system-ui;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    input, button {
      width: 100%;
      padding: 0.5rem;
      margin: 0.5rem 0;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    button {
      background: #007bff;
      color: white;
      cursor: pointer;
    }
  </style>
</main>