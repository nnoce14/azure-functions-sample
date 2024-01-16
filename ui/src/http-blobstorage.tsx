import { Button, Upload, UploadProps, message } from "antd";
import { FC } from "react";
import { UploadOutlined } from "@ant-design/icons";

interface HttpBlobstorageProps {}
export const HttpBlobstorage: FC<HttpBlobstorageProps> = (props) => {

  const uploadProps: UploadProps = {
    name: "file",
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188", //TODO: upload api
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
};
