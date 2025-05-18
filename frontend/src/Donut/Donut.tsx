import {
  type PathProps,
  createElementObject,
  createPathComponent,
  extendContext,
} from '@react-leaflet/core'
import {
  LatLng,
  // type LatLngBoundsExpression,
  Rectangle as LeafletRectangle,
  type PathOptions,
} from 'leaflet'
import type { ReactNode } from 'react'
import { DonutClass } from "./Class.ts"

export interface DonutProps extends PathOptions, PathProps {
  center: LatLng
  radius: number
  innerRadius: number,
  children?: ReactNode
}


export const Donut = createPathComponent<LeafletRectangle, DonutProps>(
  function createDonut({ center, ...options }, ctx) {
    // @ts-ignore
    const donut = new DonutClass(center, options)
    return createElementObject(
      donut,
      extendContext(ctx, { overlayContainer: donut }),
    )
  },
  // function updateDonut(layer, props, prevProps) {
  //   if (props.bounds !== prevProps.bounds) {
  //     layer.setBounds(props.bounds)
  //   }
  // },
)