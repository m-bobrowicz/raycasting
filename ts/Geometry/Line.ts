/// <reference path="Edgeable.ts"/>
/// <reference path="Drawable.ts"/>
/// <reference path="Point.ts"/>

module Geometry {
    export interface Intersection{
        pos: Geometry.Point;
        result: boolean;
    }
    export class LineSegment implements Edgeable, Drawable{
        private _start:Point;
        private _end:Point;
        public stringify:string;

        constructor(start:Point, end:Point) {
            this._start = start;
            this._end = end;
            this.stringify = String(this._start.x)+','
                    +String(this._start.y)+','
                    +String(this._end.x)+','
                    +String(this._end.y);
        }

        public get start() {
            return this._start;
        }

        public get end() {
            return this._end;
        }

        static intersect(line1: LineSegment, line2: LineSegment): Intersection {
            var denominator, a, b, numerator1, numerator2;
            denominator = ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)) - ((line2.end.x - line2.start.x) * (line1.end.y - line1.start.y));
            if (denominator == 0) {
                return {
                    pos: new Point(
                        line1.start.x + (a * (line1.end.x - line1.start.x)),
                        line1.start.y + (a * (line1.end.y - line1.start.y))
                    ),
                    result: false
                };
            }
            a = line1.start.y - line2.start.y;
            b = line1.start.x - line2.start.x;
            numerator1 = ((line2.end.x - line2.start.x) * a) - ((line2.end.y - line2.start.y) * b);
            numerator2 = ((line1.end.x - line1.start.x) * a) - ((line1.end.y - line1.start.y) * b);
            a = numerator1 / denominator;
            b = numerator2 / denominator;
            var onLine1 = a >= 0 && a <= 1;
            var onLine2 = b >= 0 && b <= 1;
            return {
                pos: new Point(
                    line1.start.x + (a * (line1.end.x - line1.start.x)),
                    line1.start.y + (a * (line1.end.y - line1.start.y))
                ),
                result: onLine1 && onLine2
            };
        }

        edges(): Array<LineSegment>{
            var array = new Array<LineSegment>();
            array.push(new LineSegment(this.start, this.end));
            return array;
        }
    }
}
