<!DOCTYPE html>
<html>
<header>
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <style type="text/css">
    </style>
</header>

<body dir="rtl" class="bg-light text-right">
    <div id="body-callback">
        @isset($message)
        <div class="card text-white bg-{{$message['status']}}">
            <h5 class="card-header">
                {{ $message['title'] }}
            </h5>
            <div class="card-body">
                <p class="card-text font-weight-bold">{{ $message['body'] }}</p>
            </div>
        </div>
        @endisset
    </div>
</body>
</html>
