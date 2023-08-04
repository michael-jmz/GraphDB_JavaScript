const endpointUrl = "http://localhost:7200/repositories/keywords";
        const query = `
        PREFIX vivo: <http://vivoweb.org/ontology/core#>
            select ?DOI ?AuthorsKeywords where { 
                ?DOI vivo:freetextKeyword ?AuthorsKeywords.       		
        } limit 100 
        `;

        function executeQuery() {
            $.ajax({
                url: endpointUrl,
                data: {
                    query: query,
                    format: "csv"
                },
                success: function (csvData) {
                    const table = $("#resultsTable2 tbody");
                    table.empty();

                    const rows = csvData.trim().split("\n");
                    const headers = rows[0].split(",");

                    for (let i = 1; i < rows.length; i++) {
                        const currentLine = rows[i].split(",");

                        if (currentLine.length === headers.length) {
                            const row = $("<tr></tr>");
                            for (let j = 0; j < headers.length; j++) {
                                const cell = $("<td></td>").text(currentLine[j]);
                                row.append(cell);
                            }
                            table.append(row);
                        }
                    }
                },
                error: function (error) {
                    console.error("Error al ejecutar la consulta:", error);
                }
            });
        }

        // Ejecutar la consulta y construir la tabla al hacer clic en el botón
        $(document).ready(function () {
            $("#btnEnviar2").click(function () {
                executeQuery();
            });
        });