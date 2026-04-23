export async function baixarPDF() {
    const { jsPDF } = window.jspdf;
    // O ID abaixo deve ser a div principal que contém sua tabela de horários
    const grade = document.querySelector("#container-da-grade"); 

    html2canvas(grade, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', 'a4'); // 'l' para Paisagem
        
        const larguraPdf = pdf.internal.pageSize.getWidth();
        const alturaPdf = (canvas.height * larguraPdf) / canvas.width;

        pdf.text("Minha Grade de Horários", 10, 10);
        pdf.addImage(imgData, 'PNG', 0, 15, larguraPdf, alturaPdf);
        pdf.save("Minha_Grade.pdf");
    });
}
