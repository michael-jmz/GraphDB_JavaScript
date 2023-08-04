<?php
require_once 'vendor/autoload.php'; // Asegúrate de incluir EasyRdf en tu proyecto.

const ENDPOINT_URL = "http://localhost:7200/repositories/authors";

// Construir la consulta SPARQL
$query = '
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX vivo: <http://vivoweb.org/ontology/core#>
    
    SELECT ?nombre ?rank WHERE { 
        ?autores rdfs:label ?nombre.
        ?autores vivo:rank ?rank.
    } LIMIT 100 
';

// Realizar la consulta SPARQL utilizando EasyRdf
$client = new \EasyRdf\Sparql\Client(ENDPOINT_URL);
$resultSet = $client->query($query);

// Construir la tabla con los resultados
echo '<table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Rank</th>
            </tr>
        </thead>
        <tbody>';

foreach ($resultSet as $result) {
    echo '<tr>
            <td>' . $result->nombre . '</td>
            <td>' . $result->rank . '</td>
        </tr>';
}

echo '</tbody></table>';
