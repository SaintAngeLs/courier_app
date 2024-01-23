
export const saveUserInfo = (userInfo: any) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    console.log("User info in saveuserInfo",  JSON.stringify(userInfo));
};

export const getUserInfo = () => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
};

export const getUserIdFromStorage = () => {
    const userInfo = getUserInfo();
    if (!userInfo || !userInfo.accessToken) {
        return null;
    }

    const tokenParts = userInfo.accessToken.split('.');
    if (tokenParts.length !== 3) {
        return null;
    }

    try {
        const payload = JSON.parse(decodeBase64Url(tokenParts[1]));
        let userId = payload.sub;
        if (!userId) {
            return null;
        }
        userId = formatGuid(userId);
        return userId;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

function formatGuid(userId) {
    if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(userId)) {
        userId = userId.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
    }
    return userId;
}

function decodeBase64Url(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');

    const pad = str.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
        }
        str += new Array(5 - pad).join('=');
    }

    return atob(str);
}

