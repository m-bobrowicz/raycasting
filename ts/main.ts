/// <reference path="../typings/tsd.d.ts"/>
/// <reference path="Graphics/Drawer.ts"/>
/// <reference path="Graphics/Animation.ts"/>
/// <reference path="Geometry/Point.ts"/>
/// <reference path="Geometry/Line.ts"/>
/// <reference path="Logic/Engine.ts"/>
/**
 * Created by Michal on 2014-10-29.
 */
var windowWidth:number = 800;
var windowHeight:number = 600;
var shapes = new Array<Geometry.Edgeable>();
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(20, 20, windowWidth-40, windowHeight-40)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(50, 50, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(50, 400, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(225, 50, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(300, 100, 400, 400)));
shapes.push(new LineSegment(new Point(100, 150), new Point(400, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(225, 225, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(400, 50, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(400, 400, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(575, 225, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(575, 400, 150, 150)));
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(125, 125, 150, 150)));


var edges = _.reduce(shapes, (memo, shape: Geometry.Edgeable) => _.union(memo, shape.edges()), new Array<Geometry.LineSegment>());
edges = _.reduce(edges, (memo, e: Geometry.LineSegment) => {
    var intersections: Array<Geometry.Point> = _.chain(edges)
        .map((cross: Geometry.LineSegment) => Geometry.LineSegment.intersect(e, cross))
        .filter((cross) => cross.result)
        .sortBy((cross) => (Math.pow((cross.pos.x - e.start.x), 2) + Math.pow((cross.pos.y - e.start.y), 2)))
        .map((cross) => cross.pos)
        .value();
    if(intersections.length > 0){
        var previousEnd = e.start;
        _.each(intersections, (cross) => {
            memo.push(new Geometry.LineSegment(previousEnd, cross));
            previousEnd = cross;
        });
        memo.push(new Geometry.LineSegment(previousEnd, _.last(intersections)));
    } else {
        memo.push(e);
    }
    return memo;
}, new Array<Geometry.LineSegment>());

$(document).ready(function () {
    var canvas:HTMLCanvasElement = <HTMLCanvasElement>$('#background')[0];
    var ctx:CanvasRenderingContext2D = canvas.getContext('2d');
    $('#animate').click(function(){
        Logic.Engine.update(
            new Geometry.Point(_.random(0, 800), _.random(0, 600)),
            edges,
            shapes,
            Graphics.Animation.animate
        );
    });
    $('#menu').css('left', windowWidth);
    $('canvas').prop('width', windowWidth);
    $('canvas').prop('height', windowHeight);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, windowWidth, windowHeight);
    ctx.strokeStyle = "rgb(0, 255, 0)";
    _.each(shapes, (s) => Graphics.Drawer.draw(s, ctx));
    canvas = <HTMLCanvasElement>$('#myCanvas')[0];
    ctx = canvas.getContext('2d');
    $(canvas).prop('width', windowWidth);
    $(canvas).prop('height', windowHeight);
    //$(canvas).mousemove(handler);
    ctx.strokeStyle = "rgb(0, 0, 255)";
    handler({clientX: windowWidth/2, clientY: windowHeight/2});
    var rotation = 0;
    setInterval(() => {
        Logic.Engine.update(
            new Geometry.Point(
                position(windowWidth/2, windowHeight/2, 250, rotation)
            ),
            edges,
            shapes,
            draw
        );
        rotation = rotation < 1 ? rotation + 0.001 : 0;
    }, 10);
});

function draw(data) {
    var canvas:HTMLCanvasElement = <HTMLCanvasElement>$('#myCanvas')[0];
    var ctx:CanvasRenderingContext2D = canvas.getContext('2d');
    Graphics.Drawer.clear(windowWidth, windowHeight, ctx);
    Graphics.Drawer.light(data, ctx);
}

function position(x, y, radius, rotation){
    return {
        x: x + radius * Math.cos(rotation * 2 * Math.PI),
        y: y + radius * Math.sin(rotation * 2 * Math.PI)
    }
};

function handler(event) {
    if(
        event.clientX >=40 && event.clientX <= windowWidth-40 &&
        event.clientY >=40 && event.clientY <= windowHeight-40
    ){
        Logic.Engine.update(new Geometry.Point(event.clientX, event.clientY), edges, shapes, draw);
    }
};
