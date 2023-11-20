const primitiveMap = {
    folder: 'Primitive',
    props: [
        {
            key: 'active',
        },
        {
            key: 'visible',
        },
        {
            key: 'on',
        },
        {
            key: 'particleBringToTop',
        },
        {
            key: 'radial',
        },
        {
            key: 'frequency',
            steps: 1,
        },
        {
            key: 'gravityX',
            steps: 1,
        },
        {
            key: 'gravityY',
            steps: 1,
        },
        {
            key: 'maxParticles',
            steps: 1,
        },
        {
            key: 'timeScale',
            steps: 0.01,
        },
    ],
}

const complexMap = {
    folder: 'Complex',
    props: [
        {
            key: 'speedX',
            steps: 1,
        },
        {
            key: 'speedY',
            steps: 1,
        },
        {
            key: 'accelerationX',
            steps: 1,
        },
        {
            key: 'accelerationY',
            steps: 1,
        },
        {
            key: 'maxVelocityX',
            steps: 1,
        },
        {
            key: 'maxVelocityY',
            steps: 1,
        },
        {
            key: 'moveToX',
            steps: 1,
        },
        {
            key: 'moveToY',
            steps: 1,
        },
        {
            key: 'x',
            steps: 1,
        },
        {
            key: 'y',
            steps: 1,
        },
        {
            key: 'angle',
            steps: 1,
        },
        {
            key: 'delay',
            steps: 1,
        },
        {
            key: 'lifespan',
            steps: 1,
        },
        {
            key: 'quantity',
            steps: 1,
        },
        {
            key: 'alpha',
            steps: 0.01,
        },
        {
            key: 'scaleX',
            steps: 0.01,
        },
        {
            key: 'scaleY',
            steps: 0.01,
        },
    ],
}

export { primitiveMap, complexMap }
