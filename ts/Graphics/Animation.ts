/// <reference path="../../typings/tsd.d.ts"/>
///<reference path="../Geometry/Line.ts"/>
///<reference path="Drawer.ts"/>
///<reference path="../Logic/Engine.ts"/>

import Data = Logic.Data;
module Graphics{
    export class Animation{
        static animate(data: Data){
            var debugCanvas:HTMLCanvasElement = <HTMLCanvasElement>$('#debugCanvas')[0];
            var debugContext:CanvasRenderingContext2D = debugCanvas.getContext('2d');
            var mainCanvas:HTMLCanvasElement = <HTMLCanvasElement>$('#myCanvas')[0];
            var mainContext:CanvasRenderingContext2D = mainCanvas.getContext('2d');
            var step = 4000;
            Graphics.Drawer.clear(800, 600, mainContext);
            _.each(data.groups, (group:Logic.Group, index) => {
                _.delay(
                    () => {
                        _.delay(
                            () => {
                                debugContext.strokeStyle = 'rgba(255, 255, 0, 0.5)';
                                Graphics.Drawer.segment(group.pair.previous, debugContext);
                            },
                            step*0.1
                        );
                        _.delay(
                            () => {
                                Graphics.Drawer.segment(group.pair.next, debugContext);
                            },
                            step*0.1
                        );
                        _.delay(
                            () => {
                                debugContext.strokeStyle = 'rgba(0, 0, 255, 0.5)';
                                Graphics.Drawer.segment(group.projectedRay, debugContext);
                            },
                            step*0.2
                        );
                        _.delay(
                            () => {
                                debugContext.strokeStyle = 'rgba(0, 0, 255, 0.5)';
                                Graphics.Drawer.segment(group.projectedEdge, debugContext);
                            },
                            step*0.2
                        );
                        _.delay(
                            () => {
                                debugContext.strokeStyle = 'rgb(0, 255, 255)';
                                Graphics.Drawer.segment(group.projectedPair.previous, debugContext);
                            },
                            step*0.1
                        );
                        _.delay(
                            () => {
                                Graphics.Drawer.segment(group.projectedPair.next, debugContext);
                            },
                            step*0.1
                        );
                        _.delay(
                            () => {
                                Graphics.Drawer.clear(800, 600, debugContext);
                                mainContext.fillStyle = "rgba(255, 255, 255, 0.5)";
                                Graphics.Drawer.fillPolygon(
                                    new Polygon(
                                        [group.projectedPair.next.end, group.projectedPair.previous.end, data.source.position]
                                    ),
                                    mainContext
                                )
                            },
                            step*0.5
                        )
                    },
                    (index + 1) * step
                );
            });
            _.delay(
                () => {
                    var vertices = _.reduce(data.groups, (memo, group) => {
                        memo.push(group.projectedPair.previous.end);
                        memo.push(group.projectedPair.next.end);
                        return memo;
                    }, []);
                    vertices = _.uniq(vertices, (v) => v.stringify());
                    Graphics.Drawer.clear(800, 600, mainContext);
                    Graphics.Drawer.fillPolygon(new Polygon(vertices), mainContext);
                },
                step * (data.groups.length+1)
            )
        }
    }
}
