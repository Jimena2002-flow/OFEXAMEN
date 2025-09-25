// Función para actualizar la hora en tiempo real
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Pedir ubicación al usuario
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(success, error);
} else {
  document.getElementById('location').textContent = 'No soportado';
}

function success(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  // Mostrar ubicación aproximada
  document.getElementById('location').textContent = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;

  // Llamar a la API de Open-Meteo
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
    .then(response => response.json())
    .then(data => {
      const weather = data.current_weather;
      document.getElementById('weather').textContent = 
        `${weather.temperature}°C, viento ${weather.windspeed} km/h`;
    })
    .catch(() => {
      document.getElementById('weather').textContent = 'Error al obtener datos';
    });
}

function error() {
  document.getElementById('location').textContent = 'Error al detectar ubicación';
  document.getElementById('weather').textContent = 'No disponible';
}

// ---- API Calidad del Aire (Open-Meteo) ----
window.addEventListener("load", async () => {
  const locations = [
    { name: "pe", lat: -12.0566, lon: -77.1181 }, // Lima
    { name: "es", lat: 43.0502, lon: -2.2009 }   // Beasain
  ];

  for (const loc of locations) {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc.lat}&longitude=${loc.lon}&current=pm10,pm2_5,carbon_monoxide&timezone=auto`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const current = data.current;

      // Insertamos los datos en la tarjeta correspondiente
      document.getElementById(`pm10-${loc.name}`).textContent = current.pm10;
      document.getElementById(`pm25-${loc.name}`).textContent = current.pm2_5;
      document.getElementById(`co-${loc.name}`).textContent = current.carbon_monoxide;
    } catch (err) {
      console.error("Error cargando datos:", err);
    }
  }
});

// Interactividad: menú responsive
const menuToggle = document.getElementById('menu-toggle');
const navList = document.getElementById('nav-list');

menuToggle && menuToggle.addEventListener('click', () => {
    navList.classList.toggle('show');
});

// Cerrar menú al hacer clic en un enlace (opcional)
document.querySelectorAll('#nav-list a').forEach(link => {
    link.addEventListener('click', () => {
    navList.classList.remove('show');
    });
});


// ---- Interactividad: Swiper (carrusel) ----

const images = document.querySelectorAll('.carousel img');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let index = 0;

// Mostrar la imagen según el índice
function showImage(i) {
    images.forEach(img => img.classList.remove('active'));
    images[i].classList.add('active');
}

// Botón anterior
prevBtn.addEventListener('click', () => {
    index = (index - 1 + images.length) % images.length;
    showImage(index);
});

// Botón siguiente
nextBtn.addEventListener('click', () => {
    index = (index + 1) % images.length;
    showImage(index);
});

// 🔹 Funcionalidad automática cada 3 segundos
setInterval(() => {
    index = (index + 1) % images.length;
    showImage(index);
}, 3000); // 3000 ms = 3 segundos



// Función para generar tarjetas desde JSON
function generarProyectos() {
    return fetch('proyectos.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('work-container');

        data.forEach(proyecto => {
            const card = document.createElement('div');
            card.className = `work-card ${proyecto.categoria}`;
            card.innerHTML = `
                <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
                <div class="meta">
                    <h3>${proyecto.titulo}</h3>
                    <p>${proyecto.descripcion}</p>
                    <span class="work-button">Detalles <i class="uil uil-arrow-right"></i></span>
                    <div class="portfolio-item-details" style="display:none">
                        <h3 class="details-title">${proyecto.detalles.titulo}</h3>
                        <p class="details-description">${proyecto.detalles.descripcion}</p>
                        ${proyecto.detalles.imagen ? `<img src="${proyecto.detalles.imagen}" style="width:100%;margin-top:8px;border-radius:6px">` : ''}
                        <ul class="details-info">
                            ${proyecto.detalles.info.map(i => `<li>${i.etiqueta} - <span>${i.valor}</span></li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        return container.querySelectorAll('.work-card');
    });
}

// Función para inicializar filtros
function inicializarFiltros(projects) {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Activar botón
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projects.forEach(proj => {
                if (filter === 'all' || proj.classList.contains(filter.replace('.', ''))) {
                    proj.style.display = 'block';
                } else {
                    proj.style.display = 'none';
                }
            });
        });
    });
}

// Ejecutar todo
generarProyectos().then(projects => {
    inicializarFiltros(projects);
});

// ---- Lista de artículos dinámica ----
const articulos = [
{
    titulo: "¿Qué es la Ingeniería Ambiental?",
    contenido: "La Ingeniería Ambiental es una disciplina que combina conocimientos de ciencias naturales, ingeniería y gestión para enfrentar los problemas relacionados con la contaminación, el uso sostenible de los recursos y la prevención de impactos negativos en los ecosistemas. Desde la teoría, se fundamenta en principios como la química ambiental, la biología, la hidrología y la ingeniería de procesos, con el objetivo de proteger tanto a los seres humanos como a la naturaleza. Su importancia radica en que permite encontrar soluciones técnicas y viables a problemas tan cotidianos como la calidad del aire, el agua, los suelos y la gestión de residuos. En mi vida personal como estudiante, entender esta definición fue un reto. Al inicio de la carrera me preguntaba: ¿cómo encaja la ingeniería en el cuidado del ambiente? Poco a poco, con clases de profesores que mezclaban teoría y casos prácticos, comprendí que no se trata solo de “amar la naturaleza”, sino de diseñar y aplicar soluciones reales, como sistemas de tratamiento de agua, protocolos de seguridad en obras o planes de gestión de residuos sólidos. Recuerdo mis primeros trabajos de campo, cuando aprendimos a medir parámetros básicos del agua y a identificar contaminantes. En ese momento sentí que estaba aplicando lo aprendido en los libros a situaciones tangibles. Lo más valioso ha sido darme cuenta de que la Ingeniería Ambiental es una carrera profundamente humana, pues su fin último es garantizar calidad de vida y un futuro sostenible. Cuando comparto esto con mi familia o amistades, me gusta explicar que no solo estudio “medio ambiente”, sino que me preparo para ser un puente entre la ciencia y la sociedad, aportando soluciones prácticas a problemas que nos afectan a todos."
},
{
    titulo: "Impacto de los Microplásticos",
    contenido: "Los microplásticos son fragmentos de plástico de menos de cinco milímetros que resultan de la degradación de envases, bolsas, fibras textiles y otros productos. Desde el punto de vista teórico, se estudian por su persistencia en los ecosistemas, su capacidad de acumular toxinas y su entrada a las cadenas alimenticias, afectando tanto a animales como a seres humanos. Se encuentran en ríos, mares, suelos e incluso en el aire que respiramos. La preocupación científica es que son casi imposibles de eliminar y tienen efectos aún no completamente conocidos en la salud. Como estudiante, este tema me marcó porque lo relacioné directamente con mi vida cotidiana. Un día, en un laboratorio, analizamos muestras de agua y descubrimos pequeñas fibras plásticas que, a simple vista, no se percibían. Fue impactante darme cuenta de que esas mismas fibras probablemente estaban en el agua que bebemos. También recuerdo discusiones en clase sobre cómo nuestro consumo diario de botellas, envolturas y ropa sintética contribuye a este problema. En mi entorno personal, comencé a ser más consciente: reduje el uso de botellas plásticas, opté por bolsas reutilizables y hasta reflexioné sobre mi ropa, ya que el lavado de fibras sintéticas libera microplásticos. Me di cuenta de que lo aprendido en la universidad no se queda en los exámenes, sino que influye en cada decisión de consumo que tomo. Esa conexión entre teoría y vida personal es lo que más me motiva a seguir estudiando, porque siento que puedo hacer pequeños cambios con un gran impacto."
},
{
    titulo: "Toxicología de Suelos",
    contenido: "La toxicología de suelos se centra en analizar la presencia de contaminantes como metales pesados, hidrocarburos o pesticidas, y su efecto sobre la salud humana, la agricultura y los ecosistemas. Desde la teoría, se utilizan pruebas de laboratorio, modelos matemáticos y estudios de campo para identificar riesgos, evaluar bioacumulación y proponer medidas de remediación. Es un tema esencial porque los suelos sostienen la producción de alimentos y la biodiversidad, y su contaminación puede tardar siglos en recuperarse. Durante mis estudios, este tema me generó una mezcla de curiosidad y preocupación. Recuerdo un curso donde analizamos casos de suelos contaminados en pasivos ambientales mineros, y cómo la mala gestión llevó a comunidades enteras a convivir con metales tóxicos. En una simulación que hicimos con mis compañeros, calculamos la cantidad de plomo en un área de la sierra del Perú, y al ver los datos, comprendí la magnitud de este problema. En mi vida personal, esta experiencia me hizo reflexionar sobre la tierra en la que se siembran los alimentos que consumo. Entendí que no basta con decir que algo “es natural” si el suelo que lo produce está contaminado. Ahora valoro más los estudios de impacto ambiental y las políticas de monitoreo. Esta parte de la carrera me hizo consciente de la relación directa entre ciencia, salud y vida diaria."
},
{
    titulo: "Geografía Ambiental",
    contenido: "La geografía ambiental estudia cómo interactúan el medio físico (clima, relieve, suelos, agua) con las actividades humanas, analizando los impactos que generamos y proponiendo formas de ordenamiento territorial. Teóricamente, combina cartografía, estudios de paisaje, ecología y ciencias sociales, siendo clave para planificar ciudades sostenibles y proteger áreas vulnerables. Como estudiante, recuerdo lo mucho que me costó al inicio entender mapas complejos y capas de información. Pero cuando empecé a relacionar esos mapas con mis propios recorridos en campo, todo cobró sentido. Por ejemplo, en Beasain, donde ahora vivo, he podido observar cómo las montañas, los ríos y la distribución urbana condicionan la vida diaria de las personas. En mi vida personal, la geografía ambiental me enseñó a mirar mi entorno con otros ojos. Ya no veo una carretera como un simple camino, sino como una intervención que altera ecosistemas, cambia el flujo de agua y afecta comunidades. Esta mirada me ayuda a tomar conciencia de cómo el territorio se planifica y cómo debería hacerse con un enfoque más justo y sostenible."
},
{
    titulo: "Matemáticas para la Vida",
    contenido: "Las matemáticas en ciencias ambientales son herramientas fundamentales para modelar procesos, calcular riesgos, interpretar datos de campo y diseñar soluciones. A través de ecuaciones, estadísticas y modelos, los ingenieros pueden comprender fenómenos complejos como la dispersión de contaminantes, el caudal de un río o la proyección de emisiones. En mi carrera, al inicio sentía que las matemáticas eran una barrera. Pero con el tiempo, comprendí que eran la base para poder trabajar de manera seria. Recuerdo un proyecto en el que teníamos que calcular la tasa de degradación de residuos en diferentes condiciones. Gracias a las fórmulas, pudimos predecir tiempos aproximados y proponer alternativas de manejo. En lo personal, las matemáticas me ayudaron a organizarme incluso fuera de la universidad. Aprendí a aplicar conceptos como proporciones o probabilidades en situaciones simples, desde calcular gastos de viaje hasta analizar datos de mi vida cotidiana. Esta materia me enseñó a ver el mundo de manera más lógica y fundamentada."
},
{
    titulo: "Ciencias Ambientales en tiempos de COVID-19",
    contenido: "La pandemia puso en evidencia la relación estrecha entre salud y ambiente. Teóricamente, se analizó cómo la calidad del aire influyó en la propagación del virus, cómo aumentó la generación de residuos hospitalarios y cómo la reducción de movilidad humana dio un respiro temporal a los ecosistemas. Como estudiante, viví esta etapa de manera intensa. Mis clases se trasladaron al formato virtual, y fue ahí cuando aprendí que la investigación ambiental podía continuar incluso a distancia. Analizamos cómo el confinamiento redujo los niveles de dióxido de nitrógeno en ciudades, y fue impresionante ver los gráficos de mejora temporal. En mi vida personal, el COVID-19 me enseñó la importancia de los hábitos de higiene, pero también la necesidad de gestionar adecuadamente los residuos sanitarios, como mascarillas y guantes. Este tema me hizo valorar más la profesión, pues entendí que la salud pública y el ambiente están profundamente conectados."
},
{
    titulo: "Herramientas de Investigación",
    contenido: "Las herramientas de investigación en ciencias ambientales incluyen encuestas, análisis de laboratorio, modelación computacional y observación de campo. Son esenciales para generar datos fiables y construir conclusiones sólidas. En la universidad, aprendí a manejar cuestionarios, a usar programas estadísticos y a procesar información de campo. Una experiencia memorable fue recolectar muestras de agua y luego analizarlas con parámetros físico-químicos. Ese momento me hizo sentir que realmente estaba produciendo conocimiento útil. En mi vida personal, aprendí que investigar no solo es algo académico, sino un hábito cotidiano. Ahora suelo cuestionarme más, observar detalles, buscar evidencias antes de dar por hecho algo. Ese espíritu investigador, que se entrena en la carrera, lo aplico en la vida diaria para tomar decisiones más conscientes."
},
{
    titulo: "Ordenamiento Territorial",
    contenido: "El ordenamiento territorial busca organizar el espacio geográfico para equilibrar desarrollo económico, protección ambiental y bienestar social. Se basa en leyes, políticas y planes que regulan cómo se usan los recursos y el suelo. Durante mis clases, este tema me abrió los ojos sobre la importancia de planificar con justicia social. Analizamos cómo una carretera mal diseñada puede afectar comunidades enteras o cómo una ciudad mal planificada genera contaminación y desigualdad.En lo personal, me hizo reflexionar sobre mi propio entorno. Al caminar por Beasain, noto cómo se organizan los barrios, las zonas verdes y los servicios básicos. Ahora entiendo que nada de eso es casualidad: detrás hay planificación (a veces buena, a veces deficiente). Esto me motiva a querer participar en proyectos donde se pueda mejorar esa organización de forma sostenible."
},
{
    titulo: "Sistemas de Información Geográfica (SIG)",
    contenido: "Los SIG son herramientas tecnológicas que permiten analizar datos espaciales mediante mapas digitales. Teóricamente, se aplican en gestión de recursos naturales, monitoreo de riesgos, planificación urbana y conservación ambiental. En mi formación, aprender SIG fue todo un desafío. Al inicio me parecían programas complejos, pero poco a poco entendí su utilidad. Recuerdo un trabajo donde usamos SIG para mapear áreas con mayor riesgo de deslizamientos, y al ver el resultado, comprendí lo valioso de estas herramientas.En mi vida personal, los SIG me enseñaron a mirar los mapas más allá de lo turístico. Ahora, cuando uso Google Maps o aplicaciones similares, pienso en la cantidad de información ambiental y social que puede estar detrás. Siento que estoy desarrollando una habilidad tecnológica clave para mi futuro profesional."
},
{
    titulo: "Estadística aplicada a la investigación ambiental",
    contenido: "La estadística es esencial para interpretar datos ambientales, identificar patrones de contaminación y respaldar decisiones de gestión sostenible. Permite dar rigor científico a los estudios y comunicar resultados de manera clara. Como estudiante, este tema me generó respeto y esfuerzo. Tuve que aprender a manejar programas, gráficos y fórmulas que al inicio me parecían muy complicados. Pero con práctica, descubrí que la estadística no es un obstáculo, sino una aliada. En lo personal, este aprendizaje me dio confianza. Ahora siento que puedo analizar datos de mi entorno, ya sea para un proyecto académico o para decisiones más simples, como comparar costos o interpretar encuestas. La estadística me enseñó a confiar en los números como base para tomar decisiones más objetivas y responsables."
}
];

const lista = document.getElementById("lista-articulos");
const titulo = document.getElementById("titulo-articulo");
const contenido = document.getElementById("contenido-articulo");

lista.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
    const index = e.target.getAttribute("data-index");
    titulo.textContent = articulos[index].titulo;
    contenido.textContent = articulos[index].contenido;
    }
});

// ---- Portfolio popup: abrir detalles de tarjeta ----
document.addEventListener('click',(e)=>{
    if(e.target.closest('.work-button')){
    const card = e.target.closest('.work-card');
    const details = card.querySelector('.portfolio-item-details').innerHTML;
    const imgSrc = card.querySelector('img').src;
    document.getElementById('pp-content').innerHTML = `\n          <img src="${imgSrc}" alt="">\n          <div style="padding:12px">${details}</div>`;
    document.getElementById('portfolio-popup').classList.add('open');
    }
});
document.getElementById('pp-close').addEventListener('click', ()=>document.getElementById('portfolio-popup').classList.remove('open'));



// ---- Inputs animation helper (if you add forms later) ----
document.querySelectorAll('.input').forEach(inp=>{
    inp.addEventListener('focus',function(){this.parentNode.classList.add('focus')});
    inp.addEventListener('blur',function(){if(!this.value) this.parentNode.classList.remove('focus')});
});


// ---- Pequeña animación al cargar articulo dinamico (si hay contenido) ----
window.addEventListener('load', ()=>{
    const art = document.getElementById('articulo-dinamico');
    setTimeout(()=>{ if(art && art.textContent.trim().length>0) art.classList.add('visible') }, 300);
});

// ---- Mejora accesible: scroll to sections from nav ----
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click', (e)=>{
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
}));

// Modal
const modal = document.getElementById("infoModal");
const btn = document.getElementById("infoBtn");
const span = document.querySelector(".close");

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Inicializar con tu Public Key
emailjs.init("23_malEP4HCSrZCVS");

document.getElementById("contactForm").addEventListener("submit", function(e) {
e.preventDefault();

const name = document.getElementById("name").value;
const email = document.getElementById("email").value;
const message = document.getElementById("message").value;

const serviceID = "service_45lo6zg";
const templateID = "template_h901arq";

const params = {
    from_name: name,
    from_email: email,
    message: message,
};

emailjs.send(serviceID, templateID, params)
    .then(() => {
    document.getElementById("formMessage").textContent = "✅ Mensaje enviado con éxito";
    document.getElementById("contactForm").reset();
    })
    .catch((err) => {
    document.getElementById("formMessage").textContent = "❌ Error al enviar: " + JSON.stringify(err);
    });
});

