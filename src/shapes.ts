// Point class
class Point {
  constructor(public x: number, public y: number) {}

  distance(p: Point) {
    return Math.sqrt((p.x - this.x) ** 2 + (p.y - this.y) ** 2);
  }

  eq(p: Point) {
    return p.x == this.x && p.y == this.y;
  }
}

// Line class
class Line {
  constructor(public p1: Point, public p2: Point) {}

  /**
   * Checks if this line intersects with another line and returns the intersection point (if any).
   * @param l The other line to check intersection with.
   * @returns The intersection point (Point) if they intersect, null otherwise.
   */
  public intersect(l: Line): Point | null {
    const x1 = this.p1.x,
      y1 = this.p1.y;
    const x2 = this.p2.x,
      y2 = this.p2.y;
    const x3 = l.p1.x,
      y3 = l.p1.y;
    const x4 = l.p2.x,
      y4 = l.p2.y;

    // Calculate the denominator for the intersection formula
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denom === 0) {
      return null; // Lines are parallel or collinear
    }

    // Calculate the numerators for t and u parameters
    const tNum = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
    const uNum = (x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3);

    // Calculate t and u (parametric values)
    const t = tNum / denom;
    const u = -uNum / denom;

    // Check if intersection occurs within both line segments (0 <= t, u <= 1)
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      // Calculate intersection point
      const intersectX = x1 + t * (x2 - x1);
      const intersectY = y1 + t * (y2 - y1);
      return new Point(intersectX, intersectY);
    }

    return null; // No intersection within the segments
  }
}

// Polygon class
class Polygon {
  constructor(public vertices: Point[]) {
    if (vertices.length < 3) {
      throw new Error("A polygon must have at least 3 vertices");
    }
  }

  public segments(): Line[] {
    const result: Line[] = [];
    for (let i = 0; i < this.vertices.length - 1; i++) {
      result.push(new Line(this.vertices[i], this.vertices[i + 1]));
    }
    result.push(
      new Line(this.vertices[this.vertices.length - 1], this.vertices[0])
    );
    return result;
  }

  public intersects(l: Line): Map<Point, number> {
    const segments = this.segments();
    const result: Map<Point, number> = new Map<Point, number>();
    for (let i = 0; i < this.vertices.length; i++) {
      const p = l.intersect(segments[i]);
      if (p) {
        result.set(p, i);
        console.log("inter", p, i);
      }
    }
    return result;
  }

  /**
   * Cuts the current polygon with the given line and returns a list of resulting polygons.
   * @param l The line to cut the polygon with.
   * @returns List of polygons obtained after the cut.
   */
  public cut(l: Line): Polygon[] {
    const result: Polygon[] = [];
    console.log(
      `Cutting polygon with line from (${l.p1.x},${l.p1.y}) to (${l.p2.x},${l.p2.y})`
    );
    const size = this.vertices.length;
    const segments = this.segments();
    const interToIndex: Map<Point, number> = new Map<Point, number>();
    const indexToInter: Map<number, Point> = new Map<number, Point>();
    for (let i = 0; i < size; i++) {
      const p = l.intersect(segments[i]);
      if (p) {
        interToIndex.set(p, i);
        console.log("inter", p, i, (i+1) % size);
        indexToInter.set(i, p);
        indexToInter.set(i+1 % size, p);
      }
    }
    for (let item of interToIndex) {
        const pol: Point[] = [];
        // first point of the polygon is the intersections
        const interPoint = item[0];
        pol.push(interPoint);
        let pivotIndex = item[1];
        console.log("pivotIndex", pivotIndex);
        let found = false;
        let discard = false
        let isInter = false;
        let next:Point = this.vertices[pivotIndex];
        while(!found && !discard) {
            if(!isInter)
                next = this.vertices[pivotIndex];
            isInter = false;
            const p2 = this.vertices[(((pivotIndex - 1) % size) + size) % size];
            const inter = l.intersect(new Line(next, p2));
            if(inter) {
                //if(inter.eq(interPoint)) {
                    pol.push(next);
                    pol.push(inter);
                    found = true;
                // } else {
                //     next = inter;
                //     isInter = true;
                // }
            } else {
                pol.push(next);
            }
            pivotIndex = (((pivotIndex - 1) % size) + size) % size;
            console.log("pivotIndex", pivotIndex);
        }
        console.log("new Polygon", pol);
        if(found)
          result.push(new Polygon(pol));
    }

    return result;
  }
}

export { Point, Line, Polygon };
