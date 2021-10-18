import { isServer } from 'lib/browser';
import { Alignment, Placement } from '.';

// mn distance above and under a target element
const minVerticalFreeSpace = 100;
// min distance to screen horizontal edges
const minHorizontalEdgeOffset = 8;

const defaultPositionStyles = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  transform: 'none',
};
type CalcPositionParams = {
  targetElBoundingRect: DOMRect;
  popoverWidth: number;
  placement: Placement;
  horizontalOffset: number;
  verticalOffset: number;
  alignment: Alignment;
};
/**
 * Returns calculated styles (top/right/bottom/left/transform) for passed placement and alignment
 * This func considers current position of a popover's parent and tries to place popover on
 * the closest placement and alignment, which were passed in props
 */
export function getPositionStyles(params: CalcPositionParams) {
  const { placement } = params;

  if (isServer) {
    return defaultPositionStyles;
  }

  const possiblePlacements = getPossiblePlacements(params);

  switch (placement) {
    case 'right': {
      return possiblePlacements.includes('right')
        ? calcHorizontalPlacementStyles(params, 'right')
        : calcHorizontalPlacementStyles(params, 'left');
    }
    case 'left': {
      return possiblePlacements.includes('left')
        ? calcHorizontalPlacementStyles(params, 'left')
        : calcHorizontalPlacementStyles(params, 'right');
    }

    case 'top': {
      return possiblePlacements.includes('top')
        ? calcVerticalPlacementStyles(params, 'top')
        : calcVerticalPlacementStyles(params, 'bottom');
    }
    case 'bottom': {
      return possiblePlacements.includes('bottom')
        ? calcVerticalPlacementStyles(params, 'bottom')
        : calcVerticalPlacementStyles(params, 'top');
    }
  }
}

/**
 * Return several possible placements.
 * Can be usefull, when you need to calc the final placement and alignment
 */
function getPossiblePlacements(params: CalcPositionParams): Placement[] {
  const { targetElBoundingRect, verticalOffset, popoverWidth, horizontalOffset } = params;
  const mutablePlacement: Placement[] = [];

  /**
   * If there is enough space above the popover's parent
   * top space above the parent + verticalOffset
   *
   * It is possible, that the popover will be placed over the screen
   * But this is a lesser of two evils.
   */
  if (targetElBoundingRect.top >= minVerticalFreeSpace + verticalOffset) {
    mutablePlacement.push('top');
  }

  /**
   * If there is enough space under the popover's parent
   * the window height - a bottom space, under the parent + verticalOffset
   *
   * It is possible, that the popover will be placed over the screen
   * But this is a lesser of two evils.
   */
  if (window.innerHeight - targetElBoundingRect.bottom >= minVerticalFreeSpace + verticalOffset) {
    mutablePlacement.push('bottom');
  }

  if (targetElBoundingRect.left >= popoverWidth + minHorizontalEdgeOffset + horizontalOffset) {
    mutablePlacement.push('left');
  }

  if (
    window.innerWidth - targetElBoundingRect.right >=
    popoverWidth + horizontalOffset + minHorizontalEdgeOffset
  ) {
    mutablePlacement.push('right');
  }

  if (!mutablePlacement.length) {
    mutablePlacement.push('bottom');
  }

  return mutablePlacement;
}

