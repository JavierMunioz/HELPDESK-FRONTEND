<script>
	let title = '';
	let email = '';
	let subject = '';
	let name = '';

	let isLoading = false;
	let error = null;
	let success = false;

	async function handleSubmit() {
		// Evitar envío si ya está cargando
		if (isLoading) return;

		// Validación básica
		if (!title || !email || !subject || !name) {
			error = 'Por favor, completa todos los campos';
			return;
		}

		isLoading = true;
		error = null;
		success = false;

		try {
			const response = await fetch('https://161.97.112.69:8443/tickets/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
				},
				body: JSON.stringify({
					title,
					email,
					subject,
					name
				})
			});

			if (!response.ok) {
				throw new Error(`Error HTTP: ${response.status}`);
			}

			const data = await response.json();
			console.log('Ticket creado:', data);
			success = true;

			// Resetear formulario
			title = email = subject = name = '';

		} catch (err) {
			console.error('Error al enviar el ticket:', err);
			error = err.message;
		} finally {
			isLoading = false;
		}
	}

	// Auto-hide alerts after 5 seconds
	$: if (success || error) {
		setTimeout(() => {
			success = false;
			error = null;
		}, 5000);
	}
</script>

<main>
	<div class="container">
		<div class="header">
		<img src="/logo.png" alt="" style="width: 220px;">

			<h1>Crear Ticket</h1>
			<p>Centro de Soporte Técnico</p>
		</div>

		{#if success}
			<div class="alert success">
				<div class="alert-content">
					<strong>Ticket enviado correctamente</strong>
					<p>Recibirás una respuesta en las próximas 24 horas</p>
				</div>
			</div>
		{/if}

		{#if error}
			<div class="alert error">
				<div class="alert-content">
					<strong>Error al procesar solicitud</strong>
					<p>{error}</p>
				</div>
			</div>
		{/if}

		<form on:submit|preventDefault={handleSubmit} class="form">
			<div class="form-group">
				<label for="title">Título</label>
				<input
					id="title"
					type="text"
					bind:value={title}
					required
					placeholder="Describe el problema"
					class="form-input"
				/>
			</div>

			<div class="form-group">
				<label for="name">Nombre completo</label>
				<input
					id="name"
					type="text"
					bind:value={name}
					required
					placeholder="Nombre y apellidos"
					class="form-input"
				/>
			</div>

			<div class="form-group">
				<label for="email">Correo electrónico</label>
				<input
					id="email"
					type="email"
					bind:value={email}
					required
					placeholder="correo@empresa.com"
					class="form-input"
				/>
			</div>

			<div class="form-group">
				<label for="subject">Descripción</label>
				<input
					id="subject"
					type="text"
					bind:value={subject}
					required
					placeholder="Cuentame un poco sobre el problema..."
					class="form-input"
				/>
			</div>

			<button type="submit" disabled={isLoading} class="submit-btn">
				{#if isLoading}
					<div class="spinner"></div>
					Procesando...
				{:else}
					Enviar Solicitud
				{/if}
			</button>
		</form>
	</div>
</main>

<style>
	:global(body) {
		margin: 0;
		background-color: #f8fafc;
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
		color: #1e293b;
		line-height: 1.5;
	}

	main {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 32px 16px;
	}

	.container {
		background: #ffffff;
		border-radius: 8px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
		padding: 48px;
		width: 100%;
		max-width: 480px;
		border: 1px solid #e2e8f0;
	}

	.header {
		text-align: center;
		margin-bottom: 40px;
		border-bottom: 1px solid #e2e8f0;
		padding-bottom: 24px;
	}

	.header h1 {
		font-size: 1.875rem;
		font-weight: 600;
		color: #1e40af;
		margin: 0 0 8px 0;
		letter-spacing: -0.025em;
	}

	.header p {
		color: #64748b;
		font-size: 0.9rem;
		margin: 0;
		font-weight: 400;
	}

	.alert {
		padding: 16px 20px;
		border-radius: 6px;
		margin-bottom: 32px;
		border-left: 4px solid;
	}

	.alert.success {
		background-color: #f0f9ff;
		border-left-color: #0ea5e9;
		color: #0c4a6e;
	}

	.alert.error {
		background-color: #fef2f2;
		border-left-color: #ef4444;
		color: #991b1b;
	}

	.alert-content strong {
		display: block;
		font-weight: 600;
		margin-bottom: 4px;
		font-size: 0.9rem;
	}

	.alert-content p {
		margin: 0;
		font-size: 0.875rem;
		opacity: 0.9;
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	.form-group label {
		font-weight: 500;
		color: #374151;
		margin-bottom: 8px;
		font-size: 0.9rem;
	}

	.form-input {
		padding: 12px 16px;
		font-size: 0.95rem;
		border: 1.5px solid #d1d5db;
		border-radius: 6px;
		background: #ffffff;
		transition: all 0.2s ease;
		outline: none;
		font-family: inherit;
	}

	.form-input:focus {
		border-color: #1e40af;
		box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.08);
	}

	.form-input::placeholder {
		color: #9ca3af;
	}

	.form-input:hover:not(:focus) {
		border-color: #9ca3af;
	}

	.submit-btn {
		padding: 14px 24px;
		font-size: 0.95rem;
		font-weight: 600;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background-color: #1e40af;
		color: white;
		font-family: inherit;
		margin-top: 8px;
	}

	.submit-btn:hover:not(:disabled) {
		background-color: #1d4ed8;
	}

	.submit-btn:active:not(:disabled) {
		background-color: #1e3a8a;
	}

	.submit-btn:disabled {
		background-color: #9ca3af;
		cursor: not-allowed;
	}

	.spinner {
		width: 16px;
		height: 16px;
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		border-top-color: white;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	@media (max-width: 640px) {
		main {
			padding: 16px;
		}
		
		.container {
			padding: 32px 24px;
		}
		
		.header h1 {
			font-size: 1.5rem;
		}
		
		.form-input {
			padding: 12px 14px;
		}
		
		.submit-btn {
			padding: 12px 20px;
		}
	}

	/* Estados de validación */
	.form-input:invalid:not(:focus):not(:placeholder-shown) {
		border-color: #ef4444;
		background-color: #fef2f2;
	}

	.form-input:valid:not(:focus):not(:placeholder-shown) {
		border-color: #10b981;
	}
</style>