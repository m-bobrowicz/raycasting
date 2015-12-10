/// <reference path="../../typings/tsd.d.ts"/>
///<reference path="Point.ts"/>
///<reference path="Polygon.ts"/>

module Geometry{
    export class Circle implements Edgeable, Drawable{
        _radius: number;
        _pos: Point;
        constructor(pos: Point, radius: number){
            this._pos = pos;
            this._radius = radius;
        }

        get radius(): number{
            return this._radius;
        }

        get pos(): Point{
            return this._pos;
        }

        approx(): Polygon{
            var vertices = new Array<Point>();
            var accuracy = Math.round(10);
            var angle = 2*Math.PI*((accuracy-1)/accuracy);
            vertices.push(new Point(
                this._pos.x + this._radius*Math.cos(angle),
                this._pos.y + this._radius*Math.sin(angle)
            ));
            var pos = this.pos;
            var radius = this.radius;
            _.times(accuracy, function(index){
                angle = 2*Math.PI*((index)/accuracy);
                vertices.push(new Point(
                    pos.x + radius*Math.cos(angle),
                    pos.y + radius*Math.sin(angle)
                ));
            });
            return new Polygon(vertices);
        }

        edges(): Array<LineSegment>{
            var edges = new Array<LineSegment>();
            _.each(this.approx().edges(), function(edge){edges.push(edge)});
            return edges;
        }
    }
}
