import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, UploadFile, UploadProps, message } from "antd";
import { FC, useState } from "react";

interface HttpBlobstorageProps {}
export const HttpBlobstorage: FC<HttpBlobstorageProps> = (props) => {
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);

  const customUploadRequest = async (options: any) => {
    const { file, filename } = options;
    const formData = new FormData();
    console.log("filename", filename);

    formData.append("uploadedFile", file);
    try {
      const response = await fetch(`http://localhost:7071/api/http/upload-file/${file.name}`, {
        method: "POST",
        body: formData,
      });

      if (response.status !== 200) {
        message.error("Fail to upload");
        return;
      }
      message.success("File uploaded successfully");
    } catch (err) {
      console.log("err", err);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    onChange: (info) => {
      if (info.file.status === "uploading") {
        console.log("uploading", info.file, info.fileList);
        return
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
        setFileList([]);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file) => {
      console.log("beforeUpload - file", file);
      setFileList([file]);
      return true;
    },
    customRequest: customUploadRequest,
  };

  return (
    <>
      <Upload {...uploadProps} fileList={fileList}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
};
