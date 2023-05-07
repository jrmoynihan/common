<script>import { dynamicStyle } from '../actions/dynamic-styles';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons/index';
import { Fa } from '@jrmoynihan/svelte-fa';
export let hovered = false;
export let grabbed = false;
export let styles = '';
export let focus_styles = '';
export let hover_styles = '';
export let active_styles = '';
</script>

<button
	use:dynamicStyle={{
		styles,
		focus_styles,
		hover_styles,
		active_styles
	}}
	class="drag-anchor"
	class:faded={!hovered}
	class:grabbed
	on:mousedown={() => (grabbed ? null : (grabbed = true))}
	on:mouseup={() => (grabbed ? (grabbed = false) : null)}
	on:blur={() => (grabbed ? (grabbed = false) : null)}
>
	<Fa icon={faGripVertical} />
</button>

<style>.drag-anchor {
  box-sizing: border-box;
  display: grid;
  place-items: center;
  place-content: center;
  cursor: grab;
  width: 2rem;
  aspect-ratio: 1/1;
  padding: var(--drag-anchor-padding, 1rem);
  border-radius: var(--drag-anchor-border-radius, 1rem);
  transition: var(--drag-anchor-transition, opacity 200ms);
  background: var(--drag-anchor-background, transparent);
  color: var(--drag-anchor-color, var(--text, inherit));
}
.drag-anchor.grabbed {
  cursor: grabbing;
}
.drag-anchor.faded {
  opacity: var(--drag-anchor-faded-opacity, 0.2);
}
.drag-anchor:hover, .drag-anchor:focus-visible {
  color: var(--drag-anchor-hover-color, var(--drag-anchor-color));
  background: var(--drag-anchor-hover-background, var(--drag-anchor-background));
  opacity: var(--drag-anchor-hovered-opacity, 1);
}
.drag-anchor:active, .drag-anchor:not(:disabled):active {
  background: var(--active-drag-anchor-background, var(--drag-anchor-background, var(--active-button-background)));
}</style>
