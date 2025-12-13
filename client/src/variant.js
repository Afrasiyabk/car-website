
export const fadIn = (direction , delay, duration) => {
    return {
        hidden: {
            y : direction === 'up' ? 40 : direction === 'down' ? -50 : 0,
            x : direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
            opacity: 0
        },
        show: {
            x : 0,
            y : 0,
            opacity: 1,
            transition: {
                type: 'tween',
                ease: [0.25, 0.25, 0.25, 0.75],
                duration: duration,
                delay: delay
            }
        }
}
}



export const fatIn = (direction , delay, duration) => {
    return {
        hidden: {
            scale : 0.50,
            opacity: 0
        },
        show: {
            scale : 1,
            opacity: 1,
            transition: {
                type: 'tween',
                ease: [0.25, 0.25, 0.25, 0.75],
                duration: duration,
                delay: delay
            }
        }
}
}
