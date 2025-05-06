// === Parte 1: Pesos fijos ===
const pesos = [60, 66, 77, 70, 66, 68, 57, 70, 66, 52, 75, 65, 69, 71, 58, 66, 67, 74, 61, 63,
  69, 80, 59, 66, 70, 67, 78, 75, 64, 71, 81, 62, 64, 69, 68, 72, 83, 56, 65, 74,
  67, 54, 65, 65, 69, 61, 67, 73, 57, 62, 67, 68, 63, 67, 71, 68, 76, 61, 62, 63,
  76, 61, 67, 67, 64, 72, 64, 73, 79, 58, 67, 71, 68, 59, 69, 70, 66, 62, 63, 66];

function analizarPesos() {
const min = 50, max = 90, paso = 10;
const fa = Array((max - min) / paso).fill(0);
pesos.forEach(p => {
let idx = Math.floor((p - min) / paso);
if (idx >= fa.length) idx = fa.length - 1;
fa[idx]++;
});
const total = pesos.length;
const fr = fa.map(f => f / total);
const fp = fr.map(r => r * 100);
const etiquetas = Array.from({ length: fa.length }, (_, i) => `${min + i * paso} - ${min + (i + 1) * paso - 1}`);

const tabla = document.getElementById("frecuenciasPesos");
tabla.innerHTML = "<tr><th>Intervalo</th><th>Fa</th><th>Fr</th><th>Fp (%)</th></tr>";
for (let i = 0; i < fa.length; i++) {
const row = tabla.insertRow();
row.innerHTML = `<td>${etiquetas[i]}</td><td>${fa[i]}</td><td>${fr[i].toFixed(3)}</td><td>${fp[i].toFixed(2)}</td>`;
}

const media = ss.mean(pesos);
const mediana = ss.median(pesos);
const moda = ss.mode(pesos);
const varianza = ss.variance(pesos);
const desviacion = ss.standardDeviation(pesos);
const curtosis = ss.sampleKurtosis(pesos);

const menores65 = pesos.filter(p => p < 65).length;
const entre70y85 = pesos.filter(p => p >= 70 && p < 85).length;

const stats = document.getElementById("estadisticasPesos");
stats.innerHTML = `
<li><strong>Media:</strong> ${media.toFixed(2)} kg</li>
<li><strong>Mediana:</strong> ${mediana.toFixed(2)} kg</li>
<li><strong>Moda:</strong> ${moda.toFixed(2)} kg</li>
<li><strong>Varianza:</strong> ${varianza.toFixed(2)}</li>
<li><strong>Desviación estándar:</strong> ${desviacion.toFixed(2)}</li>
<li><strong>Curtosis:</strong> ${curtosis.toFixed(4)} (Mesocúrtica)</li>
<li><strong>Porcentaje de personas con menos de 65 kg:</strong> ${(menores65 / pesos.length * 100).toFixed(2)}%</li>
<li><strong>Personas entre 70 y 85 kg:</strong> ${entre70y85}</li>
`;

new Chart(document.getElementById("graficoPesos"), {
type: 'bar',
data: {
labels: etiquetas,
datasets: [
{ label: 'Frecuencia', data: fa, backgroundColor: 'rgba(54,162,235,0.6)', borderColor: 'blue', borderWidth: 1 },
{ label: 'Polígono', type: 'line', data: fa, borderColor: 'red', fill: false, tension: 0.4 }
]
},
options: { scales: { y: { beginAtZero: true } } }
});
}

analizarPesos();

