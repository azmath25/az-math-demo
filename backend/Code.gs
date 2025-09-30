// Apps Script backend placeholder
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === "getProblems") {
    return ContentService.createTextOutput(JSON.stringify([{id:1,title:"Demo",statement:"x^2+y^2=z^2",solution:"Trivial"}]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}