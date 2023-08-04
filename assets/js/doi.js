// Definición de la URL del endpoint del repositorio SPARQL (GRAPHDB en este caso)
const endpointUrl = "http://localhost:7200/repositories/articuloScopus";

// Consulta SPARQL que se ejecutará en el repositorio
const query = `
BASE <http://example.com/base/>
PREFIX data: <http://utpl.edu.ec/mj/resource/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX bibo: <http://purl.org/ontology/bibo/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX opus: <http://lsdis.cs.uga.edu/projects/semdis/opus#>
SELECT ?doi ?doiLabel ?doiTitle ?volumen ?fecha WHERE { 
        ?doi dcterms:identifier ?doiLabel;
        dcterms:title ?doiTitle;
         schema:volumeNumber ?volumen;
         opus:year ?fecha.
} LIMIT 100
`;

// Función para ejecutar la consulta SPARQL y construir la tabla con los resultados
// Función para ejecutar la consulta SPARQL y construir las tarjetas con los resultados
function consultaCardArticle() {
    $.ajax({
        url: endpointUrl,
        data: {
            query: query,
            format: "csv"
        },
        success: function (csvData) {
            const cardContainer = $("#cardContainer"); // Obtener el contenedor de las tarjetas
            cardContainer.empty(); // Vaciar el contenido del contenedor antes de agregar nuevas tarjetas

            const rows = csvData.trim().split("\n");
            const headers = rows[0].split(",");

            for (let i = 1; i < rows.length; i++) {
                const currentLine = rows[i].split(",");
                if (currentLine.length === headers.length) {
                    const doiURI = currentLine[0];
                    const card = $("<div class='col-lg-4 col-md-6 col-sm-12'></div>"); // Crear una nueva tarjeta
                    card.append(`<div class='card'>
                                    <img src='images/article.svg' class='card-img-top' alt='...'>
                                    <div class='card-body'>
                                        <h5 class='card-title'>${currentLine[2]}</h5>
                                        <h5 class='card-title'> <i class="fa-solid fa-fingerprint"></i> DOI 
                                            <a  class='text-info' href= 'https://www.doi.org/${currentLine[1]}'> ${currentLine[1]}</a></h5>
                                        <p class='card-text'>Volumen: ${currentLine[3]}</p>
                                        <h5 class='card-title'><i class='fa-solid fa-calendar-days'></i> Año: ${currentLine[4]}</h5>
                                        <div class='text-center'>
                                        <a class='btn btn-warning' title='DOI' href='articleDetail.html'><i class="fa-solid fa-link"></i> Articulo Doi</a>
                                        </div>
                                    </div>
                                </div>`); // Agregar el contenido de la tarjeta

                    cardContainer.append(card); // Agregar la tarjeta al contenedor
                    //paso el DOi a mi articleDetail
                    const doiLink = card.find(".btn-warning"); // Obtener el enlace del botón "Articulo Doi"
                    doiLink.on("click", function() {
                    // Guardar el valor de volumen en localStorage cuando se haga clic en el enlace
                    localStorage.setItem('doiURI', doiURI);
        });
                    
                }
            }
        },
        error: function (error) {
            console.error("Error al ejecutar la consulta:", error);
        }
    });
}

$(document).ready(function () {
    consultaCardArticle();
});



