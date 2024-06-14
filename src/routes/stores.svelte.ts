import { writable } from 'svelte/store';

export const aside_visible = writable(false);

class Player {
	toggled = $state(false);
}
class ComplexState {
	player = $state(new Player());
}

export const complex_state = new ComplexState();
