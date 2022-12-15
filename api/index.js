import { createProxyMiddleware } from "http-proxy-middleware";

const apiProxy = createProxyMiddleware({
  target: process.env.API_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api": "",
  },
});

export default function (req, res) {
  return apiProxy(req, res);
}
