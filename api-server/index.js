import express from "express";
const app = express();
// import {  ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";

import Docker from "dockerode";
import Redis from "ioredis";

import { Server } from "socket.io";
app.use(express.json());


const subscriber = new Redis();
const io = new Server({ cors: "*" })

io.on("connection", socket => {
	socket.on("subscriber", channel => {
		socket.join(channel),
			socket.emit("message", `Joined ${channel}`);
	})
})


const docker = new Docker();

io.listen(9001, () => {
	console.log(" Socket Server 9001")
})


// const EcsClient = new ECSClient({
// 	region: "",
// 	credentials: {
// 		accessKeyId: process.env.ACCESS_KEY_ID,
// 		secretAccessKey: process.env.ACCESS_SECRET,
// 	}
// })

// const config = {
// 	Cluster: "Your TASK Cluster",
// 	TASK: "Your TASK URL"
// }
const generateId = () => {
	const MAX_LENGTH = 6;
	const base64 = "abcdefghijklmnopqrstABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

	let res = "";
	for (let i = 0; i < MAX_LENGTH; i++) {
		const idx = Math.floor(Math.random() * base64.length)
		res += base64[idx];
	}
	return res;
}
const projectSlug = generateId();



app.post("/project", async (req, res) => {
	const { gitURL } = req.body;
	if (!gitURL) {
		throw new Error("GitURL is required!")
	}

	const containerName = `project-${projectSlug}`;

	try {
		await docker.pull("vercel-clone");

		// Run command Locally
		const container = await docker.createContainer({
			Image: "vercel-clone",
			name: containerName,
			Cmd: [
				"sh",
				"-c",
				`
             docker build -t vercel-clone $GIT_REPOSITORY_URL &&
             docker run -d -p 8000:8000 vercel-clone
    `,
			],
		})


	} catch (error) {
		console.log("Error in Docker Node : ", error.message)
	}


	// Spin the container
	// const command = new RunTaskCommand({
	// 	cluster: config.Cluster,
	// 	taskDefinition: config.TASK,
	// 	launchType: "FARGATE",
	// 	count: 1,
	// 	networkConfiguration: {
	// 		awsvpcConfiguration: {
	// 			assignPublicIp: "ENABLED",
	// 			subnets: ["", "", ""],
	// 			securityGroups: [""]
	// 		}
	// 	},
	// 	overrides: {
	// 		containerOverrides: [
	// 			{
	// 				name: "",
	// 				environment: [
	// 					{ name: "", value: "" },
	// 					{ name: "", value: "" }
	// 				]
	// 			}
	// 		]
	// 	}
	// })
	// await EcsClient.send(command)
	return res.json({ status: "Queued", data: { projectSlug, url: `http://${projectSlug}.lcoalhost:8000` } })
})

app.listen(9000, () => {
	console.log("API server is running... on PORT : 8000")
})


const initRedisSubscribe = () => {
	console.log("Subscribed to logss...")
	subscriber.psubscribe("logs:*")
	subscriber.on("pmessage", (pattern, channel, message) => {
		io.to(channel).emit("message", message)
	})
}

initRedisSubscribe();

app.use((err, req, res, next) => {
	res.status(err.status || 500).json({ message: err.message || "Internal Server Error" })
})