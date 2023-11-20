const data: IMissionData[] = [
    {
        id: 'pass-levels',
        title: 'PASS_10_LEVELS',
        require: {
            level: 10,
        },
        reward: {
            diamond: 100,
        },
    },
    {
        id: 'collect-diamonds',
        title: 'COLLECT_300_DIAMONDS',
        require: {
            diamond: 300,
        },
        reward: {
            diamond: 100,
        },
    },
    {
        id: 'reach-score',
        title: 'REACH_TOTAL_SCORES',
        require: {
            score: 100000,
        },
        reward: {
            diamond: 200,
        },
    },
]
export default data
