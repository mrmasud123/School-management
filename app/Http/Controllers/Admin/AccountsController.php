<?php

namespace App\Http\Controllers\Admin;

use App\Models\AcademicYear;
use App\Models\FeeStructure;
use App\Models\SchoolClass;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\FeePayment;
use Carbon\Carbon;
use App\Models\FeeInvoice;
use App\Models\Expense;
use App\Models\FeeCategory;
use Illuminate\Support\Facades\DB;
use App\Models\StudentFee;
use Illuminate\Support\Facades\Validator;

class AccountsController extends Controller
{
    public function index(): \Inertia\Response
    {
        $today = Carbon::today();

        $data = [
            'stats' => [
                'today_collection' => FeePayment::whereDate('payment_date', $today)->sum('amount_paid'),
                'month_income' => FeePayment::whereMonth('payment_date', now()->month)->sum('amount_paid'),
                'pending_invoices' => FeeInvoice::whereIn('status', ['unpaid', 'overdue'])->count(),
                'total_expenses' => Expense::whereMonth('expense_date', now()->month)->sum('amount'),
            ],

            'recent_payments' => FeePayment::with(['student', 'paymentMethod'])
                ->latest()
                ->take(5)
                ->get(),

            'recent_expenses' => Expense::with('category')
                ->latest()
                ->take(5)
                ->get(),
        ];
        return Inertia::render('accounts/Index', $data);
    }

    public function collectFee(Request $request)
    {
        return Inertia::render('accounts/CollectFee');
    }



