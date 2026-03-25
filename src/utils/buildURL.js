
export const buildUrl = (req, page, limit) => {
    return `${req.protocol}://${req.get("host")}${req.baseUrl}?page=${page}&limit=${limit}`;
};
