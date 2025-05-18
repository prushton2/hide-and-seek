import {
  type PathProps,
  createElementObject,
  createPathComponent,
  extendContext,
} from '@react-leaflet/core'
import {
  type LatLngBoundsExpression,
  Rectangle as LeafletRectangle,
  type PathOptions,
  Rectangle,
} from 'leaflet'
import type { ReactNode } from 'react'
import { Donut } from "Class.ts"

export interface RectangleProps extends PathOptions, PathProps {
  bounds: LatLngBoundsExpression
  children?: ReactNode
}


export const Donut = createPathComponent<LeafletRectangle, RectangleProps>(
  function createRectangle({ bounds, ...options }, ctx) {
    const donut = new Rectangle(bounds, options)
    return createElementObject(
      donut,
      extendContext(ctx, { overlayContainer: donut }),
    )
  },
  function updateRectangle(layer, props, prevProps) {
    if (props.bounds !== prevProps.bounds) {
      layer.setBounds(props.bounds)
    }
  },
)