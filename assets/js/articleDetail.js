$(document).ready(function () {
    // Recuperar el valor de doiURI del localStorage
    const doiURI = localStorage.getItem('doiURI');
    console.log('doiURI recuperado:', doiURI);

    // Definición de la URL del endpoint del repositorio SPARQL y consulta SPARQL
    const endpointUrl = "http://localhost:7200/repositories/articuloScopus";
    const query = `
    BASE <http://example.com/base/>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX bibo: <http://purl.org/ontology/bibo/>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX schema: <http://schema.org/>
    PREFIX opus: <http://lsdis.cs.uga.edu/projects/semdis/opus#>
    PREFIX data:<http:utpl.edu.ec/mj/resource/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX dc: <http://purl.org/dc/elements/1.1/subject>
    PREFIX vivo: <http://vivoweb.org/ontology/core#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT ?doiLabel ?title ?abstract ?fecha ?volumen ?basedata ?name ?authorship ?id ?authorname WHERE {
            <${doiURI}> dcterms:identifier ?doiLabel;
                        dcterms:title ?title;
                        schema:abstract ?abstract;
                        opus:year ?fecha;
                        schema:volumeNumber ?volumen;
                        dcterms:isPartOf ?basedata.
            ?basedata rdfs:label ?name.
            <${doiURI}> vivo:relatedBy ?authorship.
                ?authorship vivo:relates ?id.
                ?id foaf:name ?authorname.
        }`;

    // Función para ejecutar la consulta SPARQL y mostrar los datos en el HTML
    // Función para ejecutar la consulta SPARQL y mostrar los datos en el HTML
function consultaArticleDetail() {
    $.ajax({
        url: endpointUrl,
        data: {
            query: query,
            format: "csv"
        },
        success: function (csvData) {
            console.log(csvData)
            // Parsear el contenido CSV utilizando Papaparse
            const parsedData = Papa.parse(csvData.trim(), { header: true });
            const currentLine = parsedData.data[0];

            // Mostrar el valor del abstract en el elemento con ID "abstract"
            $("#articleTitle").text(currentLine.title);
            $("#doiLabel").text("DOI: " + currentLine.doiLabel);
            $("#abstract").text(currentLine.abstract);
            $("#fecha").text("Fecha: " + currentLine.fecha);
            $("#volumen").text("Volumen: " + currentLine.volumen);
            $("#name").text( currentLine.name);
             // Mostrar los datos de la autoría en una lista desordenada
             for (let i = 0; i < parsedData.data.length; i++) {
                const currentRecord = parsedData.data[i];
                const authorname = currentRecord.authorname; // Asegúrate de que esta propiedad sea correcta según tu estructura
                
                const listItem = $("<li></li>"); // Crear un elemento <li>
                listItem.append(`<a class='text-info' href='#'>${authorname}</a>`); // Agregar el contenido al <li>
                console.log(authorname);
                $("#authorList").append(listItem); // Agregar el <li> al contenedor
            }
            
             
        },
        error: function (error) {
            console.error("Error al ejecutar la consulta:", error);
        }
    });
}


    // Ejecutar la consulta al cargar la página
    consultaArticleDetail();
});
