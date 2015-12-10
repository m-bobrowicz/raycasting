/// <reference path="../Geometry/Point.ts"/>
/// <reference path="../Geometry/Line.ts"/>
/// <reference path="../Geometry/Drawable.ts"/>

import LineSegment = Geometry.LineSegment;
import Point = Geometry.Point;
import Drawable = Geometry.Drawable;
module Logic{
    export class Ray extends LineSegment implements Drawable{
        static start: Point;
        angle: number;

        constructor(end){
            super(Ray.start, end);
            this.angle = Ray.angleBetween(Ray.start, end);
        }

        private static angleBetween(a: Point, b: Point): number{
            return Math.atan2(b.y - a.y, b.x - a.x);
        }
    }
}
