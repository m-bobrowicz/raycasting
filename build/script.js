var Geometry;
(function (Geometry) {
    var Point = (function () {
        function Point(positionOrX, y) {
            if (typeof positionOrX === 'number') {
                this._x = Math.round(positionOrX);
                this._y = Math.round(y);
            }
            else {
                this._x = Math.round(positionOrX.x);
                this._y = Math.round(positionOrX.y);
            }
        }
        Object.defineProperty(Point.prototype, "x", {
            get: function () {
                return this._x;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Point.prototype, "y", {
            get: function () {
                return this._y;
            },
            enumerable: true,
            configurable: true
        });
        Point.distance = function (a, b) {
            return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
        };
        Point.prototype.stringify = function () {
            return String(this.x) + ',' + String(this.y);
        };
        return Point;
    })();
    Geometry.Point = Point;
    ;
})(Geometry || (Geometry = {}));
var Geometry;
(function (Geometry) {
    var LineSegment = (function () {
        function LineSegment(start, end) {
            this._start = start;
            this._end = end;
            this.stringify = String(this._start.x) + ','
                + String(this._start.y) + ','
                + String(this._end.x) + ','
                + String(this._end.y);
        }
        Object.defineProperty(LineSegment.prototype, "start", {
            get: function () {
                return this._start;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LineSegment.prototype, "end", {
            get: function () {
                return this._end;
            },
            enumerable: true,
            configurable: true
        });
        LineSegment.intersect = function (line1, line2) {
            var denominator, a, b, numerator1, numerator2;
            denominator = ((line2.end.y - line2.start.y) * (line1.end.x - line1.start.x)) - ((line2.end.x - line2.start.x) * (line1.end.y - line1.start.y));
            if (denominator == 0) {
                return {
                    pos: new Geometry.Point(line1.start.x + (a * (line1.end.x - line1.start.x)), line1.start.y + (a * (line1.end.y - line1.start.y))),
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
                pos: new Geometry.Point(line1.start.x + (a * (line1.end.x - line1.start.x)), line1.start.y + (a * (line1.end.y - line1.start.y))),
                result: onLine1 && onLine2
            };
        };
        LineSegment.prototype.edges = function () {
            var array = new Array();
            array.push(new LineSegment(this.start, this.end));
            return array;
        };
        return LineSegment;
    })();
    Geometry.LineSegment = LineSegment;
})(Geometry || (Geometry = {}));
var Geometry;
(function (Geometry) {
    var Polygon = (function () {
        function Polygon(vertices) {
            this._vertices = vertices;
        }
        Object.defineProperty(Polygon.prototype, "first", {
            get: function () {
                return this._vertices[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "last", {
            get: function () {
                return this._vertices[this._vertices.length - 1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "vertexCount", {
            get: function () {
                return this._vertices.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Polygon.prototype, "vertices", {
            get: function () {
                return this._vertices;
            },
            enumerable: true,
            configurable: true
        });
        Polygon.prototype.edges = function () {
            var edges = Array();
            var previous = this.last;
            this.vertices.forEach(function (vertex) {
                edges.push(new Geometry.LineSegment(previous, vertex));
                previous = vertex;
            });
            return edges;
        };
        Polygon.rectangle = function (x, y, width, height) {
            var rectangle = new Array();
            rectangle.push(new Geometry.Point(x, y));
            rectangle.push(new Geometry.Point(x + width, y));
            rectangle.push(new Geometry.Point(x + width, y + height));
            rectangle.push(new Geometry.Point(x, y + height));
            return rectangle;
        };
        return Polygon;
    })();
    Geometry.Polygon = Polygon;
})(Geometry || (Geometry = {}));
var Geometry;
(function (Geometry) {
    var Circle = (function () {
        function Circle(pos, radius) {
            this._pos = pos;
            this._radius = radius;
        }
        Object.defineProperty(Circle.prototype, "radius", {
            get: function () {
                return this._radius;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Circle.prototype, "pos", {
            get: function () {
                return this._pos;
            },
            enumerable: true,
            configurable: true
        });
        Circle.prototype.approx = function () {
            var vertices = new Array();
            var accuracy = Math.round(10);
            var angle = 2 * Math.PI * ((accuracy - 1) / accuracy);
            vertices.push(new Geometry.Point(this._pos.x + this._radius * Math.cos(angle), this._pos.y + this._radius * Math.sin(angle)));
            var pos = this.pos;
            var radius = this.radius;
            _.times(accuracy, function (index) {
                angle = 2 * Math.PI * ((index) / accuracy);
                vertices.push(new Geometry.Point(pos.x + radius * Math.cos(angle), pos.y + radius * Math.sin(angle)));
            });
            return new Geometry.Polygon(vertices);
        };
        Circle.prototype.edges = function () {
            var edges = new Array();
            _.each(this.approx().edges(), function (edge) { edges.push(edge); });
            return edges;
        };
        return Circle;
    })();
    Geometry.Circle = Circle;
})(Geometry || (Geometry = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LineSegment = Geometry.LineSegment;
var Point = Geometry.Point;
var Logic;
(function (Logic) {
    var Ray = (function (_super) {
        __extends(Ray, _super);
        function Ray(end) {
            _super.call(this, Ray.start, end);
            this.angle = Ray.angleBetween(Ray.start, end);
        }
        Ray.angleBetween = function (a, b) {
            return Math.atan2(b.y - a.y, b.x - a.x);
        };
        return Ray;
    })(LineSegment);
    Logic.Ray = Ray;
})(Logic || (Logic = {}));
var Logic;
(function (Logic) {
    var Engine = (function () {
        function Engine() {
        }
        Engine.update = function (sourcePosition, edges, shapes, callback) {
            Logic.Ray.start = sourcePosition;
            var rays = Logic.Engine.createRays(edges);
            var pairs = Logic.Engine.pairRays(rays);
            var projectedRays = Logic.Engine.projectRays(pairs);
            var projectedEdges = Logic.Engine.projectedEdges(edges, projectedRays);
            var projectedPairs = Logic.Engine.projectPairs(projectedEdges, pairs);
            var groups = Logic.Engine.groupData(_.zip(rays, pairs, projectedRays, projectedEdges, projectedPairs), ['ray', 'pair', 'projectedRay', 'projectedEdge', 'projectedPair']);
            var projectedRayGroups = Logic.Engine.projectGroupRays(groups);
            return callback({
                source: {
                    position: sourcePosition,
                    radius: Engine.size
                },
                edges: edges,
                shapes: shapes,
                groups: groups
            });
        };
        Engine.createRays = function (edges) {
            return _(edges)
                .map(function (e) { return [new Logic.Ray(e.start), new Logic.Ray(e.end)]; })
                .flatten()
                .uniq(function (r) { return r.stringify; })
                .sortBy(function (r) { return r.angle; })
                .value();
        };
        Engine.pairRays = function (rays) {
            var shifted = [];
            shifted.push(_.last(rays));
            _.each(_.initial(rays), function (r) { return shifted.push(r); });
            var pairs = _.zip(shifted, rays);
            return _.map(pairs, function (p) {
                return { previous: p[0], next: p[1] };
            });
        };
        Engine.projectRays = function (pairs) {
            return _.map(pairs, function (r) {
                var projectedAngle = (r.previous.angle + r.next.angle) / 2;
                projectedAngle += Math.abs(r.previous.angle - r.next.angle) > Math.PI ? Math.PI : 0;
                return new Logic.Ray(new Point(Logic.Ray.start.x + 10000 * Math.cos(projectedAngle), Logic.Ray.start.y + 10000 * Math.sin(projectedAngle)));
            });
        };
        Engine.projectedEdges = function (edges, projectedRays) {
            return _.map(projectedRays, function (r) {
                return _(edges)
                    .map(function (e) { return _.extend(e, { intersection: LineSegment.intersect(r, e) }); })
                    .filter(function (e) { return e.intersection.result; })
                    .map(function (e) { return _.extend(e, { distance: Point.distance(e.intersection.pos, Logic.Ray.start) }); })
                    .reject(function (e) { return e.distance === 0; })
                    .sortBy('distance')
                    .first();
            });
        };
        Engine.projectPairs = function (projectedEdges, pairs) {
            var groups = _.map(_.zip(projectedEdges, pairs), function (g) {
                return { edge: g[0], previous: g[1].previous, next: g[1].next };
            });
            return _.map(groups, function (g) {
                return {
                    previous: new Logic.Ray(Geometry.LineSegment.intersect(g.edge, g.previous).pos),
                    next: new Logic.Ray(Geometry.LineSegment.intersect(g.edge, g.next).pos)
                };
            });
        };
        Engine.projectGroupRays = function (groups) {
            return _.map(groups, function (group) {
                var r = group.pair;
                var projectedAngle = (r.previous.angle + r.next.angle) / 2;
                projectedAngle += Math.abs(r.previous.angle - r.next.angle) > Math.PI ? Math.PI : 0;
                group.projectedRay = new Logic.Ray(new Point(Logic.Ray.start.x + 10000 * Math.cos(projectedAngle), Logic.Ray.start.y + 10000 * Math.sin(projectedAngle)));
                return group;
            });
        };
        Engine.groupData = function (arrays, propNames) {
            var groups = _.map(arrays, function (a) {
                return _.zipObject(propNames, a);
            });
            groups = _.reduce(groups, function (memo, group) {
                if (memo.length === 0 ||
                    group.projectedEdge.stringify !== _.last(memo).projectedEdge.stringify) {
                    memo.push(group);
                }
                else if (group.projectedEdge.stringify === _.last(memo).projectedEdge.stringify) {
                    _.last(memo).pair.next = group.pair.next;
                    _.last(memo).projectedPair.next = group.projectedPair.next;
                }
                return memo;
            }, []);
            return groups;
        };
        Engine.size = 10;
        return Engine;
    })();
    Logic.Engine = Engine;
})(Logic || (Logic = {}));
var Polygon = Geometry.Polygon;
var Circle = Geometry.Circle;
var Graphics;
(function (Graphics) {
    var Drawer = (function () {
        function Drawer() {
        }
        Drawer.clear = function (width, height, context) {
            context.clearRect(0, 0, width, height);
        };
        Drawer.draw = function (shape, context) {
            if (shape instanceof Polygon) {
                Drawer.polygon(shape, context);
            }
            else if (shape instanceof LineSegment) {
                Drawer.segment(shape, context);
            }
            else if (shape instanceof Circle) {
                Drawer.circle(shape, context);
            }
            else if (shape instanceof Logic.Ray) {
                Drawer.ray(shape, context);
            }
        };
        Drawer.polygon = function (polygon, context) {
            context.beginPath();
            context.moveTo(polygon.last.x, polygon.last.y);
            _.each(polygon.vertices, function (vertex, index) {
                context.lineTo(vertex.x, vertex.y);
            });
            context.closePath();
            context.stroke();
        };
        Drawer.fillPolygon = function (polygon, context) {
            context.beginPath();
            context.moveTo(polygon.last.x, polygon.last.y);
            _.each(polygon.vertices, function (vertex) { return context.lineTo(vertex.x, vertex.y); });
            context.closePath();
            context.fill();
        };
        Drawer.segment = function (segment, context) {
            context.beginPath();
            context.moveTo(segment.start.x, segment.start.y);
            context.lineTo(segment.end.x, segment.end.y);
            context.closePath();
            context.stroke();
        };
        Drawer.ray = function (ray, context) {
            context.beginPath();
            context.moveTo(Logic.Ray.start.x, Logic.Ray.start.y);
            context.lineTo(ray.end.x, ray.end.y);
            context.closePath();
            context.stroke();
        };
        Drawer.circle = function (circle, context) {
            context.beginPath();
            context.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI);
            context.closePath();
            context.stroke();
        };
        Drawer.fillCircle = function (circle, context) {
            context.beginPath();
            context.arc(circle.pos.x, circle.pos.y, circle.radius, 0, 2 * Math.PI);
            context.closePath();
            context.fill();
        };
        Drawer.light = function (data, context) {
            var vertices = _.reduce(data.groups, function (memo, group) {
                memo.push(group.projectedPair.previous.end);
                memo.push(group.projectedPair.next.end);
                return memo;
            }, []);
            vertices = _.uniq(vertices, function (v) { return v.stringify(); });
            Graphics.Drawer.clear(800, 600, context);
            context.fillStyle = "rgba(255, 0, 255, 0.3)";
            var gradient = context.createRadialGradient(data.source.position.x, data.source.position.y, 10, data.source.position.x, data.source.position.y, 400);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.1)');
            context.fillStyle = gradient;
            Graphics.Drawer.fillPolygon(new Polygon(vertices), context);
        };
        return Drawer;
    })();
    Graphics.Drawer = Drawer;
})(Graphics || (Graphics = {}));
var Graphics;
(function (Graphics) {
    var Animation = (function () {
        function Animation() {
        }
        Animation.animate = function (data) {
            var debugCanvas = $('#debugCanvas')[0];
            var debugContext = debugCanvas.getContext('2d');
            var mainCanvas = $('#myCanvas')[0];
            var mainContext = mainCanvas.getContext('2d');
            var step = 4000;
            Graphics.Drawer.clear(800, 600, mainContext);
            _.each(data.groups, function (group, index) {
                _.delay(function () {
                    _.delay(function () {
                        debugContext.strokeStyle = 'rgba(255, 255, 0, 0.5)';
                        Graphics.Drawer.segment(group.pair.previous, debugContext);
                    }, step * 0.1);
                    _.delay(function () {
                        Graphics.Drawer.segment(group.pair.next, debugContext);
                    }, step * 0.1);
                    _.delay(function () {
                        debugContext.strokeStyle = 'rgba(0, 0, 255, 0.5)';
                        Graphics.Drawer.segment(group.projectedRay, debugContext);
                    }, step * 0.2);
                    _.delay(function () {
                        debugContext.strokeStyle = 'rgba(0, 0, 255, 0.5)';
                        Graphics.Drawer.segment(group.projectedEdge, debugContext);
                    }, step * 0.2);
                    _.delay(function () {
                        debugContext.strokeStyle = 'rgb(0, 255, 255)';
                        Graphics.Drawer.segment(group.projectedPair.previous, debugContext);
                    }, step * 0.1);
                    _.delay(function () {
                        Graphics.Drawer.segment(group.projectedPair.next, debugContext);
                    }, step * 0.1);
                    _.delay(function () {
                        Graphics.Drawer.clear(800, 600, debugContext);
                        mainContext.fillStyle = "rgba(255, 255, 255, 0.5)";
                        Graphics.Drawer.fillPolygon(new Polygon([group.projectedPair.next.end, group.projectedPair.previous.end, data.source.position]), mainContext);
                    }, step * 0.5);
                }, (index + 1) * step);
            });
            _.delay(function () {
                var vertices = _.reduce(data.groups, function (memo, group) {
                    memo.push(group.projectedPair.previous.end);
                    memo.push(group.projectedPair.next.end);
                    return memo;
                }, []);
                vertices = _.uniq(vertices, function (v) { return v.stringify(); });
                Graphics.Drawer.clear(800, 600, mainContext);
                Graphics.Drawer.fillPolygon(new Polygon(vertices), mainContext);
            }, step * (data.groups.length + 1));
        };
        return Animation;
    })();
    Graphics.Animation = Animation;
})(Graphics || (Graphics = {}));
var windowWidth = 800;
var windowHeight = 600;
var shapes = new Array();
shapes.push(new Geometry.Polygon(Geometry.Polygon.rectangle(20, 20, windowWidth - 40, windowHeight - 40)));
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
var edges = _.reduce(shapes, function (memo, shape) { return _.union(memo, shape.edges()); }, new Array());
edges = _.reduce(edges, function (memo, e) {
    var intersections = _.chain(edges)
        .map(function (cross) { return Geometry.LineSegment.intersect(e, cross); })
        .filter(function (cross) { return cross.result; })
        .sortBy(function (cross) { return (Math.pow((cross.pos.x - e.start.x), 2) + Math.pow((cross.pos.y - e.start.y), 2)); })
        .map(function (cross) { return cross.pos; })
        .value();
    if (intersections.length > 0) {
        var previousEnd = e.start;
        _.each(intersections, function (cross) {
            memo.push(new Geometry.LineSegment(previousEnd, cross));
            previousEnd = cross;
        });
        memo.push(new Geometry.LineSegment(previousEnd, _.last(intersections)));
    }
    else {
        memo.push(e);
    }
    return memo;
}, new Array());
$(document).ready(function () {
    var canvas = $('#background')[0];
    var ctx = canvas.getContext('2d');
    $('#animate').click(function () {
        Logic.Engine.update(new Geometry.Point(_.random(0, 800), _.random(0, 600)), edges, shapes, Graphics.Animation.animate);
    });
    $('#menu').css('left', windowWidth);
    $('canvas').prop('width', windowWidth);
    $('canvas').prop('height', windowHeight);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, windowWidth, windowHeight);
    ctx.strokeStyle = "rgb(0, 255, 0)";
    _.each(shapes, function (s) { return Graphics.Drawer.draw(s, ctx); });
    canvas = $('#myCanvas')[0];
    ctx = canvas.getContext('2d');
    $(canvas).prop('width', windowWidth);
    $(canvas).prop('height', windowHeight);
    ctx.strokeStyle = "rgb(0, 0, 255)";
    handler({ clientX: windowWidth / 2, clientY: windowHeight / 2 });
    var rotation = 0;
    setInterval(function () {
        Logic.Engine.update(new Geometry.Point(position(windowWidth / 2, windowHeight / 2, 250, rotation)), edges, shapes, draw);
        rotation = rotation < 1 ? rotation + 0.001 : 0;
    }, 10);
});
function draw(data) {
    var canvas = $('#myCanvas')[0];
    var ctx = canvas.getContext('2d');
    Graphics.Drawer.clear(windowWidth, windowHeight, ctx);
    Graphics.Drawer.light(data, ctx);
}
function position(x, y, radius, rotation) {
    return {
        x: x + radius * Math.cos(rotation * 2 * Math.PI),
        y: y + radius * Math.sin(rotation * 2 * Math.PI)
    };
}
;
function handler(event) {
    if (event.clientX >= 40 && event.clientX <= windowWidth - 40 &&
        event.clientY >= 40 && event.clientY <= windowHeight - 40) {
        Logic.Engine.update(new Geometry.Point(event.clientX, event.clientY), edges, shapes, draw);
    }
}
;
