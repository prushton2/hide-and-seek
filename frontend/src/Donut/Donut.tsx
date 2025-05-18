import {
  type PathProps,
  createElementObject,
  createPathComponent,
  extendContext,
} from '@react-leaflet/core'
import {
  type LatLngBoundsExpression,
  Rectangle as LeafletRectangle,
  Polyline as LeafletPolyline,
  Point,
  PolyUtil,
  LineUtil,
  LatLng,
  Bounds,
  type PathOptions,
} from 'leaflet'
import type { ReactNode } from 'react'

export interface RectangleProps extends PathOptions, PathProps {
  bounds: LatLngBoundsExpression
  children?: ReactNode
}

const CustomDonut = LeafletPolyline.extend({

	options: {
		fill: true
	},

	isEmpty() {
		return !this._latlngs.length || !this._latlngs[0].length;
	},

	// @method getCenter(): LatLng
	// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
	getCenter() {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}
		return PolyUtil.polygonCenter(this._defaultShape(), this._map.options.crs);
	},

	_convertLatLngs(latlngs: any) {
		const result = LeafletPolyline.prototype._convertLatLngs.call(this, latlngs),
		len = result.length;

		// remove last point if it equals first one
		if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
			result.pop();
		}
		return result;
	},

	_setLatLngs(latlngs: any) {
		LeafletPolyline.prototype._setLatLngs.call(this, latlngs);
		if (LineUtil.isFlat(this._latlngs)) {
			this._latlngs = [this._latlngs];
		}
	},

	_defaultShape() {
		return LineUtil.isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
	},

	_clipPoints() {
		// polygons need a different clipping algorithm so we redefine that

		let bounds = this._renderer._bounds;
		const w = this.options.weight,
		p = new Point(w, w);

		// increase clip padding by stroke width to avoid stroke on clip edges
		bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		for (const ring of this._rings) {
			const clipped = PolyUtil.clipPolygon(ring, bounds, true);
			if (clipped.length) {
				this._parts.push(clipped);
			}
		}
	},

	_updatePath() {
		this._renderer._updatePoly(this, true);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint(p: any) {
		let inside = false,
		part, p1, p2, i, j, k, len, len2;

		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

		// ray casting algorithm for detecting if point is in polygon
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];

				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}

		// also check if it's on polygon stroke
		return inside || LeafletPolyline.prototype._containsPoint.call(this, p, true);
	}

});

export const Donut = createPathComponent<LeafletRectangle, RectangleProps>(
  function createRectangle({ bounds, ...options }, ctx) {
    const donut = new LeafletRectangle(bounds, options)
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