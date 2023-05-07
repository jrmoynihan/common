<script>import { Fa } from '@jrmoynihan/svelte-fa';
export let title = '';
export let msg = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos quos, itaque exercitationem excepturi soluta, veniam enim nesciunt ab unde adipisci minus dolorem qui ducimus? Omnis fuga hic ipsum cupiditate soluta!';
export let text_styles = '';
export let header_styles = '';
export let icon = null;
export let icon_size = 'lg';
export let icon_color = 'inherit';
</script>

<div class="default-toast">
	{#if title}
		<h3 style={header_styles}>
			{#if icon}<Fa {icon} size={icon_size} color={icon_color} />{/if}
			{title}
		</h3>
	{/if}
	{#if msg}
		<div class="toast-msg" style={text_styles}>{@html msg}</div>
	{/if}
</div>

<style>.default-toast {
  display: grid;
  grid-auto-columns: minmax(0, auto);
  gap: 0.25rem;
  overflow: auto;
  word-wrap: anywhere;
  text-align: center;
}

.toast-msg {
  font-size: 0.85em;
}

h3 {
  font-weight: bold;
  margin-block: 0.25rem;
}</style>
