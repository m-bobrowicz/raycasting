/// <reference path="Line.ts"/>

module Geometry{
    export interface Edgeable{
        edges(): Array<Geometry.LineSegment>;
    }
}
