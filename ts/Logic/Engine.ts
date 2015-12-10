/// <reference path="../../typings/tsd.d.ts"/>
/// <reference path="Ray.ts"/>
/**
 * Created by Michal on 2014-10-31.
 */
import Edgeable = Geometry.Edgeable;

module Logic {
    export interface Group {
        ray?: Ray;
        pair?: {previous: Ray; next: Ray};
        projectedRay?: Ray;
        projectedEdge?: LineSegment;
        projectedPair?: {previous: Ray; next: Ray};
    }

    export interface Data {
        source: {position: Point; radius: number};
        edges: LineSegment[];
        shapes: Edgeable[];
        groups: Group[];
    }

    interface RayPair {
        previous: Ray;
        next: Ray;
    }

    export class Engine {

        static size:number = 10;

        static update(sourcePosition:Point,
                      edges:LineSegment[],
                      shapes:Edgeable[],
                      callback:(data:Data) => void) {
            Ray.start = sourcePosition;
            var rays = Logic.Engine.createRays(edges);
            var pairs = Logic.Engine.pairRays(rays);
            var projectedRays = Logic.Engine.projectRays(pairs);
            var projectedEdges = Logic.Engine.projectedEdges(edges, projectedRays);
            var projectedPairs = Logic.Engine.projectPairs(projectedEdges, pairs);
            var groups:Group[] = Logic.Engine.groupData(
                _.zip<any>(rays, pairs, projectedRays, projectedEdges, projectedPairs),
                ['ray', 'pair', 'projectedRay', 'projectedEdge', 'projectedPair']
            );
            var projectedRayGroups:Group[] = Logic.Engine.projectGroupRays(groups);

            return callback({
                source: {
                    position: sourcePosition,
                    radius:   Engine.size
                },
                edges:  edges,
                shapes: shapes,
                groups: groups
            });
        }

        private static createRays(edges:LineSegment[]):Ray[] {
            return <Ray[]>_(edges)
                .map((e) => [new Ray(e.start), new Ray(e.end)])
                .flatten()
                .uniq((r:Ray) => r.stringify)
                .sortBy((r:Ray) => r.angle)
                .value();
        }

        private static pairRays(rays:Ray[]):{previous: Ray; next:Ray}[] {
            var shifted = [];
            shifted.push(_.last(rays));
            _.each(_.initial(rays), (r) => shifted.push(r));
            var pairs = _.zip(shifted, rays);
            return _.map(
                pairs,
                (p) => {
                    return {previous: p[0], next: p[1]}
                }
            );
        }

        private static projectRays(pairs:{previous: Ray; next: Ray}[]):Ray[] {
            return _.map(pairs, (r)=> {
                var projectedAngle = (r.previous.angle + r.next.angle) / 2;
                projectedAngle += Math.abs(r.previous.angle - r.next.angle) > Math.PI ? Math.PI : 0;
                return new Ray(new Point(
                    Ray.start.x + 10000 * Math.cos(projectedAngle),
                    Ray.start.y + 10000 * Math.sin(projectedAngle)
                ));
            });
        }

        private static projectedEdges(edges:LineSegment[], projectedRays:Ray[]):LineSegment[] {
            return <LineSegment[]>_.map(projectedRays, (r) => {
                type InterSectionHelper = {
                    intersection: Geometry.Intersection,
                    distance?: number
                };
                return <LineSegment>_(edges)
                    .map((e) => _.extend(e, {intersection: LineSegment.intersect(r, e)}))
                    .filter((e: InterSectionHelper) => e.intersection.result)
                    .map((e: InterSectionHelper) => _.extend(e, {distance: Point.distance(e.intersection.pos, Ray.start)}))
                    .reject((e: InterSectionHelper) => e.distance === 0)
                    .sortBy('distance')
                    .first();
            });
        }

        private static projectPairs(projectedEdges:LineSegment[], pairs:{previous:Ray; next:Ray}[]):{previous:Ray; next:Ray}[] {
            var groups = _.map(
                _.zip<any>(projectedEdges, pairs),
                (g) => {
                    return {edge: g[0], previous: g[1].previous, next: g[1].next}
                }
            )
            return _.map(groups, (g) => {
                return {
                    previous: new Ray(
                        Geometry.LineSegment.intersect(g.edge, g.previous).pos
                    ),
                    next:     new Ray(
                        Geometry.LineSegment.intersect(g.edge, g.next).pos
                    )
                }
            });
        }


        private static projectGroupRays(groups:Group[]):Group[] {
            return _.map(groups, (group)=> {
                var r = group.pair;
                var projectedAngle = (r.previous.angle + r.next.angle) / 2;
                projectedAngle += Math.abs(r.previous.angle - r.next.angle) > Math.PI ? Math.PI : 0;
                group.projectedRay = new Ray(new Point(
                    Ray.start.x + 10000 * Math.cos(projectedAngle),
                    Ray.start.y + 10000 * Math.sin(projectedAngle)
                ));
                return group;
            });
        }

        private static groupData(arrays, propNames):Group[] {
            var groups:Group[] = _.map(
                arrays,
                (a:Group[]) => {
                    return _.zipObject(
                        propNames,
                        a
                    )
                }
            );
            groups = _.reduce(
                groups,
                (memo:Group[], group:Group) => {
                    if (memo.length === 0 ||
                        group.projectedEdge.stringify !== _.last(memo).projectedEdge.stringify) {
                        memo.push(group);
                    } else if (group.projectedEdge.stringify === _.last(memo).projectedEdge.stringify) {
                        _.last(memo).pair.next = group.pair.next;
                        _.last(memo).projectedPair.next = group.projectedPair.next;
                    }
                    return memo;
                },
                []
            );
            return groups;
        }
    }
}
