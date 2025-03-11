import p5 from 'p5';

const blankSketch = (
    startX: number,
    startY: number,
    innerWidth: number, 
    innerHeight: number,
    promptA: string = "This is a picture frame.",
    promptB: string = "Refresh to redraw."
) => (p: p5) => ({
  
    setup: () => {
        // p.createCanvas(innerWidth, innerHeight)
    },

    draw: () => {
        p.push()
        p.colorMode(p.HSL)
        p.textFont('Courier New')
        p.textSize(12)
        p.textAlign(p.CENTER, p.CENTER)
        p.translate(startX, startY)
        p.fill("antiquewhite")
        p.rect(0, 0, innerWidth, innerHeight)
        p.fill(0) // Set text color to black
        p.text(promptA, innerWidth/2, innerHeight/2)
        p.text(promptB, innerWidth/2, (innerHeight/2)+20)
        p.pop()
    }
});

export default blankSketch;