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
        #modal_me {
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

        .modal_me {
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

        .title_close {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        #content_modal {
            width: 100%;
            padding: 10px;
        }

        #content_modal p {
            color: rgba(0, 0, 0, 0.589) !important;

        }

        .close_modal img {
            width: 16px;
            cursor: pointer;
        }

    </style>
</head>

<body>
    <div id="modal_me">
        <div class="modal_me">
            <div class="title_close">
                <div class="title_modal">
                    <h3>
                        عنوان
                    </h3>
                </div>
                <div class="close_modal">
                    <!-- <button  onclick="clode_modal()">بستن</button> -->
                    <img onclick="close_modal()" src="/img/close-window-16 (1).png">
                </div>
            </div>
            <div id="content_modal">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Non velit et soluta consequatur cupiditate recusandae incidunt nisi iste maiores reprehenderit
                    blanditiis
                    quae ducimus nam, magni modi. Natus dicta eligendi velit.
                </p>
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
            {{-- <div class="operators">
                <div data-type="MTN" class="operator MTN"><i></i></div>
                <div data-type="MCI" class="operator MCI"><i></i></div>
                <div data-type="RTL" class="operator RTL"><i></i></div>
            </div> --}}
            <div id="content">
                <form accept-charset="utf-8" method="post" id="chargeForm" action="{{ url('/payment/create') }}">
                    <fieldset>
                        <div class="charge">
                            <div class="input text required account">
                                <input id="phoneNumber" value="09" type="text" maxlength="11" name="phone_number">
                            </div>
                        </div>
                        <div class="amount">
                            <select name="amount">
                                <option value="1000">10000 ریال</option>
                                <option value="20000">20000 ریال</option>
                                <option value="50000">50000 ریال</option>
                                <option value="100000">100000 ریال</option>
                                <option value="200000">200000 ریال</option>
                                <option value="500000">500000 ریال</option>
                            </select>
                        </div>
                        <div class="save-information">
                            <input type="checkbox" value="1" id="save-information" name="data[save-information]">
                            <label for="save-information">ذخیره اطلاعات تماس </label>
                        </div>
                        {{-- <div class="payment-gateways">
							<p>درگاه پرداخت: <i></i></p>
							<ul>
								<li id="Parsian" class="bank-Parsian" data-tooltip="پارسیان"></li>
								<li id="Mellat" class="bank-Mellat" data-tooltip="ملت"></li>
								<li id="Saman" class="bank-Saman" data-tooltip="سامان"></li>
								<li id="Melli" class="bank-Melli" data-tooltip="ملی"></li>
								<li id="Fanava" class="bank-Fanava" data-tooltip="فن آوا"></li>
                                <li id="Emtiyaz" class="bank-Emtiyaz" data-tooltip="امتیاز"></li>
                                <li id="Zarinpal" class="bank-Zarinpal" data-tooltip="زرین پال"></li>
							</ul>
							<p class="caution">خرید با کلیه کارت های بانکی عضو شبکه شتاب امکان پذیر می باشد.</p>
						</div> --}}
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
        var WebserviceID = <?php echo '"' . $config['webserviceID'] . '"'; ?>;

        function show_modal(id) {
            var modal = document.getElementById("modal_me")
            if (id == 'abouts') {
                var p = 'درباره ما';
                var content = 'این محتویات درباره ما است'
                const h = modal.querySelector(".title_modal h3");
                h.innerHTML = p
            } else {
                var p = 'قوانین';
                var content = 'این محتویات قوانین ما است';
                const h = modal.querySelector(".title_modal h3");
                h.innerHTML = p
            }

            modal.style.transition = "all 0.3s";
            modal.style.zIndex = 999
            modal.style.visibility = "visible"
            modal.style.opacity = 1

        }

        function close_modal() {
            var modal = document.getElementById("modal_me")
            modal.style.zIndex = -1
            modal.style.visibility = "hidden"
            modal.style.opacity = 0
        }
    </script>
</body>

</html>
