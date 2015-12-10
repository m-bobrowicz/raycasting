/// <reference path="../../typings/tsd.d.ts"/>
///<reference path="Line.ts"/>
///<reference path="Point.ts"/>
///<reference path="Edgeable.ts"/>
///<reference path="Drawable.ts"/>
/**
 * Created by tocjent on 31.10.14.
 */
module Geometry {
    export class Polygon implements Edgeable, Drawable{
        private _vertices:Array<Point>;

        constructor(vertices:Array<Point>) {
            this._vertices = vertices;
        }

        get first() {
            return this._vertices[0];
        }

        get last() {
            return this._vertices[this._vertices.length - 1];
        }

        get vertexCount() {
            return this._vertices.length;
        }

        get vertices() {
            return this._vertices;
        }

        edges(): Array<LineSegment> {
            var edges:Array<LineSegment> = Array<LineSegment>();
            var previous:Point = this.last;
            this.vertices.forEach(function (vertex:Point) {
                edges.push(new LineSegment(previous, vertex));
                previous = vertex;
            });
            return edges;
        }

        static rectangle(x:number, y:number, width:number, height:number) {
            var rectangle:Array<Point> = new Array<Point>();
            rectangle.push(new Point(x, y));
            rectangle.push(new Point(x + width, y));
            rectangle.push(new Point(x + width, y + height));
            rectangle.push(new Point(x, y + height));
            return rectangle;
        }
    }
}
