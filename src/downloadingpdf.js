import React from "react";
import { Column } from "@ant-design/charts";
import { Button } from "antd";
import "./App.css";
import { jsPDF } from "jspdf";
import  {html2canvas} from "html2canvas";


const Page = () => {
  const data = [
    { year: "1991", value: 20 },
    { year: "1992", value: 40 },
    { year: "1993", value: 35 },
    { year: "1994", value: 50 },
    { year: "1995", value: 49 },
    { year: "1996", value: 61 },
    { year: "1997", value: 72 },
    { year: "1998", value: 93 },
    { year: "1999", value: 83 },
  ];
  const config = {
    data,
    height: 400,
    xField: "year",
    yField: "value",
    point: {
      size: 5,
      shape: "diamond | circule",
    },
    tooltip: {
      formatter: (data) => {
        return {
          name: "",
          value: "",
        };
      },
      customContent: (name, data) =>
        `<div>${data?.map((item) => {
          return `<div class="tooltip-chart" >
              <span class="tooltip-item-name">${item?.name}</span>
              <span class="tooltip-item-value">${item?.value}</span>
            </div>`;
        })}</div>`,
      showMarkers: "",
      showContent: "",
      position: "right | left",
      showCrosshairs: "",
    },
  };
setTimeout(()=>{
 
},2000)

  const converterpdf = () => {
    const pdfsettings = {
      orientation: "1",
      unit: "mm",
      putonlyUsedfonts: true,
      compress: false,
      floatprecision: 16,
    };
    const pdf = new jsPDF(pdfsettings);
    pdf.setFont("times", "bold");
    // pdf.text('year wise sales graph')
    pdf.setDrawColor(255, 0, 0);
    pdf.line(10, 18, 290, 18);
    // console.log("image")
    
    setTimeout(() => {
      const Graph = document.getElementsByClassName("graph")[0];
      console.log(Graph);
    html2canvas(document.getElementsByClassName("graph")[0])
      .then(canvas => 
      console.log(canvas.toDataURL("img/pdf")) 
      )
    }, 3000);
  };
  return (
    <div className="graph">
      <Column {...config} />

      <div>
        <span className="hello">Hello world</span>
      </div>
      <div>
        <Button className="button" onClick={converterpdf}>
          EXPORT PDF
        </Button>
      </div>
    </div>
  );
};
export default Page;
