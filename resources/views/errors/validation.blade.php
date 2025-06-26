<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Validation Error</title>
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
            color: #dc3545;
            font-size: 48px;
            margin-bottom: 20px;
        }
        h1 {
            color: #dc3545;
            margin-bottom: 10px;
            font-size: 24px;
        }
        .error-message {
            color: #6c757d;
            margin-bottom: 20px;
        }
        .error-list {
            text-align: left;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 4px;
            padding: 15px;
            margin: 20px 0;
        }
        .error-list ul {
            margin: 0;
            padding-left: 20px;
        }
        .error-list li {
            color: #721c24;
            margin-bottom: 5px;
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
        <div class="error-icon">⚠️</div>
        <h1>Validation Error</h1>
        <p class="error-message">{{ $message ?? 'The provided data is invalid.' }}</p>
        
        @if(isset($errors) && count($errors) > 0)
            <div class="error-list">
                <strong>Errors:</strong>
                <ul>
                    @foreach($errors as $field => $fieldErrors)
                        @foreach($fieldErrors as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    @endforeach
                </ul>
            </div>
        @endif
        
        <a href="javascript:history.back()" class="btn">Go Back</a>
    </div>

    <script>
        // Auto-close the window after 5 seconds if it was opened as a popup
        if (window.opener) {
            setTimeout(() => {
                window.close();
            }, 5000);
        }
    </script>
</body>
</html>
