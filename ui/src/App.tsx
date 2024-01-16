import { Divider, Typography } from "antd";
import "./App.css";
import { HttpQueue } from "./http-queue";
import { HttpBlobstorage } from "./http-blobstorage";

function App() {
  return (
    <>
      <Typography.Title level={3}>Azure Functions v4 Sample App</Typography.Title>
      <Divider orientation="center">HTTP-Queue</Divider>
      <HttpQueue />
      <Divider orientation="center">HTTP-Blobstorage</Divider>
      <HttpBlobstorage />
    </>
  );
}

export default App;
