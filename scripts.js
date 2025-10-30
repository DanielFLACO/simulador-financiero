window.addEventListener("DOMContentLoaded", () => {
  const botonTema = document.getElementById("toggleTema");
  const cuerpo = document.body;

  //  Cargar preferencia guardada
  if (localStorage.getItem("tema") === "oscuro") {
    cuerpo.classList.add("dark-mode");
  }

  //  Alternar tema al hacer clic
  botonTema.addEventListener("click", () => {
    cuerpo.classList.toggle("dark-mode");
    const temaActual = cuerpo.classList.contains("dark-mode") ? "oscuro" : "claro";
    localStorage.setItem("tema", temaActual);
  });

  //  Variable global para CSV
  let datosCSV = [];

  //  Simulador de ahorro
  document.getElementById("simulador").addEventListener("submit", function (e) {
    e.preventDefault();

    const monto = parseFloat(document.getElementById("monto").value);
    const interes = parseFloat(document.getElementById("interes").value) / 100;
    const años = parseInt(document.getElementById("años").value);

    if (isNaN(monto) || isNaN(interes) || isNaN(años)) {
      alert("Por favor ingresa valores válidos.");
      return;
    }

    let total = 0;
    const datos = [];
    const etiquetas = [];
    datosCSV = []; // Reiniciar datos CSV

    for (let i = 0; i < años * 12; i++) {
      total = (total + monto) * (1 + interes / 12);
      if ((i + 1) % 12 === 0) {
        const año = Math.floor((i + 1) / 12);
        datos.push(total.toFixed(2));
        etiquetas.push(`Año ${año}`);
        datosCSV.push({ año: `Año ${año}`, ahorro: total.toFixed(2) });
      }
    }

    document.getElementById("resultado").innerText =
      `En ${años} años ahorrarías aproximadamente $${total.toFixed(2)} MXN.`;

    const ctx = document.getElementById("graficoAhorro").getContext("2d");

    if (window.miGrafico) {
      window.miGrafico.destroy();
    }

    window.miGrafico = new Chart(ctx, {
      type: "line",
      data: {
        labels: etiquetas,
        datasets: [{
          label: "Ahorro acumulado (MXN)",
          data: datos,
          borderColor: "#28a745",
          backgroundColor: "rgba(40, 167, 69, 0.2)",
          fill: true,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          title: {
            display: true,
            text: "Proyección de ahorro anual"
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });

  //  Exportar como PDF
  document.getElementById("exportarPDF").addEventListener("click", async () => {
    const jsPDF = window.jspdf.jsPDF;
    const area = document.getElementById("exportArea");

    if (!area) {
      alert("No se encontró el área a exportar.");
      return;
    }

    try {
      const canvas = await html2canvas(area, {
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      const yOffset = imgHeight > pdf.internal.pageSize.getHeight()
        ? 10
        : (pdf.internal.pageSize.getHeight() - imgHeight) / 2;

      pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
      pdf.save("simulacion-ahorro.pdf");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un problema al generar el PDF.");
    }
  });

  //  Exportar como CSV
  document.getElementById("exportarCSV").addEventListener("click", () => {
    if (datosCSV.length === 0) {
      alert("Primero realiza una simulación.");
      return;
    }

    let csvContent = "Año,Ahorro acumulado (MXN)\n";
    datosCSV.forEach(row => {
      csvContent += `${row.año},${row.ahorro}\n`;
    });

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "simulacion-ahorro.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});