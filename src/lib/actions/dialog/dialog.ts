const dialogClosingEvent = new Event('closing');
const dialogClosedEvent = new Event('closed');
const dialogOpeningEvent = new Event('opening');
const dialogOpenedEvent = new Event('opened');
const dialogOpenEvent = new Event('open');
const dialogRemovedEvent = new Event('removed');

export function dialog(dialog: HTMLDialogElement) {
	dialog?.addEventListener('close', dialogClose);
	dialog.addEventListener('click', lightDismiss);

	const dialog_attribute_observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			wait_for_animations(mutation);
		}
	});

  dialog_attribute_observer.observe(dialog, {
		attributes: true
	});


	// track deletion
	const dialog_deletion_observer = new MutationObserver((mutations, observer) => {
		for (const mutation of mutations) {
			for (const removedNode of mutation.removedNodes) {
				if (removedNode.nodeName === 'DIALOG') {
					removedNode.removeEventListener('click', lightDismiss);
					removedNode.removeEventListener('close', dialogClose);
					removedNode.dispatchEvent(dialogRemovedEvent);
				}
			}
		}
	});

  dialog_deletion_observer.observe(document.body, {
    attributes: false,
    subtree: false,
    childList: true,
  })

	return {
		destroy() {
			dialog?.removeEventListener('close', dialogClose);
			dialog.removeEventListener('click', lightDismiss);
      dialog_attribute_observer.disconnect();
      dialog_deletion_observer.disconnect();
		}
	};
}

const lightDismiss = ({ target }: Event) => {
	const dialog = target as HTMLDialogElement;
	if (dialog.nodeName === 'DIALOG') dialog.close('dismiss');
}

const dialogClose = async ({ target }: Event) => {
	try {
		const dialog = target as HTMLDialogElement;
		dialog?.setAttribute('inert', '');
		dialog?.dispatchEvent(dialogClosingEvent);

		animationsComplete(dialog);

		dialog?.dispatchEvent(dialogClosedEvent);
	} catch (error) {
		console.error(error);
	}
};

const animationsComplete = (element: HTMLDialogElement) =>
	Promise.allSettled(element.getAnimations().map((animation) => animation.finished));

const wait_for_animations = async (mutation: MutationRecord) => {
	try {
		if (mutation.attributeName === 'open') {
			const dialog = mutation.target as HTMLDialogElement;

			const isOpen = dialog.hasAttribute('open');
			if (!isOpen) return;

			dialog.removeAttribute('inert');

			// set focus
			const focusTarget = dialog.querySelector('[autofocus]') as HTMLElement;
			focusTarget ? focusTarget.focus() : dialog.querySelector('button')?.focus();

			dialog.dispatchEvent(dialogOpeningEvent);
			await animationsComplete(dialog);
			dialog.dispatchEvent(dialogOpenedEvent);
			dialog.dispatchEvent(dialogOpenEvent);
		}
	} catch (error) {
		console.error(error);
	}
}
