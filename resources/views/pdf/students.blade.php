<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Students List</title>
    <style>
        body {
            font-family: DejaVu Sans;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #444;
            padding: 6px;
            text-align: left;
        }
        th {
            background: #f2f2f2;
        }
    </style>
</head>
<body>
    <h2 style="text-align:center; background-color:blue; color:white;">
        {{ config('app.name') }}
    </h2>
    
<h3>Students List (Page {{ $page }})</h3>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>Admission No</th>
            <th>Class</th>
            <th>Section</th>
            <th>Guardian Phone</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        @foreach($students as $student)
            <tr>
                <td>{{ $student->id }}</td>
                <td>{{ $student->first_name }} {{ $student->last_name }}</td>
                <td>{{ preg_replace('/\D+/', '', $student->admission_no) }}</td>
                <td>Class {{ $student?->studentClass?->name }}</td>
                <td>{{ $student?->section?->name }}</td>
                <td>{{ $student->guardian_phone }}</td>
                <td>{{ ucfirst($student->status) }}</td>
            </tr>
        @endforeach
    </tbody>
</table>

</body>
</html>
