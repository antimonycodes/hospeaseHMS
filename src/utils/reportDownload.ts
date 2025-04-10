import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import toast from "react-hot-toast";

// Function to download a single date's report as PDF
const downloadDateReportAsPDF = async (dateData: any, patient: any) => {
  const { date, reports, notes } = dateData;

  // Format the date for display and filename
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create a temporary div to render the report content
  const reportElement = document.createElement("div");
  reportElement.className = "report-container";
  reportElement.style.width = "800px";
  reportElement.style.padding = "20px";
  reportElement.style.fontFamily = "Arial, sans-serif";

  // Create the report header
  const header = document.createElement("div");
  header.innerHTML = `
    <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
      Medical Report - ${formattedDate}
    </h1>
    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 18px; margin-bottom: 5px;">Patient: ${patient.first_name} ${patient.last_name}</h2>
      <p style="margin: 0; font-size: 14px;">Patient ID: ${patient.card_id} | Age: ${patient.age} | Gender: ${patient.gender}</p>
      <p style="margin: 0; font-size: 14px;">Phone: ${patient.phone_number}</p>
    </div>
  `;
  reportElement.appendChild(header);

  // Sort all items by time
  const allItems = [...reports, ...notes].sort(
    (a, b) =>
      new Date(b.attributes.created_at).getTime() -
      new Date(a.attributes.created_at).getTime()
  );

  // Create report content
  allItems.forEach((item, index) => {
    const isReport = "case_report_id" in item;
    const staff = item.attributes.staff_details;
    const time = new Date(item.attributes.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemDiv = document.createElement("div");
    itemDiv.style.marginBottom = "20px";
    itemDiv.style.padding = "15px";
    itemDiv.style.borderRadius = "8px";
    itemDiv.style.border = "1px solid #e5e7eb";

    if (isReport) {
      itemDiv.style.backgroundColor = "#f9fafb";
      const department =
        item.attributes.department?.name || "Unknown Department";
      const status = item.attributes.status || "pending";

      itemDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div>
            <p style="font-weight: bold; margin: 0; font-size: 16px;">
              ${staff?.first_name || ""} ${
        staff?.last_name || ""
      } - ${department}
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">${time}</p>
          </div>
          <div>
            <span style="padding: 5px 10px; border-radius: 20px; font-size: 12px; background-color: ${
              status === "completed" ? "#dcfce7" : "#fef9c3"
            }; color: ${
        status === "completed" ? "#166534" : "#854d0e"
      };">${status}</span>
          </div>
        </div>
        <p style="margin: 10px 0; font-size: 15px;">${item.attributes.note}</p>
        ${
          item.attributes.file
            ? `<p style="color: #3b82f6; font-size: 14px;">File attached (view in system)</p>`
            : ""
        }
      `;
    } else {
      itemDiv.style.borderLeft = "4px solid #3b82f6";

      itemDiv.innerHTML = `
        <div>
          <p style="font-weight: bold; margin: 0; font-size: 16px;">
            ${staff?.first_name || ""} ${staff?.last_name || ""} - Doctor's Note
          </p>
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">${time}</p>
        </div>
        <p style="margin: 10px 0; font-size: 15px;">${item.attributes.note}</p>
      `;
    }

    reportElement.appendChild(itemDiv);
  });

  // Add the temporary element to the body (needed for html2canvas to work)
  document.body.appendChild(reportElement);

  try {
    // Use html2canvas to capture the report as an image
    const canvas = await html2canvas(reportElement, {
      scale: 1.5, // Higher scale for better quality
      logging: false,
      useCORS: true,
    });

    // Initialize PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions to fit the PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297; // A4 height in mm

    // Add the image to the PDF
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    // Add more pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const filename = `${patient.first_name}-${patient.last_name}-Medical-Report-${date}.pdf`;
    pdf.save(filename);

    // Clean up
    document.body.removeChild(reportElement);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Clean up
    document.body.removeChild(reportElement);
    return false;
  }
};

// Function to download a single date's report as image
const downloadDateReportAsImage = async (dateData: any, patient: any) => {
  const { date, reports, notes } = dateData;

  // Format the date for display and filename
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Create a temporary div to render the report content (same as PDF function)
  const reportElement = document.createElement("div");
  reportElement.className = "report-container";
  reportElement.style.width = "800px";
  reportElement.style.padding = "20px";
  reportElement.style.backgroundColor = "white";
  reportElement.style.fontFamily = "Arial, sans-serif";

  // Same header and content creation as in the PDF function
  const header = document.createElement("div");
  header.innerHTML = `
    <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
      Medical Report - ${formattedDate}
    </h1>
    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 18px; margin-bottom: 5px;">Patient: ${patient.first_name} ${patient.last_name}</h2>
      <p style="margin: 0; font-size: 14px;">Patient ID: ${patient.card_id} | Age: ${patient.age} | Gender: ${patient.gender}</p>
      <p style="margin: 0; font-size: 14px;">Phone: ${patient.phone_number}</p>
    </div>
  `;
  reportElement.appendChild(header);

  // Sort all items by time
  const allItems = [...reports, ...notes].sort(
    (a, b) =>
      new Date(b.attributes.created_at).getTime() -
      new Date(a.attributes.created_at).getTime()
  );

  // Create report content (same as in PDF function)
  allItems.forEach((item, index) => {
    const isReport = "case_report_id" in item;
    const staff = item.attributes.staff_details;
    const time = new Date(item.attributes.created_at).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemDiv = document.createElement("div");
    itemDiv.style.marginBottom = "20px";
    itemDiv.style.padding = "15px";
    itemDiv.style.borderRadius = "8px";
    itemDiv.style.border = "1px solid #e5e7eb";

    if (isReport) {
      itemDiv.style.backgroundColor = "#f9fafb";
      const department =
        item.attributes.department?.name || "Unknown Department";
      const status = item.attributes.status || "pending";

      itemDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
          <div>
            <p style="font-weight: bold; margin: 0; font-size: 16px;">
              ${staff?.first_name || ""} ${
        staff?.last_name || ""
      } - ${department}
            </p>
            <p style="color: #6b7280; margin: 0; font-size: 14px;">${time}</p>
          </div>
          <div>
            <span style="padding: 5px 10px; border-radius: 20px; font-size: 12px; background-color: ${
              status === "completed" ? "#dcfce7" : "#fef9c3"
            }; color: ${
        status === "completed" ? "#166534" : "#854d0e"
      };">${status}</span>
          </div>
        </div>
        <p style="margin: 10px 0; font-size: 15px;">${item.attributes.note}</p>
        ${
          item.attributes.file
            ? `<p style="color: #3b82f6; font-size: 14px;">File attached (view in system)</p>`
            : ""
        }
      `;
    } else {
      itemDiv.style.borderLeft = "4px solid #3b82f6";

      itemDiv.innerHTML = `
        <div>
          <p style="font-weight: bold; margin: 0; font-size: 16px;">
            ${staff?.first_name || ""} ${staff?.last_name || ""} - Doctor's Note
          </p>
          <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">${time}</p>
        </div>
        <p style="margin: 10px 0; font-size: 15px;">${item.attributes.note}</p>
      `;
    }

    reportElement.appendChild(itemDiv);
  });

  // Add the temporary element to the body
  document.body.appendChild(reportElement);

  try {
    // Use html2canvas to capture the report as an image
    const canvas = await html2canvas(reportElement, {
      scale: 2, // Higher scale for better quality
      logging: false,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    // Convert canvas to image and download
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageData;
    link.download = `${patient.first_name}-${patient.last_name}-Medical-Report-${date}.png`;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    document.body.removeChild(reportElement);

    return true;
  } catch (error) {
    console.error("Error generating image:", error);
    // Clean up
    document.body.removeChild(reportElement);
    return false;
  }
};

// Function to download complete patient record as PDF
const downloadCompletePDF = async (mergedData: any, patient: any) => {
  toast.loading("Generating PDF...", { id: "pdf-download" });

  // Create a temporary div to render the full report
  const reportElement = document.createElement("div");
  reportElement.className = "report-container";
  reportElement.style.width = "800px";
  reportElement.style.padding = "20px";
  reportElement.style.fontFamily = "Arial, sans-serif";

  // Create the report header
  const header = document.createElement("div");
  header.innerHTML = `
    <h1 style="color: #3b82f6; margin-bottom: 10px; font-size: 24px; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
      Complete Medical Report
    </h1>
    <div style="margin-bottom: 20px;">
      <h2 style="font-size: 18px; margin-bottom: 5px;">Patient: ${
        patient.first_name
      } ${patient.last_name}</h2>
      <p style="margin: 0; font-size: 14px;">Patient ID: ${
        patient.card_id
      } | Age: ${patient.age} | Gender: ${patient.gender}</p>
      <p style="margin: 0; font-size: 14px;">Phone: ${patient.phone_number}</p>
      <p style="margin: 0; font-size: 14px;">Generated on: ${new Date().toLocaleDateString()}</p>
    </div>
  `;
  reportElement.appendChild(header);

  // Process each date
  mergedData.forEach((dayData: any) => {
    const { date, reports, notes } = dayData;

    // Format date
    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Create date header
    const dateHeader = document.createElement("div");
    dateHeader.style.marginTop = "30px";
    dateHeader.style.marginBottom = "15px";
    dateHeader.style.padding = "10px";
    dateHeader.style.backgroundColor = "#f3f4f6";
    dateHeader.style.borderRadius = "5px";
    dateHeader.innerHTML = `
      <h2 style="margin: 0; font-size: 18px; color: #4b5563;">${formattedDate}</h2>
    `;
    reportElement.appendChild(dateHeader);

    // Sort all items by time
    const allItems = [...reports, ...notes].sort(
      (a, b) =>
        new Date(b.attributes.created_at).getTime() -
        new Date(a.attributes.created_at).getTime()
    );

    // Add each item for this date
    allItems.forEach((item) => {
      const isReport = "case_report_id" in item;
      const staff = item.attributes.staff_details;
      const time = new Date(item.attributes.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const itemDiv = document.createElement("div");
      itemDiv.style.marginBottom = "20px";
      itemDiv.style.padding = "15px";
      itemDiv.style.borderRadius = "8px";
      itemDiv.style.border = "1px solid #e5e7eb";

      if (isReport) {
        itemDiv.style.backgroundColor = "#f9fafb";
        const department =
          item.attributes.department?.name || "Unknown Department";
        const status = item.attributes.status || "pending";

        itemDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div>
              <p style="font-weight: bold; margin: 0; font-size: 16px;">
                ${staff?.first_name || ""} ${
          staff?.last_name || ""
        } - ${department}
              </p>
              <p style="color: #6b7280; margin: 0; font-size: 14px;">${time}</p>
            </div>
            <div>
              <span style="padding: 5px 10px; border-radius: 20px; font-size: 12px; background-color: ${
                status === "completed" ? "#dcfce7" : "#fef9c3"
              }; color: ${
          status === "completed" ? "#166534" : "#854d0e"
        };">${status}</span>
            </div>
          </div>
          <p style="margin: 10px 0; font-size: 15px;">${
            item.attributes.note
          }</p>
          ${
            item.attributes.file
              ? `<p style="color: #3b82f6; font-size: 14px;">File attached (view in system)</p>`
              : ""
          }
        `;
      } else {
        itemDiv.style.borderLeft = "4px solid #3b82f6";

        itemDiv.innerHTML = `
          <div>
            <p style="font-weight: bold; margin: 0; font-size: 16px;">
              ${staff?.first_name || ""} ${
          staff?.last_name || ""
        } - Doctor's Note
            </p>
            <p style="color: #6b7280; margin: 0 0 10px 0; font-size: 14px;">${time}</p>
          </div>
          <p style="margin: 10px 0; font-size: 15px;">${
            item.attributes.note
          }</p>
        `;
      }

      reportElement.appendChild(itemDiv);
    });
  });

  // Add the temporary element to the body
  document.body.appendChild(reportElement);

  try {
    // Use html2canvas to capture the report as an image
    const canvas = await html2canvas(reportElement, {
      scale: 1.5, // Higher scale for better quality
      logging: false,
      useCORS: true,
    });

    // Initialize PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Calculate dimensions to fit the PDF
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageHeight = 297; // A4 height in mm

    // Add the image to the PDF
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      position,
      imgWidth,
      imgHeight
    );
    heightLeft -= pageHeight;

    // Add more pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(
        canvas.toDataURL("image/png"),
        "PNG",
        0,
        position,
        imgWidth,
        imgHeight
      );
      heightLeft -= pageHeight;
    }

    // Save the PDF
    const filename = `${patient.first_name}-${patient.last_name}-Complete-Medical-Report.pdf`;
    pdf.save(filename);

    // Clean up
    document.body.removeChild(reportElement);

    toast.success("PDF downloaded successfully", { id: "pdf-download" });
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    // Clean up
    document.body.removeChild(reportElement);
    toast.error("Failed to generate PDF", { id: "pdf-download" });
    return false;
  }
};

export {
  downloadDateReportAsPDF,
  downloadDateReportAsImage,
  downloadCompletePDF,
};
