export const keyframeNames = {
  opacity: 'opacity',
};

export const baseTransitionDuration = 150;
export const midTransitionDuration = 200;

export const colors = {
  navi: {
    /**
     * dark text
     */
    xlight: (alpha = 1) => `rgba(171, 194, 242, ${alpha})`,

    /**
     * light text
     */
    light: (alpha = 1) => `rgba(62, 103, 187, ${alpha})`,

    /**
     * light text
     */
    base: (alpha = 1) => `rgba(0, 31, 95, ${alpha})`,

    /**
     * light text
     */
    dark: (alpha = 1) => `rgba(8, 28, 69, ${alpha})`,

    /**
     * light text
     */
    xdark: (alpha = 1) => `rgba(9, 23, 52, ${alpha})`,
  },

  teal: {
    /**
     * dark text
     */
    xlight: (alpha = 1) => `rgba(183, 228, 230, ${alpha})`,

    /**
     * dark text
     */
    light: (alpha = 1) => `rgba(134, 202, 198, ${alpha})`,

    /**
     * dark/light text
     */
    base: (alpha = 1) => `rgba(16, 165, 172, ${alpha})`,

    /**
     * light text
     */
    dark: (alpha = 1) => `rgba(10, 98, 102, ${alpha})`,

    /**
     * light text
     */
    xdark: (alpha = 1) => `rgba(0, 81, 84, ${alpha})`,
  },

  orange: {
    /**
     * dark text
     */
    light: (alpha = 1) => `rgba(255, 152, 102, ${alpha})`,

    /**
     * dark text
     */
    base: (alpha = 1) => `rgba(247, 105, 35, ${alpha})`,

    /**
     * dark/light text
     */
    dark: (alpha = 1) => `rgba(199, 66, 0, ${alpha})`,
  },

  yellow: {
    /**
     * dark text
     */
    light: (alpha = 1) => `rgba(255, 227, 153, ${alpha})`,

    /**
     * dark text
     */
    base: (alpha = 1) => `rgba(255, 200, 54, ${alpha})`,

    /**
     * dark text
     */
    dark: (alpha = 1) => `rgba(232, 175, 23, ${alpha})`,
  },

  berry: {
    /**
     * light/dark text
     */
    light: (alpha = 1) => `rgba(230, 54, 144, ${alpha})`,
    /**
     * light text
     */
    base: (alpha = 1) => `rgba(172, 19, 97, ${alpha})`,
    /**
     * light text
     */
    dark: (alpha = 1) => `rgba(102, 29, 52, ${alpha})`,
  },

  violet: {
    /**
     * light text
     */
    base: (alpha = 1) => `rgba(95, 103, 185, ${alpha})`,
  },

  purple: {
    /**
     * light text
     */
    base: (alpha = 1) => `rgba(164, 79, 181, ${alpha})`,
  },

  white: {
    /**
     * dark text
     */
    base: (alpha = 1) => `rgba(255, 255, 255, ${alpha})`,
  },

  black: {
    /**
     * light text
     */
    base: (alpha = 1) => `rgba(21, 22, 25, ${alpha})`,
  },

  grey: {
    /**
     * dark text
     */
    xlight: (alpha = 1) => `rgba(246, 246, 249, ${alpha})`,

    /**
     * dark text
     */
    light: (alpha = 1) => `rgba(224, 226, 235, ${alpha})`,

    /**
     * dark/light text
     */
    base: (alpha = 1) => `rgba(141, 142, 153, ${alpha})`,
    /**
     * light text
     */
    dark: (alpha = 1) => `rgba(92, 93, 102, ${alpha})`,

    /**
     * light text
     */
    xdark: (alpha = 1) => `rgba(46, 46, 51, ${alpha})`,
  },

  status: {
    info: {
      /**
       * dark text
       */
      light: (alpha = 1) => `rgba(214, 237, 255, ${alpha})`,

      /**
       * light text
       */
      base: (alpha = 1) => `rgba(0, 118, 209, ${alpha})`,

      /**
       * light text
       */
      dark: (alpha = 1) => `rgba(0, 72, 128, ${alpha})`,
    },

    success: {
      /**
       * dark text
       */
      light: (alpha = 1) => `rgba(219, 240, 220, ${alpha})`,

      /**
       * light text
       */
      base: (alpha = 1) => `rgba(53, 126, 56, ${alpha})`,

      /**
       * light text
       */
      dark: (alpha = 1) => `rgba(37, 105, 64, ${alpha})`,
    },

    error: {
      /**
       * dark text
       */
      light: (alpha = 1) => `rgba(250, 213, 209, ${alpha})`,

      /**
       * light text
       */
      base: (alpha = 1) => `rgba(180, 40, 24, ${alpha})`,

      /**
       * light text
       */
      dark: (alpha = 1) => `rgba(157, 35, 21, ${alpha})`,
    },

    warning: {
      /**
       * dark text
       */
      light: (alpha = 1) => `rgba(250, 244, 209, ${alpha})`,

      /**
       * dark text
       */
      base: (alpha = 1) => `rgba(232, 205, 48, ${alpha})`,

      /**
       * dark/light text
       */
      dark: (alpha = 1) => `rgba(207, 179, 23, ${alpha})`,
    },
  },
};
