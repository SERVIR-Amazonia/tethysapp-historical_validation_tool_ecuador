function get_date(now){
    const months = [
      "Enero", "Febrero", "Marzo", 
      "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", 
      "Octubre", "Noviembre", "Diciembre"];
    const dayOfMonth = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const formattedDate = `${dayOfMonth} de ${month} de ${year}, ${hours}:${minutes}`;
    return(formattedDate)
}

const now = new Date();
const future = new Date();
future.setDate(now.getDate() + 5)

$("#emision-date").html(get_date(now));
$("#validity-date").html(`Desde ${get_date(now)} hasta ${get_date(future)}`); 




const sleep = ms => new Promise(r => setTimeout(r, ms));
async function convertirAPDF() {
    window.scrollTo({top: 0, behavior: "smooth"});
    await sleep(1000);
    const elemento = document.getElementById('report-container-id').innerHTML;
    const pdfConfig = {
      margin: [26, 20, 26, 20], //top, left, buttom, right,
      filename: 'boletin_hidrologico',
      image: { type: 'png' },
      html2canvas: { 
        scale: 2, 
        useCORS: true  
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'letter', 
        orientation: 'portrait'
      },
      pagebreak: { mode: 'avoid-all', after: ".breakpage", avoid: ".report-body"},
    };
    
    const imgHeader = `${server}/static/${app_name}/images/report_header.png`;
    const imgFooter = `${server}/static/${app_name}/images/report_footer.png`;

    html2pdf().from(elemento).set(pdfConfig).toPdf().get('pdf').then(function (pdf) {
      var totalPages = pdf.internal.getNumberOfPages(); 
      console.log(totalPages)
      hh = pdf.internal.pageSize.getWidth() * 0.1
      for (var i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        // addImage(linkImage, Format, Posicion x, Posicion y, Ancho, Alto)
        pdf.addImage(imgHeader, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), hh); 
        pdf.addImage(imgFooter, 'PNG', 0, pdf.internal.pageSize.getHeight() - hh, pdf.internal.pageSize.getWidth(), hh);
      }
    }).catch((error) => {
      console.error(`onRejected function called: ${error.message}`);
    }).save("boletin_hidrologico.pdf");
  }