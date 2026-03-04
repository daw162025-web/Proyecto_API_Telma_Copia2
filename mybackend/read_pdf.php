<?php
require __DIR__ . '/vendor/autoload.php';

// Path to the PDF file
$pdfPath = 'c:\\Users\\Propietario\\Documents\\2DAW\\Proyecto_API_Telma_Copia2\\Subida múltiple de archivos.pdf';

try {
    // Parse pdf file and build necessary objects.
    $parser = new \Smalot\PdfParser\Parser();
    $pdf = $parser->parseFile($pdfPath);

    // Retrieve all pages from the pdf file.
    $text = $pdf->getText();

    file_put_contents('pdf_output_utf8.txt', $text);
    echo "Done";
}
catch (Exception $e) {
    echo "Error parsing PDF: " . $e->getMessage();
}
