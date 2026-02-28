export const getModifierKey = (): "⌘" | "Ctrl+" => {
    if (typeof navigator === "undefined")
        return "Ctrl+";

    const uaData = (navigator as any).userAgentData;
    if (uaData?.platform) {
        return uaData.platform === "macOS" ? "⌘" : "Ctrl+";
    }

    if (navigator.userAgent.includes("Mac")) {
        return "⌘";
    }

    return "Ctrl+";
}