<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Student Payment Report</title>

    <style>
        /* ================= PAGE SETUP ================= */
        @page {
            margin: 110px 40px 70px 40px;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
        }

        /* ================= HEADER ================= */
        header {
            position: fixed;
            top: -90px;
            left: 0;
            right: 0;
            height: 80px;
            background: #1e40af;
            color: #fff;
            padding: 15px 20px;
        }

        header h1 {
            margin: 0;
            font-size: 18px;
        }

        header p {
            margin: 4px 0 0;
            font-size: 12px;
        }

        /* ================= FOOTER ================= */
        footer {
            position: fixed;
            bottom: -50px;
            left: 0;
            right: 0;
            height: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }

        .page-number:before {
            content: "Page " counter(page);
        }

        /* ================= SPACING FIX ================= */
        .header-spacer {
            height: 20px;
        }

        .content {
            margin-top: 10px;
        }

        /* ================= STUDENT INFO ================= */
        .student-info {
            margin-bottom: 20px;
            padding: 12px;
            background: #f8fafc;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }

        .student-info table {
            width: 100%;
            border-collapse: collapse;
        }

        .student-info td {
            padding: 4px 6px;
            border: none;
        }

        /* ================= PAYMENT TABLE ================= */
        table.report {
            width: 100%;
            border-collapse: collapse;
        }

        table.report thead {
            background: #f1f5f9;
        }

        table.report th,
        table.report td {
            border: 1px solid #cbd5e1;
            padding: 6px;
            text-align: left;
        }

        table.report th {
            font-weight: bold;
            font-size: 11px;
        }

        .text-right {
            text-align: right;
        }

        .status-paid {
            color: #15803d;
            font-weight: bold;
        }

        .status-partial {
            color: #b45309;
            font-weight: bold;
        }

        .status-overpaid {
            color: #1d4ed8;
            font-weight: bold;
        }
    </style>
</head>

<body>

<!-- ================= HEADER ================= -->
<header>
    <h1>{{ config('app.name') }}</h1>
    <p>Student Payment History Report</p>
</header>

<!-- ================= FOOTER ================= -->
<footer>
    <span class="page-number"></span>
</footer>

<!-- Spacer to avoid header overlap -->
<div class="header-spacer"></div>

<!-- ================= CONTENT ================= -->
<div class="content">

    <!-- STUDENT INFORMATION -->
    <div class="student-info">
        <table>
            <tr>
                <td><strong>Name:</strong> {{ ucfirst($student->first_name) }} {{ $student->last_name }}</td>
                <td><strong>Admission No:</strong> {{ $student->admission_no }}</td>
            </tr>
            <tr>
                <td><strong>Class:</strong> Class {{ $student->studentClass?->name }}</td>
                <td><strong>Section:</strong> {{ $student->section?->name }}</td>
            </tr>
            <tr>
                <td><strong>Session:</strong> {{ $student->academic_year }}</td>
                <td><strong>Generated On:</strong> {{ now()->format('d M Y') }}</td>
            </tr>
        </table>
    </div>

    <!-- PAYMENT HISTORY TABLE -->
    <table class="report">
        <thead>
        <tr>
            <th>#</th>
            <th>Fee Category</th>
            <th>Month</th>
            <th class="text-right">Amount</th>
            <th>Status</th>
            <th>Payment Date</th>
            <th>Transaction ID</th>
        </tr>
        </thead>
        <tbody>
        @foreach($student->studentFee as $index => $fee)
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>{{ $fee->category_name }}</td>
            <td>{{ $fee->month }}</td>
            <td class="text-right">
                Tk. {{ number_format($fee->amount, 2) }}
            </td>
            <td class="
                    {{ $fee?->feePayment?->status === 'paid' ? 'status-paid' : '' }}
                    {{ $fee?->feePayment?->status === 'partial' ? 'status-partial' : '' }}
                    {{ $fee?->feePayment?->status === 'overpaid' ? 'status-overpaid' : '' }}
                ">
                {{ ucfirst($fee?->feePayment?->status ?? 'N/A') }}
            </td>
            <td>
                {{ optional($fee->feePayment)->payment_date
                ? \Carbon\Carbon::parse($fee->feePayment->payment_date)->format('d M Y')
                : '-' }}
            </td>
            <td>{{ $fee->transaction_id }}</td>
        </tr>
        @endforeach
        </tbody>
    </table>

</div>

</body>
</html>
