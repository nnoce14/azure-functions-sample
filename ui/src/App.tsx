import { useEffect, useRef, useState } from "react";
import "./App.css";
import { InputNumber, Form, Button, Typography } from "antd";
import axios from "axios";

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

function App() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<number>();
  const [counter, setCounter] = useState<number>();

  const timerIdRef = useRef<number | null>(null);

  const [loading, setLoading] = useState(false)

  const pollingCallback = () => {
    // Your polling logic here
    axios.get("http://localhost:7071/api/http/get-data", { params: { userId: 111 } }).then((res) => {
      const isUpdatedFlag = res.data.isDataUpdated;
      if (isUpdatedFlag) {
        stopPolling();
        console.log(res.data);
        setResult(res.data.sum);
        setCounter(res.data.count);
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
      setLoading(false)
    }
  };

  const onSubmitButtonClick = (values: any) => {
    const number1 = values[FormNamePath.Number1];
    const number2 = values[FormNamePath.Number2];
    console.log("Number 1: ", number1);
    console.log("Number 2: ", number2);

    axios.post("http://localhost:7071/api/http/process-numbers", { number1, number2, userId: 111 }).then((response) => {
      setLoading(true)
      console.log("Response: ", response);
      startPolling();
    });
  };

  return (
    <>
      <Form form={form} onFinish={onSubmitButtonClick} initialValues={sampleData} layout="horizontal">
        <Form.Item name={FormNamePath.Number1} rules={[{ required: true, message: "Please input a number" }]} label={"Number 1"}>
          <InputNumber disabled={loading}/>
        </Form.Item>
        <Form.Item name={FormNamePath.Number2} rules={[{ required: true, message: "Please input a number" }]} label={"Number 2"}>
          <InputNumber disabled={loading}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
      {loading && <Typography.Paragraph>Processing...</Typography.Paragraph>}
      <Typography.Paragraph>Result: {result ?? "N/A"}</Typography.Paragraph>
      <Typography.Paragraph>Counter: {counter ?? "N/A"}</Typography.Paragraph>
    </>
  );
}

export default App;
