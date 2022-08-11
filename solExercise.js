const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math'); 
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

/**
 * Generative Wall Drawing #2 - Sol Exercise
 *  1. Using a 6x6 grid of evenly spaced points
 *  2. Connect two random points on the grid forming a trapezoid with two parallel
 *     sides extending down
 *  3. Fill the trapezoid with a color, then stroke with the background color
 *  4. Find another two random points and repeatl continuing until all grid points 
 *     are exhausted
 *  5. Layer shapes by the average Y position of their two grid points
 * 
 */

const settings = {
  dimensions: [ 2048, 2048 ]
};

const usedPoints = {};
const trapezoids = [];

const createGrid = () => {
  const points = [];
  const count = 6;
  for (let x = 0; x < count; x++) {
    for (let y = 0; y < count; y++) {
      const u = x / (count - 1)
      const v = y / (count - 1)
      points.push([u,v]);
    }
  }
  return points;
}

let points = createGrid();
// const margin = 10;

const sketch = () => {
  const palette = random.shuffle(random.pick(palettes));
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    console.log(points);
    points.forEach(data => {
      const [u, v] = data;
      // starting from each point check if it has been used
      if (usedPoints[`${u}:${v}`]) {
        // if used, skip
        return;
      } else {
        // if not used, generate trapezoid and fill color, do not draw until all
        //    are "created" to dictate z-order 
        usedPoints[`${u}:${v}`] = true;
        points = points.filter((d) => d !== data);
        const randomPoint = random.pick(points);
        usedPoints[`${randomPoint[0]}:${randomPoint[1]}`] = true;
        points = points.filter((d) => d !== randomPoint);
        const trapezoid = {
          points: [data, randomPoint, [u, 1], [randomPoint[0], 1]],
          color: random.pick(palette)
        };
        trapezoids.push(trapezoid);
      }
    });
    // const t = trapezoids[0];
    // context.beginPath();
    // context.moveTo(...t.points[0]);
    // context.lineTo(...t.points[1]);
    // context.lineTo(...t.points[2]);
    // context.fill();
    trapezoids.forEach(t => {
      // refer to docs https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
      // begin drawing
      console.log(t);
      context.stroke();
      context.beginPath();
      // moveTo first point
      const [u0, v0] = t.points[0];
      context.moveTo(u0 * width, v0 * height);
      // draw line to second
      const [u1, v1] = t.points[1];
      context.lineTo(u1 * width, v1 * height);
      // draw line to third
      const [u2, v2] = t.points[2];
      context.lineTo(u2 * width, v2 * height);
      // close shape
      const [u3, v3] = t.points[3];
      context.lineTo(u3 * width, v3 * height);
      // color the shape
      context.fill();
    });
  }
};

canvasSketch(sketch, settings);
