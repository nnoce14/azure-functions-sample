import { Button, Form, InputNumber, Typography, message } from "antd";
import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";

const FormNamePath = {
  Number1: "number1",
  Number2: "number2",
};
interface sampleDataType {
  number1: number;
  number2: number;
}

const sampleData: sampleDataType = {
  number1: 0,
  number2: 0,
};

interface HttpQueueProps {}
export const HttpQueue: FC<HttpQueueProps> = (props) => {
  const [form] = Form.useForm();
  const [result, setResult] = useState<number>();
  const [counter, setCounter] = useState<number>();

  const timerIdRef = useRef<number | null>(null);

  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:7071/api/http/get-data", { params: { userId: 111 } }).then((res) => {
      const isUpdatedFlag = res.data.isDataUpdated;
      setIsDataUpdated(isUpdatedFlag);
    });
  }, []);

  const pollingCallback = () => {
    // Your polling logic here
    axios.get("http://localhost:7071/api/http/get-data", { params: { userId: 111 } }).then((res) => {
      const isUpdatedFlag = res.data.isDataUpdated;
      if (isUpdatedFlag) {
        stopPolling();
        console.log(res.data);
        setResult(res.data.sum);
        setCounter(res.data.count);
        setIsDataUpdated(true);
        XMLDocument;
      }
    });
  };

  const startPolling = () => {
    // pollingCallback(); // To immediately start fetching data
    // Polling every 30 seconds
    console.log("Polling...");
    axios.get("http://localhost:7071/api/http/get-data", { params: { userId: 111 } });
    timerIdRef.current = setInterval(pollingCallback, 3000);
  };

  const stopPolling = () => {
    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
      setLoading(false);
    }
  };

  const onSubmitButtonClick = (values: any) => {
    const number1 = values[FormNamePath.Number1];
    const number2 = values[FormNamePath.Number2];
    console.log("Number 1: ", number1);
    console.log("Number 2: ", number2);

    axios.post("http://localhost:7071/api/http/process-numbers", { number1, number2, userId: 111 }).then((response) => {
      setLoading(true);
      console.log("Response: ", response);
      startPolling();
    });
  };

  const onResetDataClicked = () => {
    // call api to reset the flag
    axios.post("http://localhost:7071/api/http/reset-data", { userId: 111 }).then((response) => {
      console.log("Response: ", response);
      if (response.status === 200) {
        setIsDataUpdated(false);
        setResult(undefined);
        setCounter(undefined);
      } else {
        message.error("Failed to reset data");
      }
    });
  };
  return (
    <div style={{ width: "100%" }}>
      <Form form={form} onFinish={onSubmitButtonClick} initialValues={sampleData} layout="horizontal">
        <Form.Item name={FormNamePath.Number1} rules={[{ required: true, message: "Please input a number" }]} label={"Number 1"}>
          <InputNumber disabled={loading || isDataUpdated} />
        </Form.Item>
        <Form.Item name={FormNamePath.Number2} rules={[{ required: true, message: "Please input a number" }]} label={"Number 2"}>
          <InputNumber disabled={loading || isDataUpdated} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading || isDataUpdated} loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Typography.Paragraph>Result: {result ?? "N/A"}</Typography.Paragraph>
      <Typography.Paragraph>Counter: {counter ?? "N/A"}</Typography.Paragraph>

      <Button onClick={onResetDataClicked}>Reset Data</Button>
    </div>
  );
};
