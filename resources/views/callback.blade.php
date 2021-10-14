<!DOCTYPE html>
<html>
<header>
    <style type="text/css">

        .body-callback{
            background-color: rgb(192, 192, 192)
        }
        .fail{
            position: absolute;
            width: max-content;
            min-width: 350px;
            padding: 20px;
            background-color: #fff;
            color: black;
            border:1px solid #ec7466;
            border-radius: 10px;
            left: 50%;
            top: 40%;
            transform: translate(-50%,-50%);
            text-align: right;
            direction: rtl;
            font-weight: bold;
        }

    </style>
</header>

<body>
  <div class="body-callback">
        @if ($failCreatePayment)
          {{$failCreatePayment}}
      @endif
      @if ($fail)
          <div class="fail">
              <p >
                  کابر با شماره {{$fail['phone_number']}}
              </p>
              <p>{{$fail['message']}}</p>
          </div>
      @endif
      @if ($payed)
          {{$payed}}
      @endif
      @if ($successVerifyPayment)
          {{$successVerifyPayment}}
      @endif
      @if ($failVerifyPayment)
          {{$failVerifyPayment}}
      @endif

  </div>

</body>


</html>
