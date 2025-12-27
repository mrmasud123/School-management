<?php

namespace App\Http\Controllers\Admin;

use App\Models\Student;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Picqer\Barcode\BarcodeGeneratorPNG;
use App\Models\Subject;
use App\Models\SchoolClass;
use Illuminate\Support\Facades\DB;


class StudentDetailsController extends Controller
{
    public function index(): \Inertia\Response
    {
        $subjects = Subject::all();
        $classes = SchoolClass::all();
        return Inertia::render('StudentDetailsInformation',['subjects'=>$subjects,'classes'=>$classes]);
    }

    public function generateIdCard($id)
    {
        $student = Student::with('studentClass', 'section')->find($id);

        $data = $student->admission_no . "- Class " . $student->studentClass?->name;


        $generator = new BarcodeGeneratorPNG();
        $barcode = base64_encode(
            $generator->getBarcode($data, $generator::TYPE_CODE_128)
        );

        $pdf = Pdf::loadView('pdf.id-card', [
            'student' => $student,
            'barcode' => $barcode,
            'barcode_text' => $data   
        ]);


        return $pdf->stream('id-card-'.$student->admission_no.'.pdf');
    }
    
    
    public function fetchStudents($sectionId)
    {
        $students = Student::where('section_id', $sectionId)
            ->get();

        return response()->json(['students' => $students]);
    }
    
    public function studentAllDetails($studentId){
        $student = Student::with('studentClass', 'section')->find($studentId);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);  
        }
        return response()->json(['student' => $student]);
    }



}
