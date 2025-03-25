
import { Point, Line, Polygon } from './shapes.js';
import { plotShapes } from './plot.js';


// Example usage
function main() {
    // Create some sample shapes
    // const triangle = new Polygon([
    //     new Point(100, 100),
    //     new Point(200, 100),
    //     new Point(150, 200),
    // ]);

    const square = new Polygon([
        new Point(250, 250),
        new Point(300, 250),
        new Point(300, 300),
        new Point(250, 300),
    ]);
    
    const line = new Line(new Point(50, 275), new Point(350, 275));

    // Plot initial shapes
    plotShapes([square], [line], [...square.intersects(line).keys()], [], 'dist/initial.png');
    plotShapes(square.cut(line), [line], [], [], 'dist/out.png');
   
    // Example of cutting (placeholder - won't change output yet)
    // const cutPolygons = triangle.cut(line);
    // if (cutPolygons.length > 0) {
    //     plotShapes(cutPolygons, [line], 'dist/cut_result.png');
    // } else {
    //     console.log('No cut polygons generated yet - implement cut() method');
    // }
}

main();