    public function storeCollectFee(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|exists:students,id',
            'fee_structure_ids' => 'required|array|min:1',
            'fee_structure_ids.*' => 'exists:fee_structures,id',
            'amount_paid' => 'required|numeric|min:0',
            'payment_date' => 'required|date'
        ]);

        $student = Student::with(['feeStructures.feeCategory', 'studentFee'])
            ->find($request->student_id);

        $studentPaidFees = $student->studentFee->map(function ($fee) {
            return [
                'id'    => $fee->feeStructure->id ?? null,
                'month' => Carbon::parse($fee->feePayment?->payment_date)->format('F-Y'),
            ];
        });

        $requestedFees = collect($request->input('fee_structure_ids'))->map(function ($feeStructure) use ($request) {
            return [
                'id'    => $feeStructure,
                'month' => Carbon::parse($request->input('payment_date'))->format('F-Y'),
            ];
        });

        $validator->after(function ($validator) use ($request, $requestedFees,$studentPaidFees) {

        $alreadyPaidFees = $requestedFees->filter(function ($requested) use ($studentPaidFees) {
            return $studentPaidFees->contains(function ($paid) use ($requested) {
                return $paid['id'] === $requested['id']
                    && $paid['month'] === $requested['month'];
            });
        })->values();
            foreach ($alreadyPaidFees as $pf) {
                $category = FeeCategory::where('id', FeeStructure::where('id', $pf['id'])->pluck('fee_category_id')->first())
                    ->pluck('name')
                    ->first();

                $validator->errors()->add(
                    'fee_structure_id',
                    "The fee $category has already been paid for {$pf['month']}"
                );
            }

        });
        $validated = $validator->validate();

        DB::transaction(function () use ($validated, $request) {
            $transactionId = 'TXN-' . now()->format('YmdHis') . '-' . rand(1000, 9999);

            $paidIds = StudentFee::where('student_id', $request->student_id)->pluck('fee_structure_id')->toArray();
            $amountToBePaid = FeeStructure::whereNotIn('id', $paidIds)->where('class_id', $request->class_id)->sum('amount');
            $flag = "";
            if ($request->amount_paid < $amountToBePaid) {
                $flag = 'partial';
            } elseif ($request->amount_paid == $amountToBePaid) {
                $flag = 'paid';
            } else {
                $flag = 'overpaid';
            }


            foreach ($validated['fee_structure_ids'] as $feeStructure) {
                $fee = FeeStructure::where('id', $feeStructure)->first();

                StudentFee::create([
                    'student_id' => $request->student_id,
                    'fee_structure_id' => $feeStructure,
                    'amount' => $fee->amount,
                    'transaction_id' => $transactionId
                ]);

            }

            FeePayment::create([
                'transaction_id' => $transactionId,
                'student_id' => $request->student_id,
                'amount_paid' => $request->amount_paid,
                'payment_date' => $request->payment_date,
                'status' => $flag,
                'received_by' => auth()->user()->id,
                'remarks' => $request->remarks,
            ]);
        });

        return redirect()->back()->with('success', 'Fee collected successfully');
    }


    public function fetchStudentFeeDetails($id)
    {
        $code = 'ADM' . $id;

        $student = Student::with([
            'studentClass:id,name',
            'section:id,name',
            'feeStructures.feeCategory',
            'studentFee'
        ])->where('admission_no', $code)->first();

        if (!$student) {
            return response()->json([
                'message' => 'Student not found'
            ], 404);
        }

        $paidIds = $student->studentFee->pluck('fee_structure_id')->toArray();

        $feeStructures = FeeStructure::with('feeCategory:id,name', 'studentFees')
            ->where('class_id', $student->class_id)
            ->get();

        return response()->json([
            'student' => $student,
            'feeStructures' => $feeStructures,
        ]);
    }


    public function addExpense()
    {
        return Inertia::render('accounts/AddExpense', ['categories' => []]);
    }

    public function feeStructure(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);
        $search = $request->get('search');
        $classes = SchoolClass::get();
        $feeCategories = FeeCategory::all();
        $academicYears = AcademicYear::all();
        $feeStructures = FeeStructure::with(['studentClass', 'feeCategory', 'academicYear'])->paginate($perPage);
        return Inertia::render('accounts/FeeStructure', [
            'classes' => $classes,
            'feeCategories' => $feeCategories,
            'academicYears' => $academicYears,
            'feeStructures' => $feeStructures,
            'filters' => [
                'search' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }
    public function FeeCategory()
    {
        $categories = FeeCategory::all();
        return Inertia::render('accounts/FeeCategory', ['categories' => $categories]);
    }

    public function storeFeeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:fee_categories,name',
            'description' => 'nullable',
        ]);

        FeeCategory::create($validated);

        return back()->with('success', 'Fee Category Created Successfully');
    }

    public function academicYear()
    {
        $academicYears = AcademicYear::all();
        return Inertia::render('accounts/AcademicYear', ['academicYears' => $academicYears]);
    }

    public function storeAcademicYear(Request $request)
    {
        $validated = $request->validate([
            'name' => [
                'required',
                'unique:academic_years,name',
            ],
        ]);

        [$startYear, $endYear] = explode('-', $validated['name']);

        $yearStartDate = Carbon::createFromDate((int) $startYear, 1, 1)->startOfDay();
        $yearEndDate = Carbon::createFromDate((int) $startYear, 12, 31)->endOfDay();

        $academicYear = AcademicYear::create([
            'name' => $validated['name'],
            'start_date' => $yearStartDate,
            'end_date' => $yearEndDate,
        ]);

        return back()->with('success', 'Academic Year Created Successfully');
    }

    public function storeFeeStructure(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'fee_category_id' => 'required|exists:fee_categories,id',
            'academic_year_id' => 'required|exists:academic_years,id',
            'amount' => 'required|numeric|min:0',
        ]);
        $validated['section_id'] = 0;
        FeeStructure::create($validated);

        return back()->with('success', 'Fee Structure Created Successfully');
    }

    public function fetchFeeStructure(Request $request)
    {
        $class_id = $request->input('class_id');
        return response()->json([
            'feeStructures' => FeeStructure::where('class_id', $class_id)->with('feeCategory:id,name')->get()
        ]);
    }

    public function generatePaymentHistory($studentId){
        $student = Student::with([
            'studentClass',
            'section',
            'studentFee.feeStructure.feeCategory',
            'studentFee.feePayment'
        ])->findOrFail($studentId);

        $pdf = Pdf::loadView('pdf.payment-history', [
            'student' => $student,
        ])->setPaper('a4', 'landscape');

// PREVIEW in browser
        return $pdf->stream('student_payment_history.pdf');

    }
}
