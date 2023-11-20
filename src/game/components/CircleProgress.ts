interface iCircleProgress {
    id: string
    x: number
    y: number
    radius: number
    bgStrokeWidth: number
    circleStrokeWidth: number
    bgColor: string
    circleColor: string
}

class CircleProgress {
    private props: iCircleProgress

    constructor(props: iCircleProgress) {
        this.props = props

        this.createHtml()

        this.createStyle()
    }

    private createHtml() {
        const { radius, id } = this.props
        const cX = radius + 10
        const cY = radius + 10
        const html = document.createElement('div')

        html.innerHTML = `
            <svg id="${id}">
                <circle class="bg" cx="${cX}" cy="${cY}" r="${radius}"></circle>
                <circle class="progress" cx="${cX}" cy="${cY}" r="${radius}"></circle>
            </svg>
        `

        // Append html to body
        const body = document.getElementsByTagName('body')[0]

        body.appendChild(html)
    }

    private createStyle() {
        const { x, y, radius, bgStrokeWidth, circleStrokeWidth, bgColor, circleColor } = this.props
        const width = (radius + 10) * 2
        const height = (radius + 10) * 2
        const style = `
            #svg-circle-progress {
                width: ${width}px;
                height: ${height}px;
                position: absolute;
                top: ${y - height / 2}px;
                left: ${x - width / 2}px;
                pointer-events: none;
            }

            #svg-circle-progress circle.bg {
                fill: none;
                stroke-width: ${bgStrokeWidth}px;
                // stroke: ${bgColor};
            }

            #svg-circle-progress circle.progress {
                fill: none;
                stroke-width: ${circleStrokeWidth}px;
                stroke: ${circleColor};
                // stroke-linecap: round;
                transform: rotate(-90deg);
                transform-origin: 50% 50%;
                -webkit-animation: big 1.5s ease-in-out;
                animation: big 1.5s ease-in-out;
            }
        `

        // Append style
        const styleTag = document.getElementsByTagName('style')[0]

        styleTag.innerHTML += style
    }

    public setAlpha(alpha = 0) {
        const { id } = this.props
        const svg = document.getElementById(id)

        if (!svg) return

        //@ts-expect-error
        svg.style.opacity = alpha
    }

    public setPercent(percent: number) {
        const { id, radius } = this.props
        const svg = document.getElementById(id)

        if (!svg) return

        const progress = svg?.getElementsByClassName('progress')[0]
        const c = Math.PI * (radius * 2)

        if (percent < 0) {
            percent = 0
        }

        if (percent > 100) {
            percent = 100
        }

        const pct = c - (percent / 100) * c

        //@ts-expect-error
        progress.style.strokeDashoffset = pct
        //@ts-expect-error
        progress.style.strokeDasharray = `${c} ${c}`
    }
}

export default CircleProgress
