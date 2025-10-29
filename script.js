document.getElementById("simulador").addEventListener("submit", function (e) {
  e.preventDefault();
  const monto = parseFloat(document.getElementById("monto").value);
  const interes = parseFloat(document.getElementById("interes").value) / 100;
  const años = parseInt(document.getElementById("años").value);

  let total = 0;
  for (let i = 0; i < años * 12; i++) {
    total = (total + monto) * (1 + interes / 12);
  }

  document.getElementById("resultado").innerText =
    `En ${años} años ahorrarías aproximadamente $${total.toFixed(2)} MXN.`;
});