// === Parte 2: Excel ===
document.getElementById("inputExcel").addEventListener("change", function(e) {
const reader = new FileReader();
reader.onload = function(e) {
const data = new Uint8Array(e.target.result);
const workbook = XLSX.read(data, { type: 'array' });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const json = XLSX.utils.sheet_to_json(sheet);

const precios = json.map(r => r["Precio Venta"]).filter(p => !isNaN(p));
const tipos = json.map(r => r["Tipo"]);
const ciudades = json.map(r => r["Ciudad"]);

const parte2div = document.getElementById("parte2");
parte2div.innerHTML = "<h3>Estadísticas Parte 2:</h3><ul id='estad2'></ul><canvas id='graf2' height='100'></canvas><table id='freq2'></table><h4>Tabla de Contingencia</h4><table id='cont2'></table>";

const min = Math.min(...precios), max = Math.max(...precios);
const paso = Math.ceil((max - min) / 6);
const fa = Array(6).fill(0);
precios.forEach(p => {
let idx = Math.floor((p - min) / paso);
if (idx >= fa.length) idx = fa.length - 1;
fa[idx]++;
});
const fr = fa.map(f => f / precios.length);
const fp = fr.map(f => f * 100);
const etiquetas = Array.from({ length: 6 }, (_, i) => `${min + i * paso} - ${min + (i + 1) * paso - 1}`);

const tf = document.getElementById("freq2");
tf.innerHTML = "<tr><th>Intervalo</th><th>Fa</th><th>Fr</th><th>Fp (%)</th></tr>";
for (let i = 0; i < 6; i++) {
const row = tf.insertRow();
row.innerHTML = `<td>$${etiquetas[i]}</td><td>${fa[i]}</td><td>${fr[i].toFixed(3)}</td><td>${fp[i].toFixed(2)}%</td>`;
}

const est = document.getElementById("estad2");
const media = ss.mean(precios);
const mediana = ss.median(precios);
const moda = ss.mode(precios);
const varianza = ss.variance(precios);
const desviacion = ss.standardDeviation(precios);
const curtosis = ss.sampleKurtosis(precios);

est.innerHTML = `
<li><strong>Promedio:</strong> $${media.toFixed(2)}</li>
<li><strong>Mediana:</strong> $${mediana.toFixed(2)}</li>
<li><strong>Moda:</strong> $${moda.toFixed(2)}</li>
<li><strong>Varianza:</strong> $${varianza.toFixed(2)}</li>
<li><strong>Desviación estándar:</strong> $${desviacion.toFixed(2)}</li>
<li><strong>Curtosis:</strong> ${curtosis.toFixed(4)}</li>
`;

new Chart(document.getElementById("graf2"), {
type: 'bar',
data: {
labels: etiquetas,
datasets: [
{ label: 'Frecuencia', data: fa, backgroundColor: 'rgba(75,192,192,0.6)', borderColor: 'green', borderWidth: 1 },
{ label: 'Polígono', type: 'line', data: fa, borderColor: 'red', fill: false, tension: 0.4 }
]
},
options: { scales: { y: { beginAtZero: true } } }
});

// === Tabla de contingencia ===
const cont = {};
for (let i = 0; i < tipos.length; i++) {
const tipo = tipos[i], ciudad = ciudades[i];
cont[tipo] = cont[tipo] || {};
cont[tipo][ciudad] = (cont[tipo][ciudad] || 0) + 1;
}
const ctable = document.getElementById("cont2");
const ciudadesU = [...new Set(ciudades)];
let header = "<tr><th>Tipo \\ Ciudad</th>" + ciudadesU.map(c => `<th>${c}</th>`).join("") + "</tr>";
ctable.innerHTML = header;
for (let tipo in cont) {
let row = `<tr><td>${tipo}</td>`;
row += ciudadesU.map(ci => `<td>${cont[tipo][ci] || 0}</td>`).join("");
row += "</tr>";
ctable.innerHTML += row;
}

// === Conclusiones ===
let max1 = 0, max2 = 0, idx1 = 0, idx2 = 0;
fa.forEach((f, i) => {
if (f > max1) {
max2 = max1; idx2 = idx1;
max1 = f; idx1 = i;
} else if (f > max2) {
max2 = f; idx2 = i;
}
});
document.getElementById("rango1").textContent = `$${etiquetas[idx1]}`;
document.getElementById("rango2").textContent = `$${etiquetas[idx2]}`;

const tipoFrecuente = tipos.reduce((acc, val) => {
acc[val] = (acc[val] || 0) + 1;
return acc;
}, {});
const tipoMasFrecuente = Object.keys(tipoFrecuente).reduce((a, b) => tipoFrecuente[a] > tipoFrecuente[b] ? a : b);
document.getElementById("masFrecuente").textContent = tipoMasFrecuente;

let interpretacion = "";
if (curtosis < 0) interpretacion = "platicúrtica (más plana)";
else if (curtosis < 0.5) interpretacion = "mesocúrtica (similar a normal)";
else interpretacion = "leptocúrtica (más puntiaguda)";
document.getElementById("tipoCurtosis").textContent = interpretacion;
};
reader.readAsArrayBuffer(e.target.files[0]);
});
