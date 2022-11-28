import { Button, Carousel, Form, Input, message, Popconfirm, Space, Steps, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import "./Signup.css";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";

const Crud = () => {
    
  
    const [editedRow,setEditedRow] = useState(null);
    const [form] = Form.useForm();
    const ref = useRef();
   
    const BASE_URL_SCRIPT_WRITING =
    "https://47yfaf1m1a.execute-api.ap-south-1.amazonaws.com/staging/inscape-scriptWriting-app";
    const [getAllSpinner, setgetAllSpinner] = useState(false);
    const [create, setCreate] = useState([]);
    const UserEmail = "manikanta.katta@peopletech.com";
    // const Token = localStorage.getItem("JWTToken-authorization")
    const Token =
      "eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyTmFtZSI6InB0ZyIsImVtYWlsSWQiOiJtYW5pa2FudGEua2F0dGFAcGVvcGxldGVjaC5jb20iLCJzdWIiOiJpbnNjYXBlIiwianRpIjoiOTkzZjViNTgtOGNiOC00YWRmLWIwYTAtOGVjZGEzYjU2Y2UyIiwiaWF0IjoxNjY5MjY5MTE5LCJleHAiOjE2NjkzNTU1MTl9.bAMlwHxjnoFWpw19iVRMzl046NHoNDyQRDWhhdEZKPn3T0-pLmFnDjZfZFpamOsj6PL5ZY8hb3MmF0bFAw8u_SGIsgRtd5Gkz2Te41GY0igTA7k4EesD94h0hnk3XnaOv7PYfbAw-lphFkm3jKS_1dLZHF2Q3E04WHQ-R1EWCQ50APbIYJ2wnPzb0nsVJY4nQnEJb81b3KIUT5PLmVySGh25mOC9wpIgjyB3S3D8BgBmmbjACpWEztHtce2faEdHDTnmP-oVXXu3hLOPuar_ogxitBgte-Y_gtzJPGonQ3I1TXWJ1U8VEf9q7DfCYzvNjnN5qWPCWUz1rDe6pvAIDw";
  
    const getAllProjects = () => {
      setgetAllSpinner(true);
      let UpdatedProject = [
        {
          service: "projects",
          operation: "getAllProjectDetails",
          email: UserEmail,
          authorization: Token,
        },
      ];
      axios.post(BASE_URL_SCRIPT_WRITING, UpdatedProject).then((response) => {
        console.log(response.data);
        let newArrayDataOfOjbect = Object.values(response.data);
        setCreate(newArrayDataOfOjbect);
        setgetAllSpinner(false);
      });
    };

    const deleteProject = (projectId) => {
        const payoadDeleteProject = [
          {
            service: "projects",
            operation: "deleteProjectDetails",
            projectId: projectId,
            authorization: Token,
          },
        ];
        axios
          .post(BASE_URL_SCRIPT_WRITING, payoadDeleteProject)
          .then((response) => {
            getAllProjects();
            message.error("Project Deleted Successfully");
          });
        
      };
    console.log(create)
    const EditProjectHandle = () => {
        let editProject = [
          {
            service: "projects",
            operation: "updateProjectDetails",
            projectTitle: editedRow.projectTitle,
            projectType: editedRow.projecttype,
            // projectDescription: editdescriptiontext,
            projectId: editedRow.projectId,
            // updatedDate: date,
            // updatedTime: time,
            email: UserEmail,
            authorization: Token,
          },
        ];
        // if (EditFormValues.movie) {
        axios
          .post(BASE_URL_SCRIPT_WRITING, editProject)
          .then((response) => {})
          .then(() => {
            getAllProjects();
    
            message.success("Project Edited Successfully");
          });
        }
    
    useEffect(() => {
     
        getAllProjects();
    console.log(create);
    }, []);

  

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
       EditProjectHandle()
      form.setFieldsValue({
        projectTitle:record.projectname,
        email:record.email,
        projectId:record.projectId,
      })
    }

    console.log(editedRow);
    const columns = [
      {
        title: "projectType",
        dataIndex: "projectType",
        key: "projectType",
        editable: true,
        ...getfiltereddata("projectType"),
      },
      {
        title: "projectname",
        dataIndex: "projectTitle",
        
        key: "projectTitle",
      
        ...getfiltereddata("projectTitle"),
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
        title: "Description",
        dataIndex: "projectDescription",
        key: "projectDescription",
       
        ...getfiltereddata("body"),
      },
      {
        title: "Actions",
        render: (_,record) =>  create.length >= 1 ? (
          <>
          <Popconfirm title="Sure to delete?"
            onConfirm={deleteProject}
           >
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
   
    const updateddata = [...create]
    updateddata.splice(editedRow,1,{...values,key:editedRow})
    setCreate(updateddata)
    setEditedRow(null)
   }
  // ------crud operations with table using payload-------
  
  
  
  
  
   
    return (
      <>
       
     
        
          <div>
            <Form form={form} onFinish={onFinish} >
  
  
            <Table dataSource={create} columns={columns} ></Table>
            </Form>
          </div>
        
      </>
    );
  };
  export default Crud;
  