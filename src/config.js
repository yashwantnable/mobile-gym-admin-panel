export const user_role = {
    admin: 1,
    trainer: 2,
    customer: 3,
};

// const localUrl = "http://192.168.1.5:5008";
const localUrl = "http://192.168.1.7:5000";
// const localUrl = "http://192.168.1.30:5000";
const liveUrl = "https://outbox.nablean.com";
// const deliveryLocalUrl = "http://192.168.29.30:5001";
// const deliveryLiveUrl = "http://192.168.29.30:5001";

const isLive = true;

export const serverUrl = isLive ? liveUrl : localUrl;
export const server = isLive ? `${liveUrl}/api/v1/` : `${localUrl}/api/v1/`;
// export const deliveryServer = isLive
//     ? `${deliveryLiveUrl}/api/v1/`
//     : `${deliveryLocalUrl}/api/v1/`;
