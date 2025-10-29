document.getElementById("simulador").addEventListener("submit", function (e) {
  e.preventDefault();

  // Obtener valores del formulario
  const monto = parseFloat(document.getElementById("monto").value);
  const interes = parseFloat(document.getElementById("interes").value) / 100;
  const años = parseInt(document.getElementById("años").value);

  // Validación básica
  if (isNaN(monto) || isNaN(interes) || isNaN(años)) {
    alert("Por favor ingresa valores válidos.");
    return;
  }

  // Cálculo del ahorro con interés compuesto
  let total = 0;
  const datos = [];
  const etiquetas = [];

  for (let i = 0; i < años * 12; i++) {
    total = (total + monto) * (1 + interes / 12);
    if ((i + 1) % 12 === 0) {
      datos.push(total.toFixed(2));
      etiquetas.push(`Año ${Math.floor((i + 1) / 12)}`);
    }
  }

  // Mostrar resultado textual
  document.getElementById("resultado").innerText =
    `En ${años} años ahorrarías aproximadamente $${total.toFixed(2)} MXN.`;

  // Mostrar gráfico con Chart.js
  const ctx = document.getElementById("graficoAhorro").getContext("2d");

  // Destruir gráfico anterior si existe
  if (window.miGrafico) {
    window.miGrafico.destroy();
  }

  // Crear nuevo gráfico
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
