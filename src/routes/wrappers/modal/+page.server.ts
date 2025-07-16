import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
	submit: async ({ request }) => {
		const form = await request.formData();
		console.log(form);
		return { success: true };
	}
};
