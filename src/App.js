import logo from "./logo.svg";
import {
  Button,
  Calendar,
  Card,
  DatePicker,
  Input,
  Modal,
  PageHeader,
  Row,
  Space,
  TimePicker,
  Comment,
  Upload,
  Select,
  message,
  Form,
  Col,
  Dropdown,
  Menu,
} from "antd";
// import {Buffer} from 'buffer';
import moment from "moment";
import "antd/dist/antd.css";
import "./App.css";
import axios from "axios";
import { useState, React, useEffect } from "react";
import S3 from "react-aws-s3";
// import {React} from 'react';
import {
  EllipsisOutlined,
  FieldTimeOutlined,
  MessageFilled,
  ReadOutlined,
  ScheduleOutlined,
  SendOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import Meta from "antd/lib/card/Meta";
import Edit from "./Edit";
const App = () => {
  const BASE_URL_SCRIPT_WRITING =
    "https://47yfaf1m1a.execute-api.ap-south-1.amazonaws.com/staging/inscape-scriptWriting-app";
  const BASE_URL_VSB_CONCEPTART =
    "https://tuz2wofy96.execute-api.ap-south-1.amazonaws.com/stage/inscape-visualStoryboardAndConceptArt-app";
  const email = "katta@gmail.com";
  const [date, setdate] = useState("");
  const [time, settime] = useState("");
  const [eventname, seteventname] = useState("");
  const [takentime, settakentime] = useState("");
  const [takendate, settakendate] = useState("");
  const [takenname, settakenname] = useState("");
  const [selecteddate, setSelectedDate] = useState();
  const [commentDisplay, setCommentDisplay] = useState([]);
  // const [Comment, setComment] = useState();
  const handledate = (date, dateString) => {
    console.log(date, dateString);
    console.log(JSON.stringify(moment(date._d).format("MMM Do YY")));
    setdate(JSON.stringify(moment(date._d).format("MMM Do YY")));
  };
  const handletime = (time, timeString) => {
    settime(timeString);
  };
  const dateCellRender = (value) => {
    switch (JSON.stringify(moment(value._d).format("MMM Do YY"))) {
      case takendate:
        return (
          <ul className="events">
            <p> {takentime} </p>
            <p> {takenname} </p>
          </ul>
        );
        break;
      default:
    }
  };
  const Addevent = () => {
    settakendate(date);
    settakenname(eventname);
    settakentime(time);

    console.log(time);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventdetails, seteventdetails] = useState([]);
  const [msg, setmsg] = useState("");
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const clearinput = () => {
    setmsg("");
  };
  const disabledDate = (current) => {
    const now = moment();
    return (
      current &&
      (current < now.subtract(1, "day") || current > now.add(36, "months"))
    );
  };
  const getDisabledHours = () => {
    var hours = [];
    for (let i = 0; i < moment().hours(); i++) {
      hours.push(i);
    }
    return hours;
  };

  // const email = "katta@gmail.com";
  const sendConceptdata = () => {
    if (commentNew === undefined || commentNew === null) {
      const tempevent = eventdetails;
      tempevent.push({ email: email, comment: msg });
      seteventdetails(tempevent);

      const payload = [
        {
          service: "vsbScript",
          operation: "updateConceptArtAndCharacterDetails",
          scriptConceptArtCharacterId: "vsbkc7hriyeju7xesxxrubj9fgyelyrmegl",
          commentDetails: JSON.stringify(eventdetails),
        },
      ];
      axios
        .post(BASE_URL_VSB_CONCEPTART, payload)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => console.log(error.message));

      getConceptdata();
    } else {
      const temp = commentDisplay;
      temp.push({ email: email, comment: msg });
      setCommentDisplay(temp);

      const payload = [
        {
          service: "vsbScript",
          operation: "updateConceptArtAndCharacterDetails",
          scriptConceptArtCharacterId: "vsbkc7hriyeju7xesxxrubj9fgyelyrmegl",
          commentDetails: JSON.stringify(commentDisplay),
        },
      ];
      axios
        .post(BASE_URL_VSB_CONCEPTART, payload)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => console.log(error.message));

      getConceptdata();
    }
    setmsg("");
  };
  const [commentNew, setCommentNew] = useState([]);
  const getConceptdata = () => {
    const payload = [
      {
        service: "vsbScript",
        operation: "getConceptArtAndCharacterDetails",
        scriptConceptArtCharacterId: "vsbkc7hriyeju7xesxxrubj9fgyelyrmegl",
      },
    ];
    axios
      .post(BASE_URL_VSB_CONCEPTART, payload)
      .then((response) => {
        setCommentNew(
          JSON.parse(response.data.commentDetails.replaceAll("\\", ""))
        );
        console.log(response.data);
      })
      .catch((error) => console.log(error.message));
  };

  const suffix = (
    <SendOutlined
      style={{
        fontSize: 16,
        color: "#1890ff",
      }}
      onClick={sendConceptdata}
    />
  );
  // uploading a file into s3 bucket.

  const S3_BUCKET = "conceptartmaterial";
  const REGION = "ap-south-1";
  const ACCESS_KEY = "AKIARNIMKT2N2MQ22A7U";
  const SECRET_ACCESS_KEY = "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";

  const [selectedFile, setSelectedFile] = useState(null);

  const config = {
    bucketName: S3_BUCKET,
    region: REGION,
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  };
  const props = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const ReactS3Client = new S3(config);
    window.Buffer = window.Buffer || require("buffer").Buffer;

    ReactS3Client.uploadFile(selectedFile)
      .then(async (file) => console.log("pdf data", file))
      .catch((err) => console.error(err));
    // console.log("mani")
    // localStorage.setItem(selectedFile);
  };

  // crud operations
  const intialValues = { movie: "", project: "", detail: "" };
  const [createProjectModal, setCreateProjectModal] = useState(false);
  const [CreateprojectTitle, setCreateprojectTitle] = useState("");
  const [selectOption, setselectOption] = useState("");
  const [CreateErrorValidations, setCreateErrorValidations] = useState({});
  const [DescriptionText, setDescriptionText] = useState("");
  const [CreateFormValues, setCreateFormValues] = useState(intialValues);
  const [getAllSpinner, setgetAllSpinner] = useState(false);
  const [create, setCreate] = useState([]);
  // const [EditrojectModal, setEditprojectModal] = useState(false);
  const [EditFormValues, setEditFormValues] = useState(intialValues);
  const [projectId, setProjectId] = useState("");
  const [projectType, setprojecttype] = useState("");
  const [editdescriptiontext, setdescriptiontext] = useState(
    EditFormValues.detail
  );
  const [editprojectTitle, seteditprojectTitle] = useState(
    EditFormValues.movie
  );
  const { Option } = Select;
  const UserEmail = "manikanta.katta@peopletech.com";
  // const Token = localStorage.getItem("JWTToken-authorization")
  const Token =
    "eyJhbGciOiJSUzI1NiJ9.eyJ1c2VyTmFtZSI6InB0ZyIsImVtYWlsSWQiOiJtYW5pa2FudGEua2F0dGFAcGVvcGxldGVjaC5jb20iLCJzdWIiOiJpbnNjYXBlIiwianRpIjoiOTkzZjViNTgtOGNiOC00YWRmLWIwYTAtOGVjZGEzYjU2Y2UyIiwiaWF0IjoxNjY5MjY5MTE5LCJleHAiOjE2NjkzNTU1MTl9.bAMlwHxjnoFWpw19iVRMzl046NHoNDyQRDWhhdEZKPn3T0-pLmFnDjZfZFpamOsj6PL5ZY8hb3MmF0bFAw8u_SGIsgRtd5Gkz2Te41GY0igTA7k4EesD94h0hnk3XnaOv7PYfbAw-lphFkm3jKS_1dLZHF2Q3E04WHQ-R1EWCQ50APbIYJ2wnPzb0nsVJY4nQnEJb81b3KIUT5PLmVySGh25mOC9wpIgjyB3S3D8BgBmmbjACpWEztHtce2faEdHDTnmP-oVXXu3hLOPuar_ogxitBgte-Y_gtzJPGonQ3I1TXWJ1U8VEf9q7DfCYzvNjnN5qWPCWUz1rDe6pvAIDw";
  console.log(UserEmail);
  const OPTION_LIST = ["Webseries", "Movie", "Shortfilm"];
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
  const CreateProjectCancelModal = (e) => {
    CreateFormValues.movie = "";
    CreateFormValues.project = "";
    CreateFormValues.detail = "";
    setCreateProjectModal(false);
  };
  const CreateProjectHandle = () => {
    // setCreateErrorValidations((CreateFormValues));
    let createProject = [
      {
        service: "projects",
        operation: "createProjectDetails",
        projectTitle: CreateprojectTitle,
        projectType: selectOption,
        projectDescription: DescriptionText,
        createdTime: time,
        createdDate: date,
        email: UserEmail,
        authorization: Token,
      },
    ];
    // localStorage.setItem("projectType", selectOption);
    axios.post(BASE_URL_SCRIPT_WRITING, createProject).then((response) => {
      console.log(response);
      CreateFormValues.movie = "";
      CreateFormValues.project = "";
      CreateFormValues.detail = "";
      // localStorage.setItem(response.data.authorization, "JWTToken-authorization")
      message.success("Project Created Successfully");
      getAllProjects();
    });
    CreateProjectCancelModal(true);
    setCreateProjectModal(false);
    ClearValues();
  };
  const ClearValues = () => {
    setCreateFormValues(intialValues);
  };
  console.log(create);
  // Edit project details
  const [deleteModal, setDeleteModal] = useState(false);
  const DeleteModalButton = (id) => {
    setDeleteModal(id);
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
    setDeleteModal(false);
  };
  // const EditModalButton = (info) => {
  //   setEditprojectModal(true);
  //   // setEditFormValues({
  //   //   movie: info.projectTitle,
  //   //   project: info.projectType,
  //   //   detail: info.projectDescription,
  //   //   // authorization: Token,
  //   // });
  // };
  console.log(editprojectTitle);
  console.log(EditFormValues);
  useEffect(() => {
    getAllProjects();
  }, []);
