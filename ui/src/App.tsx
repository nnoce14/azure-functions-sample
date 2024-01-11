import { useState } from "react";
import "./App.css";
import { InputNumber, Form, Button, Typography } from "antd";

const FormNamePath = {
  Number1: "inputNumber1",
  Number2: "inputNumber2",
};
interface sampleDataType {
  inputNumber1: number;
  inputNumber2: number;
}

const sampleData: sampleDataType = {
  inputNumber1: 0,
  inputNumber2: 0,
};

function App() {
  const [form] = Form.useForm();
  const [result, setResult] = useState<number>();
  const [counter, setCounter] = useState<number>();

  const onSubmitButtonClick = (values: any) => {
    const number1 = values[FormNamePath.Number1];
    const number2 = values[FormNamePath.Number2];
    console.log("Number 1: ", number1);
    console.log("Number 2: ", number2);
  };

  return (
    <>
      <Form form={form} onFinish={onSubmitButtonClick} initialValues={sampleData} layout="horizontal">
        <Form.Item
          name={FormNamePath.Number1}
          rules={[{ required: true, message: "Please input a number" }]}
          label={"Number 1"}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={FormNamePath.Number2}
          rules={[{ required: true, message: "Please input a number" }]}
          label={"Number 2"}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Typography.Paragraph>Result: {result}</Typography.Paragraph>
      <Typography.Paragraph>Counter: {counter}</Typography.Paragraph>
    </>
  );
}

export default App;
