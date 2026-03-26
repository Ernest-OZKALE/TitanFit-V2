export const transitions = {
    spring: {
        type: "spring",
        stiffness: 100,
        damping: 15,
    },
    smooth: {
        type: "tween",
        ease: [0.25, 0.1, 0.25, 1], // easeOutSine-ish
        duration: 0.5,
    },
    premium: {
        type: "tween",
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
        duration: 0.8,
    },
};

export const variants = {
    fadeIn: {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
    },
    slideUp: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: transitions.premium,
        },
    },
    slideUpStagger: {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
        },
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: transitions.spring,
        },
    },
    staggerContainer: {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
    },
    textReveal: {
        hidden: { y: "100%", opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { ...transitions.premium, duration: 1 },
        },
    },
};

export const hoverEffects = {
    scaleUp: {
        scale: 1.02,
        transition: { duration: 0.2 },
    },
    glow: {
        boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)",
        borderColor: "rgba(212, 175, 55, 0.6)",
    },
};
