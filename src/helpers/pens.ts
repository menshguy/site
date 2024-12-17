import p5 from "p5";

function line_broken(
  p: p5,
  xStart: number,
  yStart: number,
  xEnd: number,
) {
  let x = xStart;
  const y = yStart;

  while (x < xEnd) {
    const tickBump = p.random(-1, 0);
    const tickType = p.random() > 0.25 ? p.random(["long"]) : p.random(["space", "short"]);
    let tickLength = getTickLength(tickType);

    if (tickType !== "space") {
      drawTick(x, y, tickLength, tickBump);
    }

    x += tickLength;
  }

  function getTickLength(type: string): number {
    switch (type) {
      case "long":
        return p.random(10, 25);
      case "short":
        return p.random(3, 10);
      case "space":
        return p.random(5, 25);
      default:
        console.error("no such line type");
        return 0;
    }
  }

  function drawTick(x: number, y: number, length: number, bump: number) {
    p.beginShape();
    p.vertex(x, y, 0);
    const cx1 = x + length / 2;
    const cy1 = y + bump;
    const cx2 = x + length;
    const cy2 = y;
    p.bezierVertex(x, y, cx1, cy1, cx2, cy2);
    p.endShape();
  }
}

function line_broken_2(
  p: p5,
  xStart: number,
  yStart: number,
  xEnd: number,
) {
  let x = xStart;
  const y = yStart;

  while (x < xEnd) {
    const tickBump = p.random(-4, 0);
    const tickType = p.random(["long", "short", "long", "short", "space"]);
    let tickLength = getTickLength(tickType);

    if (tickType !== "space") {
      drawTick(x, y, tickLength, tickBump);
    }

    x += tickLength;
  }

  function getTickLength(type: string): number {
    switch (type) {
      case "long":
        return p.random(10, 25);
      case "short":
        return p.random(3, 10);
      case "space":
        return p.random(5, 25);
      default:
        console.error("no such line type");
        return 0;
    }
  }

  function drawTick(x: number, y: number, length: number, bump: number) {
    p.beginShape();
    p.vertex(x, y, 0);
    const cx1 = x + length / 2;
    const cy1 = y + bump;
    const cx2 = x + length;
    const cy2 = y;
    p.bezierVertex(x, y, cx1, cy1, cx2, cy2);
    p.endShape();
  }
}

export { line_broken, line_broken_2 };