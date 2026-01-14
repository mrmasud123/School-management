<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: DejaVu Sans;
            background: #f0f0f0;
        }

        .card {
            width: 320px;
            min-height: 480px;
            border-radius: 12px;
            overflow: hidden;
            border: 2px solid #003366;
            background: #ffffff;
            margin: 20px auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .header {
            background: #003366;
            color: white;
            text-align: center;
            padding: 10px 5px;
        }

        .header h5 {
            margin: 0;
            font-size: 18px;
            font-weight: bold;
        }

        .photo-container {
            width: 100px;
            height: 100px;
            margin: 15px auto 10px auto;
            border-radius: 8px;
            overflow: hidden;
            border: 2px solid #003366;
        }

        .photo-container img {
            width: 100%;
            height: 100%;
            /* object-fit may not work in Dompdf */
        }

        .info {
            padding: 0 20px;
            font-size: 14px;
            line-height: 1.4;
        }

        .info b {
            color: #003366;
        }

        .barcode {
            text-align: center;
            margin: 10px 0 15px 0;
        }

        .footer {
            background: #003366;
            color: white;
            text-align: center;
            padding: 8px;
            font-size: 12px;
        }

          .photo-container {
              width: 100px;
              height: 100px;
              margin: 15px auto;
              border: 2px solid #003366;
              border-radius: 8px;
              overflow: hidden;
              text-align: center;
              line-height: 100px; /* vertical centering trick */
          }

        .photo-container img {
            max-width: 100%;
            max-height: 100%;
            vertical-align: middle;
        }
    </style>

</head>

<body>
<div class="card">
    <div class="header">
        <h5>{{ config('app.name', 'School Name') }}</h5>
    </div>


    <div class="photo-container">
        @if(file_exists($photoPath))
        <img src="{{ $photoPath }}"  alt="Student Photo">
        @endif
    </div>


    <div class="info">
        <p><b>Name:</b> {{ $student->first_name }} {{ $student->last_name }}</p>
        <p><b>Blood Group:</b> {{ $student->blood_group }}</p>
        <p><b>Class:</b> Class {{ $student->studentClass?->name }}</p>
        <p><b>Section:</b> {{ $student->section?->name }}</p>
        <p><b>Emergency:</b> {{ $student->guardian_phone }}</p>
        <p><b>ID:</b> {{ $student->admission_no }}</p>
    </div>

    <div class="barcode">
        <img src="data:image/png;base64,{{ $barcode }}" width="220" height="50">
    </div>

    <div class="footer">
        {{ $student->address }}
    </div>
</div>
</body>
</html>
