import { Button, Carousel, Form, Input, message, Popconfirm, Space, Steps, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./Signup.css";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
import * as XLSX from "xlsx";
import { useSwiper } from "swiper/react";

import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import Item from "antd/lib/list/Item";
const SignUp = () => {
  const { Step } = Steps;
  const swiper = useSwiper();
  const [fullname, setfullname] = useState("");
  const [email, setEmail] = useState("");
  const [current, setcurrent] = useState("");
  const [password, setpassword] = useState("");
  const [confirmpassword, setconfirmpassword] = useState("");
  const [DoB, setDoB] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setstatus] = useState("");
  const [Exceldata, setExceldata] = useState([]);
  const [editedRow,setEditedRow] = useState(null);
  const [form] = Form.useForm();
  const ref = useRef();
  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;

  const Form1 = () => {
    if (email === "" && fullname === "") {
      message.error(" required  fields");
    } else if (email !== "" && fullname !== "") {
      setcurrent(1);
      ref.current.next();
      message.success("updated");
      swiper.slideNext();
    } else {
      message.error(" required  fields");
    }
  };

  const Form2 = () => {
    if (email === "" && fullname === "") {
      message.error(" required  fields");
    } else if (password === "") {
      message.error("Password field required");
    } else if (!uppercaseRegExp.test(password)) {
      message.error("Password uppercase letter required");
    } else if (!lowercaseRegExp.test(password)) {
      message.error("Password lowre letter required");
    } else if (password !== confirmpassword) {
      message.error("password should be Match");
    } else {
      setcurrent(2);
      ref.current.next();
      message.success("updated");
    }
  };
  const Form3 = () => {
    if (email === "" || fullname === "" || DoB === "" || website === "") {
      message.error(" required  fields");
    } else if (password === "") {
      message.error("Password field required");
    } else if (!uppercaseRegExp.test(password)) {
      message.error("Password uppercase letter required");
    } else if (!lowercaseRegExp.test(password)) {
      message.error("Password lowre letter required");
    } else if (password !== confirmpassword) {
      message.error("password should be Match");
    } else {
      setcurrent(3);

      message.success("Updated");
    }
  };

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/comments")
      .then((response) => setExceldata(response.data));
  }, []);
  // console.log(Exceldata);
const data = Exceldata
console.log(data)
// const RandomId = data.map((Item) => Item.id)
// console.log(RandomId)
  const getfiltereddata = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      return (
        <Input
          autoFocus
          placeholder="Type here ...."
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : []);
          }}
          onPressEnter={() => {
            confirm();
          }}
          onBlur={() => {
            confirm();
          }}
        ></Input>
      );
    },
    filterIcon: () => {
      return <SearchOutlined />;
    },
    onFilter: (value, record) => {
      return record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase());
    },
  });
  

  const Handledit =(record)=>{
     setEditedRow(record.id)
    form.setFieldsValue({
      name:record.name,
      email:record.email,
    })
  }
  const handleDelete = (id) => {
    const newData = Exceldata.filter((name) => name.id !== id);
    setExceldata(newData);
  };
  console.log(editedRow);
  const columns = [
    {
      title: "userId",
      dataIndex: "id",
      key: "id",
      editable: true,
      ...getfiltereddata("id"),
    },
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    
      ...getfiltereddata("name"),
      render:(text,record) =>{
        if(editedRow === record.id) {
          return(
            <Form.Item
            name="name"
            rules={[
              {
              required: true,
              message:"please enter your name"
            }
            ]}>
              <Input/>
            </Form.Item>
          )
        }else{
          return <p>{text}</p>
        }
      }
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      
      ...getfiltereddata("email"),
      render:(text,record) =>{
        if(editedRow === record.id) {
        
          return(
            <Form.Item
            name="email"
            rules={[
              {
              required: true,
              message:"please enter your email"
            }
            ]}>
              <Input/>
            </Form.Item>
          )
        }else{
          return <p>{text}</p>
        }
      }
    },
    {
      title: "body",
      dataIndex: "body",
      key: "body",
     
      ...getfiltereddata("body"),
    },
    {
      title: "Actions",
      render: (_,record) =>  Exceldata.length >= 1 ? (
        <>
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
        <DeleteOutlined />
        </Popconfirm>
        <Button onClick={(id)=>Handledit(record)} >
          <EditOutlined/>
        </Button>
        <Button type="link" htmlType="submit">save</Button>
        
        </>
      ) : null
    },
    
  ];

  console.log(editedRow)
 const onFinish =(values)=>{
  // console.log(values);
 
  const updateddata = [...data]
  updateddata.splice(editedRow,1,{...values,key:editedRow})
  setExceldata(updateddata)
  setEditedRow(null)
 }


  return (
    <>
      <div>
        <div className="Steps">
          <Steps style={{ width: 650 }} current={current}>
            <Step />
            <Step />
            <Step />
          </Steps>
        </div>
       <div >
         <Carousel ref={ref} className="carousel-element">

         
            <Form className="Form1">
              <Form.Item label="Full Name">
                <Input
                  placeholder="Enter username"
                  status={status}
                  onChange={(e) => setfullname(e.target.value)}
                  value={fullname}
                  style={{ width: 250 }}
                ></Input>
              </Form.Item>
              <Form.Item label="Email Id">
                <Input
                  type="email"
                  status={status}
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  style={{ width: 250 }}
                ></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={Form1}>
                  Next
                </Button>
              </Form.Item>
            </Form>
          
         
            <Form className="Form2">
              <Form.Item label="Password">
                <Input.Password
                  onChange={(e) => setpassword(e.target.value)}
                  value={password}
                  placeholder="enter your Password"
                  style={{ width: 250 }}
                ></Input.Password>
              </Form.Item>
              <Form.Item label="Confirm Password">
                <Input.Password
                  onChange={(e) => setconfirmpassword(e.target.value)}
                  value={confirmpassword}
                  placeholder="Confirm password "
                  style={{ width: 250 }}
                ></Input.Password>
              </Form.Item>
              <Form.Item label="gender">
                <Input style={{width:250}}></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={Form2}>
                  Next
                </Button>
                <Button type="primary" onClick={()=>{ref.current.prev()}} style={{marginLeft:50}}>
                  Previous
                </Button>
              </Form.Item>
            </Form>
          
            <Form className="Form3">
              <Form.Item label="Date of Birth">
                <Input
                  placeholder="DoB"
                  style={{ width: 250 }}
                  onChange={(e) => setDoB(e.target.value)}
                  value={DoB}
                ></Input>
              </Form.Item>
              <Form.Item label="Website">
                <Input
                  placeholder=" Website name"
                  onChange={(e) => setWebsite(e.target.value)}
                  value={website}
                  style={{ width: 250 }}
                ></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={(e) => Form3()}>
                  Submit
                </Button>
                <Button type="primary" onClick={()=>{ref.current.prev()}} style={{marginLeft:50}}>
                  Previous
                </Button>
              </Form.Item>
            </Form>
            </Carousel>
            </div>
     
        <div>
          <Form form={form} onFinish={onFinish} >

          <Table dataSource={data} columns={columns} ></Table>
          </Form>
        </div>
      </div>
    </>
  );
};
export default SignUp;
