import { createStyles } from 'infrastructure/css/hook';

const toastContainerMaxWith = 420;
const toastContainerSideGap = 10;

export const styles = createStyles({
  toastsContainer: {
    position: 'fixed',
    top: '10px',
    insetInlineEnd: toastContainerSideGap,
    width: '100%',
    maxWidth: toastContainerMaxWith,

    // If a screen width is 420px + 10px - 1px and lower — we do not need
    // a gap between screen and toastsContainer, cause where is no enough space
    // for that container + the gap
    [`@media screen and (max-width: ${toastContainerMaxWith + toastContainerSideGap - 1}px)`]: {
      top: 0,
      insetInlineEnd: 0,
    },
  },
});
