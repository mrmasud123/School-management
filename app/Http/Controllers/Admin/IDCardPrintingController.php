<?php

namespace App\Http\Controllers\Admin;

use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Picqer\Barcode\BarcodeGeneratorPNG;

class IDCardPrintingController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('IDCardPrinting');
    }

    public function generateIdCard($id)
    {
        $student = Student::with('studentClass', 'section')->find($id);

        $data = $student->admission_no . "- Class " . $student->studentClass?->name;


        $generator = new BarcodeGeneratorPNG();

        // create a BIG, clean barcode
        $barcode = base64_encode(
            $generator->getBarcode($data, $generator::TYPE_CODE_128)
        );

        $pdf = Pdf::loadView('pdf.id-card', [
            'student' => $student,
            'barcode' => $barcode,
            'barcode_text' => $data   // optional: show text below barcode
        ]);
//        dd('<img src="data:image/png;base64,'.$barcode.'">');


        return $pdf->stream('id-card-'.$student->admission_no.'.pdf');
    }



}
