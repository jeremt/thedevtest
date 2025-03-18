<script lang="ts">
	import SwaggerUI from 'swagger-ui';

	import openapi from '$lib/swagger/swagger.json';

	import 'swagger-ui/dist/swagger-ui.css';

	$effect(() => {
		SwaggerUI({ spec: openapi, dom_id: '#swagger-ui' });
		const bg = document.querySelector('.bg') as HTMLDivElement;
		if (bg) {
			bg.style.display = 'none';
			return () => {
				bg.style.display = 'block';
			};
		}
	});
</script>

<div id="swagger-ui" style:height="100vh" style:overflow="auto" style:background="white"></div>
