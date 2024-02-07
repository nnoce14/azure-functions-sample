import { output } from "@azure/functions";

export const blobOutput = output.storageBlob({
  path: "http/upload-file/{filePath}",
  connection: "QUEUE_STORAGE_URL",
});
