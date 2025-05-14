export function isUserAgentMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isSmallScreen() {
    return window.matchMedia("(max-width: 768px)").matches;
}

export function isMobile() {
    return isUserAgentMobile() || isSmallScreen();
}
