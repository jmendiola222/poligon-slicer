import { createCanvas, CanvasRenderingContext2D } from 'canvas';
import * as fs from 'fs';
import { Polygon, Line, Point } from './shapes.js';

// Function to plot polygons and lines to a PNG file
export function plotShapes(
    polygons: Polygon[],
    lines: Line[],
    intersections: Point[],
    points: Point[], // New parameter for standalone points
    outputFile: string,
    width = 400,
    height = 400
) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    // Background
    ctx.fillStyle = '#ddd'; // Light gray
    ctx.fillRect(0, 0, width, height);

    // Draw polygons
    polygons.forEach((polygon, index) => {
        ctx.beginPath();
        ctx.fillStyle = `hsl(${index * 60}, 70%, 80%)`; // Colorful polygons
        ctx.strokeStyle = '#000'; // Black outline
        ctx.moveTo(polygon.vertices[0].x, polygon.vertices[0].y);
        for (let i = 1; i < polygon.vertices.length; i++) {
            ctx.lineTo(polygon.vertices[i].x, polygon.vertices[i].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    });

    // Draw lines
    lines.forEach((line) => {
        ctx.beginPath();
        ctx.strokeStyle = '#0000ff'; // Blue lines
        ctx.lineWidth = 2;
        ctx.moveTo(line.p1.x, line.p1.y);
        ctx.lineTo(line.p2.x, line.p2.y);
        ctx.stroke();
    });

    // Draw intersection points (red)
    intersections.forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = '#ff0000'; // Red for intersections
        ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI); // Radius 5
        ctx.fill();
    });

    // Draw standalone points (green)
    points.forEach((point) => {
        ctx.beginPath();
        ctx.fillStyle = '#00ff00'; // Green for standalone points
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI); // Smaller radius 3
        ctx.fill();
    });

    // Save to file
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputFile, buffer);
    console.log(`Generated ${outputFile}`);
}