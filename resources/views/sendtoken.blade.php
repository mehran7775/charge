<!DOCTYPE html>
<html>
<head>
</head>
<body>
    <form action="https://core.paystar.ir/api/pardakht/payment" method="post">
        <input type="hidden" name="token" value="{{$token}}">
        @csrf
    </form>

    <script>
        document.querySelector('form').submit();
    </script>
</body>

</html>