function getPossibleAlignment(params: CalcPositionParams): Alignment {
  const { alignment, placement } = params;
  const mutablePossibleAlignment: Alignment[] = [];

  switch (placement) {
    case 'top':
    case 'bottom': {
      const possiblePlacements = getPossiblePlacements({
        ...params,
        popoverWidth: params.popoverWidth / 2,
      });

      if (possiblePlacements.includes('right')) {
        mutablePossibleAlignment.push('start');
      }

      if (possiblePlacements.includes('left')) {
        mutablePossibleAlignment.push('end');
      }

      if (possiblePlacements.includes('right') && possiblePlacements.includes('left')) {
        mutablePossibleAlignment.push('center');
      }

      break;
    }

    case 'left':
    case 'right': {
      const possiblePlacements = getPossiblePlacements(params);

      if (possiblePlacements.includes('bottom')) {
        mutablePossibleAlignment.push('start');
      }

      if (possiblePlacements.includes('top')) {
        mutablePossibleAlignment.push('end');
      }

      if (possiblePlacements.includes('top') && possiblePlacements.includes('bottom')) {
        mutablePossibleAlignment.push('center');
      }
    }
  }

  switch (alignment) {
    case 'start': {
      return mutablePossibleAlignment.includes('start') ? 'start' : 'end';
    }
    case 'end': {
      return mutablePossibleAlignment.includes('end') ? 'end' : 'start';
    }
    case 'center': {
      if (mutablePossibleAlignment.includes('center')) {
        return 'center';
      }

      if (mutablePossibleAlignment.includes('start')) {
        return 'start';
      }

      if (mutablePossibleAlignment.includes('end')) {
        return 'end';
      }

      return 'start';
    }
  }
}

function calcVerticalPlacementStyles(params: CalcPositionParams, placement: 'top' | 'bottom') {
  const { targetElBoundingRect, verticalOffset } = params;
  const alignment = getPossibleAlignment({
    ...params,
    placement,
  });

  return {
    ...defaultPositionStyles,
    ...calcHorizontalAlignmentStyles({
      ...params,
      alignment,
    }),
    bottom:
      placement === 'top'
        ? (
            document.body.scrollHeight -
            targetElBoundingRect.top -
            window.scrollY +
            verticalOffset
          ).toString()
        : 'auto',
    top:
      placement === 'bottom'
        ? (targetElBoundingRect.bottom + verticalOffset + window.scrollY).toString()
        : 'auto',
  };
}

function calcHorizontalAlignmentStyles(params: CalcPositionParams) {
  const { alignment, targetElBoundingRect, horizontalOffset, popoverWidth } = params;

  switch (alignment) {
    case 'start':
      return {
        left: (targetElBoundingRect.left + horizontalOffset + window.scrollX).toString(),
      };
    case 'center':
      return {
        left: (
          targetElBoundingRect.left +
          horizontalOffset +
          window.scrollX -
          popoverWidth / 2 +
          targetElBoundingRect.width / 2
        ).toString(),
      };
    case 'end':
      return {
        right: (
          window.innerWidth -
          targetElBoundingRect.right +
          horizontalOffset +
          window.scrollX
        ).toString(),
      };
  }
}

function calcHorizontalPlacementStyles(
  calcPositionParams: CalcPositionParams,
  placement: 'left' | 'right',
) {
  const { targetElBoundingRect } = calcPositionParams;
  const alignment = getPossibleAlignment({
    ...calcPositionParams,
    placement,
  });

  return {
    ...defaultPositionStyles,
    ...calcVerticalAlignmentStyles({
      ...calcPositionParams,
      alignment,
    }),
    transform: alignment === 'center' ? 'translateY(-50%)' : 'none',
    right: placement === 'left' ? (window.innerWidth - targetElBoundingRect.left).toString() : '',
    left: placement === 'right' ? targetElBoundingRect.right.toString() : '',
  };
}

function calcVerticalAlignmentStyles(params: CalcPositionParams) {
  const { alignment, targetElBoundingRect } = params;

  switch (alignment) {
    case 'start': {
      return {
        top: (targetElBoundingRect.top + window.scrollY).toString(),
      };
    }
    case 'center': {
      return {
        top: (targetElBoundingRect.top + window.scrollY + targetElBoundingRect.height / 2).toString(),
      };
    }

    case 'end': {
      return {
        bottom: (document.body.scrollHeight - targetElBoundingRect.bottom - window.scrollY).toString(),
      };
    }
  }
}
