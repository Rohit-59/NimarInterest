const { ipcRenderer } = require("electron");
const XLSX = require("xlsx");

document.addEventListener("DOMContentLoaded", function () {
  const fileSelector1 = document.querySelector("#file-input1");
  const fileSelector2 = document.querySelector("#file-input2");
  const interestDate = document.querySelector("#date");
  const interestPercent = document.querySelector("#percent");
  const interestDays = document.querySelector("#days");

  interestPercent.addEventListener("change", (e) => {
    console.log(e);
    const percentPath = e.target.value;
    ipcRenderer.send("percent", percentPath);
  });
  interestDate.addEventListener("change", (e) => {
    console.log(e);
    const date = e.target.value;
    ipcRenderer.send("date", date);
  });
  interestDays.addEventListener("change", (e) => {
    console.log(e);
    const daysPath = e.target.value;
    ipcRenderer.send("days", daysPath);
  });


  document.getElementById('reset-button').addEventListener('click', () => {
    ipcRenderer.send('reset-application');
  });

  var forms = document.getElementById('myForm');


  forms.addEventListener('submit', function (event) {
    event.preventDefault();

    // paste here

    //form one data
    if (fileSelector1.files.length > 0) {
      const filePath1 = fileSelector1.files[0].path;
      ipcRenderer.send("file-selected1", filePath1);
      // console.log(filePath1);
    } else {
      console.error("No file selected for file-input2");
      return;
    }

    //input two data
    if (fileSelector2.files.length > 0) {
      const filePath2 = fileSelector2.files[0].path;
      ipcRenderer.send("file-selected2", filePath2);
      // console.log(filePath2);
    } else {
      console.error("No file selected for file-input2");
      return;
    }


    ipcRenderer.send("form-submitted");

    function populateTable(data) {
      const table = document.querySelector("table");
      table.innerHTML = "";

      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      for (const key in data[0]) {

        const th = document.createElement("th");
        th.innerText = key;
        headerRow.appendChild(th);

      }

      thead.appendChild(headerRow);
      table.appendChild(thead);
      const tbody = document.createElement("tbody");
      data.forEach((row) => {

        const tr = document.createElement("tr");
        for (const key in row) {
          if (key == "Challan Date" || key == "Payment Date") {
            console.log(row[key]);
            if (row[key] == 0 || row[key] == '-') {
              row[key] = "N/A";
            } else {
              row[key] = new Date(row[key]).toLocaleDateString('en-IN');
            }
          }
          const td = document.createElement("td");
          td.innerText = row[key];
          tr.appendChild(td);
        }
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
    }

    ipcRenderer.on("dataForExcelObj", (event, data) => {
      populateTable(data);
    });



    // ipcRenderer.on("formateAlertChallanExcel", (event, data) => {
    //   // console.log("1E", event)
    //   const errormsg = document.querySelector(".errormsg");
    //   errormsg.innerHTML = "Error in excel Formate - Refer Right section for details"
    //   //  `"${data}" format is not Correct in Challan excel. Reset the application before using again.`;
    // });



    ipcRenderer.on("formateAlertChallanExcel", (event, data) => {
      const errormsg = document.querySelector(".errormsg");
      const listContainer = document.querySelector(".list-container");
      const rightSectionHead = document.querySelector(".rightSectionHead");
      const paymentList = document.querySelector('.challanError');



      paymentList.style.display = "block";
    
      // Display the error message
      // errormsg.innerHTML = "Error in excel format - Refer to the right section for details";
      errormsg.innerHTML = "<strong>Error in excel Format - Refer Right section for details.<br> Click Reset button before calculating again.<strong>";

    
      // Clear the list container and set the header
      listContainer.innerHTML = "";
      rightSectionHead.innerHTML = "Excel Format Error";
    
      // Clear any existing list items
      paymentList.innerHTML = "";

      const h3 = document.createElement('h3');
      h3.innerText = "Challan Excel";
      paymentList.appendChild(h3);

      // Add each error to the payment list
      data.forEach(attr => {
        const li = document.createElement('li');
        li.innerText = attr;
        paymentList.appendChild(li);
      });
    });



    ipcRenderer.on("formateAlertPaymentExcel", (event, data) => {
      const errormsg = document.querySelector(".errormsg");
      const listContainer = document.querySelector(".list-container");
      const rightSectionHead = document.querySelector(".rightSectionHead");
      const paymentList = document.querySelector('.paymentError');
    

      paymentList.style.display = "block";
      // Display the error message
      // errormsg.innerHTML = "Error in excel format - Refer to the right section for details";
      errormsg.innerHTML = "<strong>Error in excel Format - Refer Right section for details.<br> Click Reset button before calculating again.<strong>";



      // Clear the list container and set the header
      listContainer.innerHTML = "";
      rightSectionHead.innerHTML = "Excel Format Error";
    
      // Clear any existing list items
      paymentList.innerHTML = "";
    
      const h3 = document.createElement('h3');
      h3.innerText = "Payment Excel";
      paymentList.appendChild(h3);
      // Add each error to the payment list
      data.forEach(attr => {
        const li = document.createElement('li');
        li.innerText = attr;
        paymentList.appendChild(li);
      });
    });
    

    ipcRenderer.on("data-error", (event, errorMessage) => {
      console.error(errorMessage);
    });


  })



});