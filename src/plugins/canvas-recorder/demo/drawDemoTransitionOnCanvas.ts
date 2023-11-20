const drawDemoTransitionOnCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return console.error('Canvas context is null')

    let frameNumber = 0
    const radius = 10
    let x = radius
    let y = radius
    let dx = 5
    let dy = 5
    let color = getRandomColor()

    const loop = () => {
        // random circle
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()

        if (x + dx > canvas.width - radius || x + dx < radius) {
            dx = -dx
            color = getRandomColor()
        }

        if (y + dy > canvas.height - radius || y + dy < radius) {
            dy = -dy
            color = getRandomColor()
        }

        x += dx
        y += dy

        // frame number
        ctx.font = '10px Arial'
        ctx.fillStyle = 'black'
        ctx.fillText(`F${frameNumber++}`, 5, 15)

        // draw border
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(canvas.width, 0)
        ctx.lineTo(canvas.width, canvas.height)
        ctx.lineTo(0, canvas.height)
        ctx.lineTo(0, 0)
        ctx.strokeStyle = 'black'
        ctx.stroke()
        ctx.closePath()

        requestAnimationFrame(loop)
    }

    loop()
}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256)
    const g = Math.floor(Math.random() * 256)
    const b = Math.floor(Math.random() * 256)
    return `rgb(${r}, ${g}, ${b})`
}

export default drawDemoTransitionOnCanvas
