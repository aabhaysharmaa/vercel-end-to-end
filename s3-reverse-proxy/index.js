import express from "express";
const app = express();
import httpProxy from "http-proxy";

const proxy = httpProxy.createProxy();

app.use((req, res) => {
	const hostname = req.hostname;
	console.log("HostName", hostname)

	const subdomain = hostname.split(".")[0]

	console.log("subDomain", subdomain)
	const BASE_PATH = `https://vercel.s3.eu-central-2.idrivee2.com/__outputs`
	const resolvesTo = `${BASE_PATH}/${subdomain}${req.url}`;

	return proxy.web(req, res, { target: resolvesTo, changeOrigin: true, ignorePath: false })
})

proxy.on("proxyReq", (proxyReq, req, res) => {
	const url = req.url;
	if (url === "/") {
		proxyReq.path += "index.html"
	}
	return proxyReq
})

app.listen(8000, () => {
	console.log("Reverse proxy is running... on PORT : 8000")
})

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({ message: err.message || "Internal Server Error" })
})