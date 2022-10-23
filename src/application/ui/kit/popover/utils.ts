import { isServer } from 'lib/browser';

import { Alignment, Placement } from '.';


// mn distance above and under a target element
const minVerticalFreeSpace = 8;
// min distance to screen horizontal edges
const minHorizontalEdgeOffset = 8;

const defaultPositionStyles: PositionViewAttrs = {
  top: 'auto',
  right: 'auto',
  bottom: 'auto',
  left: 'auto',
  transform: 'none',
};
export type PositionViewAttrs = {
  top: string;
  right: string;
  bottom: string;
  left: string;
  transform: string;
};
type CalcPositionParams = {
  targetElBoundingRect: DOMRect;
  popoverContentDOMRect: DOMRect;
  popoverWidth: number;
  placement: Placement;
  horizontalOffset: number;
  verticalOffset: number;
  alignment: Alignment;
  isRTL?: boolean;
};

/**
 * Returns calculated styles (top/right/bottom/left/transform) for passed placement and alignment
 * This func considers current position of a popover's parent and tries to place popover on
 * the closest placement and alignment, which were passed in props
 */
export function getPositionViewAttrs(params: CalcPositionParams): PositionViewAttrs {
  if (isServer) {
    return defaultPositionStyles;
  }

  let mutableParams = {
    ...params,
  };

  /**
   * If RTL is on, and placement is 'start' or 'end'
   * We can just switch them, it's much more simple, than calucalte it
   */
  if (
    mutableParams.isRTL &&
    (mutableParams.placement === 'start' || mutableParams.placement === 'end')
  ) {
    mutableParams = {
      ...mutableParams,
      placement: mutableParams.placement === 'start' ? 'end' : 'start',
    };
  }

  const possiblePlacements = getPossiblePlacements(mutableParams);

  switch (mutableParams.placement) {
    case 'end': {
      return possiblePlacements.includes('end')
        ? calcHorizontalPlacementStyles(mutableParams, 'end')
        : calcHorizontalPlacementStyles(mutableParams, 'start');
    }
    case 'start': {
      return possiblePlacements.includes('start')
        ? calcHorizontalPlacementStyles(mutableParams, 'start')
        : calcHorizontalPlacementStyles(mutableParams, 'end');
    }

    case 'top': {
      return possiblePlacements.includes('top')
        ? calcVerticalPlacementStyles(mutableParams, 'top')
        : calcVerticalPlacementStyles(mutableParams, 'bottom');
    }
    case 'bottom': {
      return possiblePlacements.includes('bottom')
        ? calcVerticalPlacementStyles(mutableParams, 'bottom')
        : calcVerticalPlacementStyles(mutableParams, 'top');
    }
  }
}

function getPossiblePlacements(params: CalcPositionParams): Placement[] {
  const { targetElBoundingRect, verticalOffset, popoverWidth, horizontalOffset, popoverContentDOMRect } =
    params;
  const mutablePlacement: Placement[] = [];

  if (targetElBoundingRect.top >= minVerticalFreeSpace + verticalOffset + popoverContentDOMRect.height) {
    mutablePlacement.push('top');
  }

  if (
    window.innerHeight - targetElBoundingRect.bottom >=
    minVerticalFreeSpace + verticalOffset + popoverContentDOMRect.height
  ) {
    mutablePlacement.push('bottom');
  }

  if (targetElBoundingRect.left >= popoverWidth + minHorizontalEdgeOffset + horizontalOffset) {
    mutablePlacement.push('start');
  }

  if (
    document.documentElement.clientWidth - targetElBoundingRect.right >=
    popoverWidth + minHorizontalEdgeOffset + horizontalOffset
  ) {
    mutablePlacement.push('end');
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
        popoverWidth: Math.ceil(params.popoverWidth / 2),
      });

      if (possiblePlacements.includes('end')) {
        mutablePossibleAlignment.push('start');
      }

      if (possiblePlacements.includes('start')) {
        mutablePossibleAlignment.push('end');
      }

      if (possiblePlacements.includes('end') && possiblePlacements.includes('start')) {
        mutablePossibleAlignment.push('center');
      }

      break;
    }

    case 'start':
    case 'end': {
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
        left: Math.round(
          targetElBoundingRect.left +
            horizontalOffset +
            window.scrollX -
            popoverWidth / 2 +
            targetElBoundingRect.width / 2,
        ).toString(),
      };
    case 'end':
      return {
        right: (
          document.documentElement.clientWidth -
          targetElBoundingRect.right +
          horizontalOffset +
          window.scrollX
        ).toString(),
      };
  }
}

function calcHorizontalPlacementStyles(
  calcPositionParams: CalcPositionParams,
  placement: 'start' | 'end',
) {
  const { targetElBoundingRect, horizontalOffset } = calcPositionParams;
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
    right:
      placement === 'start'
        ? (
            document.documentElement.clientWidth -
            targetElBoundingRect.left +
            horizontalOffset
          ).toString()
        : '',
    left: placement === 'end' ? (targetElBoundingRect.right + horizontalOffset).toString() : '',
  };
}

function calcVerticalAlignmentStyles(params: CalcPositionParams) {
  const { alignment, targetElBoundingRect, verticalOffset } = params;

  switch (alignment) {
    case 'start': {
      return {
        top: (targetElBoundingRect.top + window.scrollY + verticalOffset).toString(),
      };
    }
    case 'center': {
      return {
        top: Math.round(
          targetElBoundingRect.top + window.scrollY + targetElBoundingRect.height / 2 + verticalOffset,
        ).toString(),
      };
    }

    case 'end': {
      return {
        bottom: (
          document.body.scrollHeight -
          targetElBoundingRect.bottom -
          window.scrollY -
          verticalOffset
        ).toString(),
      };
    }
  }
}
