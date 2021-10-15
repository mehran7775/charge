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
            @isset($failCreatePayment)
                <h5 class="card-header text-danger">
                    {{ $failCreatePayment['title'] }}
                </h5>
                <div class="card-body text-danger">
                    <p class="card-text">{{ $failCreatePayment['body'] }}</p>
                </div>
            @endisset
            @isset($fail)
                <h5 class="card-header text-danger">
                    {{ $fail['title'] }}
                </h5>
                <div class="card-body text-danger">
                    <p class="card-text">{{ $fail['body'] }}</p>
                </div>
            @endisset
            @isset($verified)
                <h5 class="card-header text-warning">
                    {{ $verified['title'] }}
                </h5>
                <div class="card-body text-warning">
                    <p class="card-text">{{ $verified['body'] }}</p>
                </div>
            @endisset
            @isset($successVerifyPayment)
                <h5 class="card-header text-success">
                    {{ $successVerifyPayment['title'] }}
                </h5>
                <div class="card-body text-success">
                    <p class="card-text">{{ $successVerifyPayment['body'] }}</p>
                </div>
            @endisset
            @isset($failVerifyPayment)
                <h5 class="card-header text-danger">
                    {{ $failVerifyPayment['title'] }}
                </h5>
                <div class="card-body text-danger">
                    <p class="card-text">{{ $failVerifyPayment['body'] }}</p>
                </div>
            @endisset
        </div>
    </div>

 {{-- <script src="{{ asset('js/app.js') }}" defer></script> --}}
</body>


</html>
