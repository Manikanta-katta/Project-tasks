import { EllipsisOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import Meta from "antd/lib/card/Meta";
import TextArea from "antd/lib/input/TextArea";
import { Option } from "antd/lib/mentions";
import axios from "axios";
import React, { useState } from "react";

const Edit = (props) => {
  const {
    projectTitle,
    createdDate,
    projectDescription,
    createdTime,
    // EditrojectModal,
    // EditProjectHandle,
    // setEditprojectModal,
    OPTION_LIST,
    // EditModalButton,
    projectId,
    DeleteModalButton,
    getAllProjects,
    projectType,
  } = props;
  const [projecttype, setprojecttype] = useState(projectType);
  const [EditrojectModal, setEditprojectModal] = useState(false);
  const [editdescriptiontext, setdescriptiontext] =
    useState(projectDescription);
  const [editprojectTitle, seteditprojectTitle] = useState(projectTitle);
  const BASE_URL_SCRIPT_WRITING =
    "https://47yfaf1m1a.execute-api.ap-south-1.amazonaws.com/staging/inscape-scriptWriting-app";
  const UserEmail = "manikanta.katta@peopletech.com";
  // const Token = localStorage.getItem("JWTToken-authorization")
  const Token =
    "eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyTmFtZSI6InB0ZyIsImVtYWlsSWQiOiJtYW5pa2FudGEua2F0dGFAcGVvcGxldGVjaC5jb20iLCJzdWIiOiJpbnNjYXBlIiwianRpIjoiOTkzZjViNTgtOGNiOC00YWRmLWIwYTAtOGVjZGEzYjU2Y2UyIiwiaWF0IjoxNjY5MjY5MTE5LCJleHAiOjE2NjkzNTU1MTl9.bAMlwHxjnoFWpw19iVRMzl046NHoNDyQRDWhhdEZKPn3T0-pLmFnDjZfZFpamOsj6PL5ZY8hb3MmF0bFAw8u_SGIsgRtd5Gkz2Te41GY0igTA7k4EesD94h0hnk3XnaOv7PYfbAw-lphFkm3jKS_1dLZHF2Q3E04WHQ-R1EWCQ50APbIYJ2wnPzb0nsVJY4nQnEJb81b3KIUT5PLmVySGh25mOC9wpIgjyB3S3D8BgBmmbjACpWEztHtce2faEdHDTnmP-oVXXu3hLOPuar_ogxitBgte-Y_gtzJPGonQ3I1TXWJ1U8VEf9q7DfCYzvNjnN5qWPCWUz1rDe6pvAIDw";
  console.log(UserEmail);
  const EditProjectHandle = () => {
    let editProject = [
      {
        service: "projects",
        operation: "updateProjectDetails",
        projectTitle: editprojectTitle,
        projectType: projecttype,
        projectDescription: editdescriptiontext,
        projectId: projectId,
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

    setEditprojectModal(false);
    // seteditprojectTitle("");
    // setdescriptiontext("");
    // setprojecttype("");
    // }
  };
  const EditModalButton = () => {
    setEditprojectModal(true);
  };
  const DropDownMenu = () => {
    return (
      <Menu
        items={[
          {
            label: <p onClick={EditModalButton}>Edit</p>,
            key: "0",
          },
          {
            label: (
              <p
                onClick={() => {
                  DeleteModalButton(projectId, projectTitle);
                }}
              >
                Delete
              </p>
            ),
            key: "1",
          },
        ]}
      />
    );
  };

  return (
    <>
      <Modal
        visible={EditrojectModal}
        onOk={EditProjectHandle}
        onCancel={() => setEditprojectModal(false)}
        destroyOnClose={true}
        style={{ padding: "20" }}
      >
        <Form
          rules={[
            {
              required: projectType ? false : true,
              message: "Select Project Type!",
            },
          ]}
        >
          <Input
            placeholder="Project Title"
            onChange={(e) => seteditprojectTitle(e.target.value)}
            defaultValue={projectTitle}
          ></Input>
          <Select
            name="project"
            onChange={(value) => setprojecttype(value)}
            defaultValue={projectType}
            autoFocus
            size="large"
            style={{
              width: 120,
            }}
          >
            <Option value="" disabled>
              {" "}
              Project Type{" "}
            </Option>
            {OPTION_LIST.map((detail) => {
              return <Option value={detail}>{detail}</Option>;
            })}
          </Select>

          <TextArea
            placeholder="Description"
            onChange={(e) => setdescriptiontext(e.target.value)}
            defaultValue={projectDescription}
          ></TextArea>
        </Form>
      </Modal>
      <Card
        className="project-card"
        title={
          <div>
            <span>{projectType}</span>

            {/* <button onClick={(e) => {DeleteModalButton(projectId, projectTitle)
deleteProject.bind(projectId)}}>delete</button> */}
            <p>{projectTitle}</p>
          </div>
        }
        extra={
          <Dropdown
            overlay={DropDownMenu}
            size="large"
            className="ellipsis-icon"
          >
            <Space style={{ fontSize: "30px", marginTop: 0 }}>
              <EllipsisOutlined />
            </Space>
          </Dropdown>
        }
        actions={[
          <div>
            <Row className="footer-contents">
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <b> Created on </b>
                <p> {createdDate} </p>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <b> Created time </b>
                <p>
                  {createdTime != null
                    ? createdTime.slice(0, createdTime.lastIndexOf(":"))
                    : null}
                </p>
              </Col>
            </Row>

            <Col
              offset={2}
              xs={6}
              sm={6}
              md={6}
              lg={6}
              xl={6}
              className="view-script-button"
            >
              <Button size="large">View Script</Button>
            </Col>
          </div>,
        ]}
      >
        <Meta
          className="project-description"
          description={projectDescription}
        />
      </Card>
    </>
  );
};
export default Edit;
