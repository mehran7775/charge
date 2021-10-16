<!DOCTYPE html>
<html>
<header>
       <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <style type="text/css">
    </style>
</header>

<body dir="rtl" class="bg-light text-right">
    <div class="pb-5">
        <div class="card w-50 mt-5 mx-auto">
            @isset($message)
                <h5 class="card-header text-<?= $message['status'] ?>">
                    {{ $message['title'] }}
                </h5>
                <div class="card-body text-<?= $message['status'] ?>">
                    <p class="card-text">{{ $message['body'] }}</p>
                </div>
            @endisset
        </div>
    </div>
</body>
</html>
