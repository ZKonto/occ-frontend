const config = {
    BASE_URL_HTTPS: "https://" + import.meta.env.VITE_HOST,
    BASE_URL_HTTP: "http://" + import.meta.env.VITE_HOST,

    BASE_URL_WSS: "wss://" + import.meta.env.VITE_HOST,
    BASE_URL_WS: "ws://" + import.meta.env.VITE_HOST
}

export default config;