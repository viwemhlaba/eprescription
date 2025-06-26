<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>No Data Found</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .error-container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 500px;
            text-align: center;
        }
        .error-icon {
            color: #ffc107;
            font-size: 48px;
            margin-bottom: 20px;
        }
        h1 {
            color: #856404;
            margin-bottom: 10px;
            font-size: 24px;
        }
        .error-message {
            color: #6c757d;
            margin-bottom: 10px;
        }
        .error-details {
            color: #856404;
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
        .btn:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-icon">📊</div>
        <h1>No Data Found</h1>
        <p class="error-message">{{ $message ?? 'No data was found for your request.' }}</p>
        
        @if(isset($details))
            <div class="error-details">
                {{ $details }}
            </div>
        @endif
        
        @if(isset($back_url))
            <a href="{{ $back_url }}" class="btn">Try Again</a>
        @else
            <a href="javascript:history.back()" class="btn">Go Back</a>
        @endif
    </div>

    <script>
        // Auto-close the window after 8 seconds if it was opened as a popup
        if (window.opener) {
            setTimeout(() => {
                window.close();
            }, 8000);
        }
    </script>
</body>
</html>
