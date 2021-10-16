@php
$config = [
'title' => 'فروشگاه شارژ و خدمات پی استار ',
'description' => 'خرید شارژ تلفن همراه',
'keywords' => 'شارژ آسان تلفن همراه,شارژ موبایل,شارژ مستقیم,شارژ مستقیم,فروش شارژ,شارژ ایرانسل,شارژ همراه اول',
'webserviceID' => 'XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
];
$slashPos = strrpos($_SERVER['SCRIPT_NAME'], '/');
$root = 'http://' . $_SERVER['SERVER_NAME'] . substr($_SERVER['SCRIPT_NAME'], 0, $slashPos);
@endphp

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="description" content="<?php echo $config['description']; ?>" />
    <meta name="keywords" content="<?php echo $config['keywords']; ?>" />
    <link href="css/favicon.ico" type="image/x-icon" rel="icon" />
    <link rel="stylesheet" type="text/css" href="css/tinycircleslider.css" />
    <link rel="stylesheet" type="text/css" href="css/jquery.qtip.css" />
    <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.css" />
    <link rel="stylesheet" type="text/css" href="css/ion.rangeSlider.skinNice.css" />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
    <link rel="stylesheet" type="text/css" href="css/sweetalert2.css" />
    <link rel="stylesheet" type="text/css" href="css/help.css" />
    <title><?php echo $config['title']; ?></title>
    <!-- Styles -->
    <style type="text/css">
        #modal-me {
            position: absolute;
            width: 100%;
            height: 110%;
            background-color: rgba(0, 0, 0, 0.24);
            left: 0;
            top: 0;
            z-index: -1;
            overflow: hidden !important;
            visibility: hidden;
            opacity: 0;
        }

        .modal-me {
            width: 60%;
            min-height: 400px;
            margin: auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: whitesmoke;
            padding: 10px;
            border-radius: 10px;
        }

        .title-close {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .body-modal{
            width:100%;
            margin:auto;
            
        }
       .body-content{
           width:80%;
           margin:auto;
       } 

        #content-modal {
            width: 100%;
            margin: auto;
            padding: 10px;
        }

        #content-modal p {
            color: rgba(0, 0, 0, 0.589) !important;

        }

        .close-modal img {
            width: 16px;
            cursor: pointer;
        }

    </style>
</head>

<body>
    <div id="modal-me">
        <div class="modal-me">
            <div class="body-content">
                <div class="title-close">
                    <div class="title-modal">
                        <h3>
                            عنوان
                        </h3>
                    </div>
                    <div class="close-modal">

                        <img onclick="close_modal()" src="/img/close-window-16 (1).png">
                    </div>
                </div>
                <div id="content-modal">
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Non velit et soluta consequatur cupiditate recusandae incidunt nisi iste maiores reprehenderit
                        blanditiis
                        quae ducimus nam, magni modi. Natus dicta eligendi velit.
                    </p>
                </div>
                </div>
            </div>
        </div>
    </div>
    <div>
    </div>
    <div class="bgs">
        <div class="menu">
            <span class="support">تماس با ما</span>
            <span class="about_us" onclick="show_modal('abouts')">درباره ما</span>
            <span class="laws" onclick="show_modal('laws')">قوانین</span>
        </div>

        <div class="container">
            <div class="operators TopUp">
                <div data-type="MTN" onclick="selectOperator('mtn')" class="operator MTN active"><i></i></div>
                <div data-type="MCI" onclick="selectOperator('mci')" class="operator MCI"><i></i></div>
                <div data-type="RTL" onclick="selectOperator('rtl')" class="operator RTL"><i></i></div>
            </div>

            <div id="content">
                <form accept-charset="utf-8" method="post" id="chargeForm" action="{{ url('/payment/create') }}">
                    <fieldset>
                        <div class="charge">
                            <div class="input text required account">
                                <input id="phoneNumber" value="093" type="text" maxlength="11" name="phone_number">
                            </div>
                        </div>
                        <div class="amount">
                            <select name="amount">
                                <option value="1000">10000 ریال</option>
                                <option value="100000">20000 ریال</option>
                                <option value="150000">50000 ریال</option>
                                <option value="200000">100000 ریال</option>
                                <option value="500000">200000 ریال</option>
                            </select>
                        </div>
                        <div class="save-information">
                            <input type="checkbox" value="1" id="save-information" name="data[save-information]">
                            <label for="save-information">ذخیره اطلاعات تماس </label>
                        </div>
                        <input type="hidden" id="type-operator" name="type_operator" value="mtn">
                    </fieldset>
                    <div>
                        @csrf
                        <input id="sendForm" value="پــرداخــت" type="submit">
                    </div>
                </form>

                <div class="errors" style="color:red;font-weight: bold;margin-top:10px;">
                    @if ($errors)
                    @foreach ($errors->all() as $error)
                    <div>{{ $error }}</div><br>
                    @endforeach
                    @endif
                </div>
            </div>
            <div class="clear"></div>
        </div>
    </div>
    <div id="payment-process"></div>
    <div class="cover"></div>
    <div class="connecting">
        <p></p>
    </div>
    <script type="text/javascript" src="js/jquery-2.1.0.min.js"></script>
    <script type="text/javascript" src="js/jquery.qtip.min.js"></script>
    <script type="text/javascript" src="js/ion.rangeSlider.min.js"></script>
    <script type="text/javascript" src="js/jquery.tinycircleslider.js"></script>
    <script type="text/javascript" src="js/sweetalert2.js"></script>
    <script type="text/javascript" src="js/charge.js"></script>
    <script type="text/javascript" src="js/jquery.cookie.js"></script>
    <script type="text/javascript">
       	var WebserviceID = @php echo '"' . $config['webserviceID'] . '"'; @endphp

        function show_modal(id) {
            var modal = document.getElementById("modal-me")
            if (id == 'abouts') {
                var p = 'درباره ما';
                var content = 'این محتویات درباره ما است'
                const h = modal.querySelector(".title-modal h3");
                h.innerHTML = p
            } else {
                var p = 'قوانین';
                var content = 'این محتویات قوانین ما است';
                const h = modal.querySelector(".title-modal h3");
                h.innerHTML = p
            }

            modal.style.transition = "all 0.3s";
            modal.style.zIndex = 999
            modal.style.visibility = "visible"
            modal.style.opacity = 1

        }

        function close_modal() {
            var modal = document.getElementById("modal-me")
            modal.style.zIndex = -1
            modal.style.visibility = "hidden"
            modal.style.opacity = 0
        }

        function selectOperator(id = null) {
            const operator = document.getElementById('type-operator');
            const phoneNumber = document.getElementById('phoneNumber');
            if (id === 'mtn') {
                operator.value = 'mtn';
                phoneNumber.value = '093';
            } else if (id === 'mci') {
                operator.value = 'mci';
                phoneNumber.value = '091'
            } else if (id === 'rtl') {
                operator.value = 'rtl';
                phoneNumber.value = '092';
            }
        }
        selectOperator();

    </script>
</body>

</html>
