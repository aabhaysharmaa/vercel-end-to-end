import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { exec } from "child_process";
import { createReadStream, lstatSync, readdirSync, readFileSync } from "fs";

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mime from "mime-types";


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const s3 = new S3Client({
	region: "eu-central-2",
	endpoint: "https://s3.eu-central-2.idrivee2.com",
	credentials: {
		accessKeyId: "Inj6vCqWon69xt5Cf",
		secretAccessKey: "d2YeLwysLs3It6FrENrluh4l7KptNIARwWAA",
	}
})

const generateId = () => {
	const MAX_LENGTH = 6;
	const base64 = "abcdefghijklmnopqrstABCDEFGHIJKLMNOPQRSTUVWXYZ123456789"
	let res = "";
	for (let i = 0; i < MAX_LENGTH; i++) {
		const idx = Math.floor(Math.random() * base64.length)
		res += base64[idx];
	}
	return res;
}

const projectId = generateId();

const publishLogs = (log) => {
	publisher.publish(`logs:${projectId}`, JSON.stringify({ log }))
}

const init = async () => {
	try {
		console.log("Executing server.js")
		publishLogs("Build Started")
		const outDirPath = path.join(__dirname, "output");

		const process = exec(` cd ${outDirPath} &&  npm install && npm run build`);

		process.stdout.on("data", (data) => {
			console.log(data.toString())
			publishLogs(data.toString())
		})
		process.stdout.on("error", (error) => {
			console.log(error.toString())
			publishLogs(`Error : ${error.toString()}`)
		})

		process.on("close", async (code) => {
			if (code !== 0) {
				console.error("Build failed with code:", code);
				return;
			}
			console.log("Build complete. Uploading to S3...");
			publishLogs(`Build complete. Uploading to S3...`)


			const distFolderPath = path.join(__dirname, "output", "dist");
			const distFolderContent = readdirSync(distFolderPath, { recursive: true })

			for (const filePath of distFolderContent) {

				const fullPath = path.join(distFolderPath, filePath)
				if (lstatSync(fullPath).isDirectory()) continue;


				const command = new PutObjectCommand({
					Bucket: "vercel",
					Key: `__outputs/${projectId}/${filePath.replace(/\\/g, "/")}`,
					Body: createReadStream(fullPath),
					ContentType: mime.lookup(fullPath)
				})
				await s3.send(command);
				publishLogs(`File Uploading: ${filePath}`)
			}
			console.log("All files uploaded successfully");
			publishLogs(`All files uploaded successfully`)
		})
	} catch (error) {
		console.log("Error in init : ", error.message)
	}
}

init();