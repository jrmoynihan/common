```svelte
<script lang='ts'>
    let open_three: () => Promise<void>;
</script>

<ModalWithButton
   bind:open={()=>open_three()}
   button_parameters={{
        text: `I'm a modal with a button, all-in-one.`,
        static_styles: 'padding: 2rem; background-color: darkcyan ;'
   }}
  >
   <svelte:fragment slot="modal-content">
      <p>Hello from the modal!</p>
   </svelte:fragment>
</ModalWithButton>
```
