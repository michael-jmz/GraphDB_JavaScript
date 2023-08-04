const endpointUrl = "http://localhost:7200/repositories/doi";

const query = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX bibo: <http://purl.org/ontology/bibo/>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX schema: <http://schema.org/>
PREFIX opus: <http://lsdis.cs.uga.edu/projects/semdis/opus#>
SELECT ?doi ?doiLabel ?volumen ?fecha ?abstract WHERE { 
    ?doi dcterms:identifier ?doiLabel;
         schema:volumeNumber ?volumen;
         opus:year ?fecha;
         bibo:abstract ?abstract.
} LIMIT 10
`;

function executeQuery() {
  $.ajax({
    url: endpointUrl,
    data: {
      query: query,
      format: "json"
    },
    success: function (data) {
      const table = $("#resultsTableDOIv1 tbody");
      table.empty();

      data.results.bindings.forEach(result => {
        const doi = result.doi.value;
        const doiLabel = result.doiLabel.value;
        const volumen = result.volumen.value;
        const fecha = result.fecha.value;
        const abstract = result.abstract.value;

        const row = $("<tr></tr>");
        const doiCell = $("<td></td>").html(`<a href="${doi}" target="_blank">${doiLabel}</a>`);
        const doiLabelCell = $("<td></td>").text(doiLabel);
        const volumenCell = $("<td></td>").text(volumen);
        const fechaCell = $("<td></td>").text(fecha);
        const abstractCell = $("<td></td>").text(abstract);

        row.append(doiCell, doiLabelCell, volumenCell, fechaCell, abstractCell);
        table.append(row);
      });
    },
    error: function (error) {
      console.error("Error al ejecutar la consulta:", error);
    }
  });
}

$(document).ready(function () {
  $("#btnEnviar4").click(function () {
    executeQuery();
  });
});
