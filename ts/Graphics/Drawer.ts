/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="../Geometry/Point.ts"/>
/// <reference path="../Geometry/Line.ts"/>
/// <reference path="../Geometry/Circle.ts"/>
/// <reference path="../Geometry/Polygon.ts"/>
/// <reference path="../Logic/Ray.ts"/>
/// <reference path="../Logic/Engine.ts"/>
/**
 * Created by Michal on 2014-10-30.
 */
import Polygon = Geometry.Polygon;
import Circle = Geometry.Circle;

module Graphics {
    export class Drawer {

        static clear(width:number, height:number, context:CanvasRenderingContext2D) {
            context.clearRect(0, 0, width, height);
        }

        static draw(shape:Drawable, context:CanvasRenderingContext2D) {
            if (shape instanceof Polygon) {
                Drawer.polygon(<Polygon>shape, context);
            } else if (shape instanceof LineSegment) {
                Drawer.segment(<LineSegment>shape, context);
            } else if (shape instanceof Circle) {
                Drawer.circle(<Circle>shape, context);
            } else if (shape instanceof Logic.Ray) {
                Drawer.ray(<Logic.Ray>shape, context);
            }
        }

        static polygon(polygon:Polygon, context:CanvasRenderingContext2D) {
            context.beginPath();
            context.moveTo(polygon.last.x, polygon.last.y);
            _.each(polygon.vertices, (vertex:Point, index) => {
                context.lineTo(vertex.x, vertex.y);
            });
            context.closePath();
            context.stroke();
        }

        static fillPolygon(polygon:Polygon, context:CanvasRenderingContext2D) {
            context.beginPath();
            context.moveTo(polygon.last.x, polygon.last.y);
            _.each(polygon.vertices, (vertex:Point) => context.lineTo(vertex.x, vertex.y));
            context.closePath();
            context.fill();
        }

        static segment(segment:LineSegment, context:CanvasRenderingContext2D) {
            context.beginPath();
            context.moveTo(segment.start.x, segment.start.y);
            context.lineTo(segment.end.x, segment.end.y);
            context.closePath();
            context.stroke();
        }

        static ray(ray:Logic.Ray, context:CanvasRenderingContext2D) {
            context.beginPath();
            context.moveTo(Logic.Ray.start.x, Logic.Ray.start.y);
            context.lineTo(ray.end.x, ray.end.y);
            context.closePath();
            context.stroke();
        }

        static circle(circle:Circle, context:CanvasRenderingContext2D) {
            context.beginPath();
            context.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        }

        static fillCircle(circle:Circle, context:CanvasRenderingContext2D) {
            context.beginPath();
            context.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
        }

        static light(data: Logic.Data, context:CanvasRenderingContext2D) {
            var vertices = _.reduce(data.groups, (memo, group) => {
                memo.push(group.projectedPair.previous.end);
                memo.push(group.projectedPair.next.end);
                return memo;
            }, []);
            vertices = _.uniq(vertices, (v) => v.stringify());
            Graphics.Drawer.clear(800, 600, context);
            context.fillStyle = "rgba(255, 0, 255, 0.3)";
            var gradient = context.createRadialGradient(
                data.source.position.x,
                data.source.position.y,
                10,
                data.source.position.x,
                data.source.position.y,
                400
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
            context.fillStyle = gradient;
            Graphics.Drawer.fillPolygon(new Polygon(vertices), context);
        }
    }
}
