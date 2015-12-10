module Geometry {
    export class Point {
        private _x:number;
        private _y:number;

        constructor(position:{x:number; y:number;});
        constructor(x:number, y:number);
        constructor(positionOrX:any, y?:number) {
            if(typeof positionOrX === 'number') {
                this._x = Math.round(positionOrX);
                this._y = Math.round(y);
            } else {
                this._x = Math.round(positionOrX.x);
                this._y = Math.round(positionOrX.y);
            }
        }

        get x() {
            return this._x;
        }

        get y() {
            return this._y;
        }

        static distance(a: Point, b: Point): number {
            return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
        }

        stringify():string {
            return String(this.x)+','+String(this.y);
        }
    }
    ;
}
