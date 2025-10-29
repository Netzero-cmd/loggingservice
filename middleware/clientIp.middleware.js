import requestIp from "request-ip";
export const clientIpMiddleware = (req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    req.clientIp =
        clientIp === "::1" || clientIp === "::ffff:127.0.0.1"
            ? "127.0.0.1"
            : clientIp;

    next();
};