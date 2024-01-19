// import * as df from 'durable-functions';

// Idea - take all items in blob storage, collect their metadata into an object, and download / write to console as json

// Start off using this as a reference: https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-cloud-backup?tabs=javascript
// Get it working, then tweak to better integrate w/ ui
const df = require("durable-functions");
const path = require("path");
const getFileListActivityName = "getFileList";
const copyFileToBlobActivityName = "copyFileToBlob";
const fs = require("fs/promises");
const readdirp = require("readdirp");

import { output } from "@azure/functions";

const blobOutput = output.storageBlob({
  path: "backups/{backupPath}",
  connection: "QUEUE_STORAGE_URL",
});

df.app.client.http("startBackup", {
  route: "orchestrators/{orchestratorName}",
  handler: async (request, client, context) => {
    const body = await request.json();
    const instanceId = await client.startNew(request.params.orchestratorName, {
      input: body,
    });

    context.log(`Started orchestration with ID = '${instanceId}'.`);

    return client.createCheckStatusResponse(request, instanceId);
  },
});

df.app.orchestration("backupSiteContent", function* (context) {
  const rootDir = context.df.getInput();
  if (!rootDir) {
    throw new Error("A directory path is required as an input.");
  }

  const rootDirAbs = path.resolve(rootDir);
  const files = yield context.df.callActivity(
    getFileListActivityName,
    rootDirAbs
  );

  // Backup Files and save Tasks into array
  const tasks = [];
  for (const file of files) {
    const input = {
      backupPath: path.relative(rootDirAbs, file).replace("\\", "/"),
      filePath: file,
    };
    tasks.push(context.df.callActivity(copyFileToBlobActivityName, input));
  }

  // wait for all the Backup Files Activities to complete, sum total bytes
  const results = yield context.df.Task.all(tasks);
  const totalBytes = results
    ? results.reduce((prev, curr) => prev + curr, 0)
    : 0;

  // return results;
  return totalBytes;
});

df.app.activity(copyFileToBlobActivityName, {
  extraOutputs: [blobOutput],
  handler: async function ({ backupPath, filePath }, context) {
    const outputLocation = `backups/${backupPath}`;
    const stats = await fs.stat(filePath);
    context.log(
      `Copying '${filePath}' to '${outputLocation}'. Total bytes = ${stats.size}.`
    );

    const fileContents = await fs.readFile(filePath);

    context.extraOutputs.set(blobOutput, fileContents);

    return stats.size;
  },
});

df.app.activity(getFileListActivityName, {
  handler: async function (rootDirectory, context) {
    context.log(`Searching for files under '${rootDirectory}'...`);

    const allFilePaths = [];
    for await (const entry of readdirp(rootDirectory, { type: "files" })) {
      allFilePaths.push(entry.fullPath);
    }
    context.log(`Found ${allFilePaths.length} under ${rootDirectory}.`);
    return allFilePaths;
  },
});