console.log(create)
  return (
    <div>
      <PageHeader>
        <ScheduleOutlined style={{ fontSize: "30px", color: "skyblue" }} />
        <Space direction="horizontal" size={191}>
          <DatePicker
            onChange={handledate}
            defaultValue={moment(new Date(), "YYYY-MM-DD")}
            disabledDate={disabledDate}
          />
          <div>
            <FieldTimeOutlined style={{ fontSize: "30px", color: "skyblue" }} />
            <TimePicker
              onChange={handletime}
              defaultOpenValue={moment("0000:00:00", "HH:mm:ss")}
              use12Hours
              format="h:mm:ss A"
              disabledHours={getDisabledHours}
            />
          </div>
          <Input
            placeholder="Event name"
            onChange={(e) => {
              seteventname(e.target.value);
            }}
            value={eventname}
          />
          <Button type="primary" onClick={Addevent}>
            Add Event
          </Button>
          {/* <input  onChange={ (e) => setSelectedFile(e.target.files[0])} type="file"/>          
        <button onClick={() => handleUpload(selectedFile)} type="primary">Browse File       
        </button> */}
        </Space>
        <Upload {...props}>
          <Button
            onClick={handleUpload}
            type="primary"
            icon={<UploadOutlined />}
          >
            Upload
          </Button>
        </Upload>
      </PageHeader>
      <Calendar className="calendar" dateCellRender={dateCellRender} />
      <Row className="chatbot">
        <Button
          type="link"
          onClick={showModal}
          style={{ screenLeft: 30, borderRadius: 40, width: 40 }}
          className="open-button"
        >
          <MessageFilled type="primary" style={{ fontSize: "30px" }} />
        </Button>
      </Row>
      <Modal
        title="Hellen Hawkins"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={340}
        className="modal"
      >
        <Card
          style={
            {
              // width: 299,
            }
          }
          bodyStyle={{ overflowY: "auto", maxHeight: "calc(55vh - 200px)" }}
          className="card"
        >
          <Row>
            {commentNew &&
              commentNew.map((item) => {
                return (
                  <Row>
                    <Comment
                      className={
                        item.email === "katta@gmail.com"
                          ? "comment-element-orange"
                          : "comment-element-green"
                      }
                      avatar="https://joeschmoe.io/api/v1/random"
                      author={item.email}
                    >
                      {item.comment}
                    </Comment>
                  </Row>
                );
              })}
          </Row>
        </Card>
        <Row>
          <Input
            suffix={suffix}
            style={{ borderRadius: 10 }}
            size="large"
            onChange={(e) => setmsg(e.target.value)}
            value={msg}
            placeholder="Type here ...."
            onKeyPress={(event) => event.key === "Enter" && sendConceptdata()}
          />
        </Row>
      </Modal>
      <div>
        <Button type="primary" onClick={() => setCreateProjectModal(true)}>
          +NewProject
        </Button>
        <Modal
          visible={createProjectModal}
          onOk={CreateProjectHandle}
          onCancel={() => setCreateProjectModal(false)}
          afterClose={ClearValues}
          style={{ padding: "20" }}
        >
          <Form>
            <Input
              placeholder="Project Title"
              onChange={(e) => setCreateprojectTitle(e.target.value)}
              value={CreateprojectTitle}
            ></Input>
            <Select
              name="project"
              onChange={(value) => {
                setselectOption(value);
              }}
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
              onChange={(e) => setDescriptionText(e.target.value)}
              value={DescriptionText}
            ></TextArea>
          </Form>
          {/* <Button onClick={CreateProjectHandle}>submit</Button> */}
        </Modal>     
        {/* Rendering the data from api */}
        <Row>
          {create.map((info) => {
            return (
              <Edit
                projectType={info.projectType}
                projectTitle={info.projectTitle}
                createdDate={info.createdDate}
                createdTime={info.createdTime}
                projectId={info.projectId}
                projectDescription={info.projectDescription}
                // EditrojectModal={EditrojectModal}
                // EditProjectHandle={EditProjectHandle}
                // setEditprojectModal={setEditprojectModal}
                OPTION_LIST={OPTION_LIST}
                // seteditprojectTitle={seteditprojectTitle}
                // setprojecttype={setprojecttype}
                // setdescriptiontext={setdescriptiontext}
                // EditModalButton={EditModalButton}
                DeleteModalButton={DeleteModalButton}
                getAllProjects={getAllProjects}
              />
              //       <Col className="card-alignments">
              //         <Card className='project-card'
              //           title={
              //             <div >
              //               <span>{info.projectType}</span>
              //               <button onClick={(e) => {DeleteModalButton(info.projectId, info.projectTitle)
              // deleteProject.bind(info.projectId)}}>delete</button>
              //               <p>{info.projectTitle}</p>
              //             </div>
              //           }
              //           extra={
              //             <Dropdown overlay={DropDownMenu(info)} size="large" className="ellipsis-icon">
              //               <Space style={{ fontSize: "30px", marginTop: 0 }}>
              //                 <EllipsisOutlined />
              //               </Space>
              //             </Dropdown>
              //           }
              //           actions={[
              //             <div>
              //               <Row className="footer-contents">
              //                 <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              //                   <b > Created on </b>
              //                   <p> {info.createdDate} </p>
              //                 </Col>
              //                 <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              //                   <b> Created time </b>
              //                   <p>
              //                     {info.createdTime != null ? info.createdTime.slice(0, info.createdTime.lastIndexOf(":")) : null}
              //                   </p>
              //                 </Col>
              //               </Row>
              //               <Col offset={2} xs={6} sm={6} md={6} lg={6} xl={6} className="view-script-button">
              //                 <Button size="large">View Script</Button>
              //               </Col>
              //             </div>
              //           ]}
              //         >
              //           <Meta className="project-description" description={info.projectDescription} /></Card>
              //       </Col>
            );
          })}
        </Row>
      </div>

      <Modal
        title="Are you sure you want to Delete this file"
        visible={deleteModal}
        onCancel={(e) => setDeleteModal(false)}
        footer={null}
      >
        <div>
          <Button onClick={(e) => setDeleteModal(false)}>No </Button>
          <Button
            type="Danger"
            onClick={() => {
              deleteProject(deleteModal);
              DeleteModalButton(false);
            }}
          >
            Yes
          </Button>
        </div>
      </Modal>
    </div>
  );
};
export default App;
