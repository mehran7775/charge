jQuery(document).ready(function ($) {
	var DefaultChargeKind = 'TopUp';
	var DefaultOperator = 'MTN';
	var products = null;
	var paymentGateways = null;
	var isTarabord = false;
	var paymentGatewayStatus = { 'Bill': false, 'GiftCard': false, 'Antivirus': false, 'InternetPackage': false };
	var DefaultOperatorPhone = '';
	var Kinds = ["TopUp", "PIN", "InternetPackage", "WiMax", "Bill", "GiftCard", "TrafficCard", "Antivirus"];
	var operatorsName = { "MTN": "ایرانسل", "MCI": "همراه اول", "RTL": "رایتل" };
	var KindTitle = ["شارژ مستقیم", "کارت شارژ", "بسته اینترنت", "شارژ وایمکس ایرانسل", "پرداخت قبض", "گیفت کارت", "طرح ترافیک", "آنتی ویروس"];
	var KindDescription =
		[
			'در این سامانه شارژ بصورت تاپ آپ عرضه می گردد و پس ازطی مراحل خرید، سیم کارت شما بصورت خودکار شارژ شده و نیازی به ثبت پین یا رمز شارژ نمی باشد.'
			, 'در این نوع پس از طی مراحــل خرید پین و سریال در اختیار شما قرار می گیرد که با وارد کردن پین، گوشی شما شارژ می گردد.'
			, 'بسته های اینترنت همراه با تنوع زیاد'
			, 'در این سرویس خطوط وایمکس ایرانسل شارژ می شود.'
			, 'پرداخت کلیه قبوض خدماتی از جمله آب، برق، گاز، تلفن ثابت، تلفن همراه ، جرائم راهنمایی و رانندگی و عوارض شهرداری'
			, 'با خرید گیفت کارت می توانید از سرویس هایی همچون خرید نرم افزار، بازی، موسیقی، فیلم، کتاب و ... استفاده نمایید.'
			, 'خرید مجوز عبور از طرح ترافیک، مخصوص شهر تهران'
			, 'خرید بهترین آنتی ویروس های روز دنیا'
		];

	function startup() {
		if (DefaultOperator == 'MTN') {
			$('label[for=magiccharge]').text('شارژ شگفت انگیز');
			$('input#magiccharge').prop('disabled', false);
			$('input#magiccharge').attr('checked', false);
			$('input#NonCreditMTN').prop('disabled', false);
			$('input#NonCreditMTN').attr('checked', false);
			DefaultOperatorPhone = '093';
			if ($('input#magiccharge').is(':checked')) {
				DefaultOperator = 'MTN!';
			}
			if ($('input#NonCreditMTN').is(':checked')) {
				DefaultOperator = 'MTN#';
			}
		} else if (DefaultOperator == 'MCI') {
			DefaultOperatorPhone = '091';
		} else if (DefaultOperator == 'RTL') {
			$('label[for=magiccharge]').text('شارژ شورانگیز');
			$('input#magiccharge').prop('disabled', false);
			$('input#magiccharge').attr('checked', false);
			DefaultOperatorPhone = '092';
			if ($('input#magiccharge').is(':checked')) {
				DefaultOperator = 'RTL!';
			}
		}
		if (DefaultChargeKind == 'WiMax') {
			DefaultOperatorPhone = '094';
			DefaultOperator = 'WiMax';
		}
		if (DefaultChargeKind == 'InternetPackage') {
			var selectedType = $('.sim-type-container').find('label.active').data('type');
			if (selectedType != null && selectedType.includes('ثابت')) {
				DefaultOperatorPhone = '094';
			}
		}

		$('div#desc h1').text(KindTitle[Kinds.indexOf(DefaultChargeKind)]);
		$('div#desc p').text(KindDescription[Kinds.indexOf(DefaultChargeKind)]);

		$('form#chargeform').attr('class', DefaultOperator.replace('!', '').replace('#', ''));
		$('div.container').attr('class', 'container ' + DefaultChargeKind);
		$('div.operators').attr('class', 'operators ' + DefaultChargeKind);

		readCookie(DefaultChargeKind, DefaultOperatorPhone);

		$('input#EmailInput').val($.cookie('email'));
		$('input#dataChargeKind').val(DefaultChargeKind);
		$('div.input.text.account div.form-control.account span:last-child i').text(DefaultOperatorPhone);
		$('input#dataType').val(DefaultOperator);
		$('input#dataWebserviceId').val(WebserviceID);
		$('div.operator').removeClass('active');
		if (DefaultOperator.substring(0, 3) == 'MTN') {
			$('div.operator.MTN').addClass('active');
		} else {
			$('div.operator.' + DefaultOperator).addClass('active');
		}

		if (jQuery.inArray(DefaultChargeKind, ['Bill', 'GiftCard', 'Antivirus', 'InternetPackage']) > -1) {
			if (paymentGatewayStatus[DefaultChargeKind] == true) {
				$('div.container.' + DefaultChargeKind + ' div.payment-gateways').show();
				$('div.container.' + DefaultChargeKind + ' div.submit').show();
			} else {
				$('div.container.' + DefaultChargeKind + ' div.payment-gateways').hide();
				$('div.container.' + DefaultChargeKind + ' div.submit').hide();
			}
		} else {
			$('div.container.' + DefaultChargeKind + ' div.payment-gateways').show();
			$('div.container.' + DefaultChargeKind + ' div.submit').show();
		}

		$('form#chargeform').slideDown(200);
	}
	startup();

	$('input#magiccharge').change(function () {
		if ($('input#dataType').val() == 'MTN' || $('input#dataType').val() == 'MTN!' || $('input#dataType').val() == 'MTN#') {
			if ($(this).is(':checked')) {
				$('input#dataType').val('MTN!');
				$('input#NonCreditMTN').prop('disabled', true);
				$('input#NonCreditMTN').attr('checked', false);
			} else {
				$('input#NonCreditMTN').prop('disabled', false);
				$('input#dataType').val('MTN');
			}
		}

		if ($('input#dataType').val() == 'RTL' || $('input#dataType').val() == 'RTL!') {
			if ($(this).is(':checked')) {
				$('input#dataType').val('RTL!');
			} else {
				$('input#dataType').val('RTL');
			}
		}
	});
	$('input#NonCreditMTN').change(function () {
		if ($('input#dataType').val() == 'MTN' || $('input#dataType').val() == 'MTN!' || $('input#dataType').val() == 'MTN#') {
			if ($(this).is(':checked')) {
				$('input#dataType').val('MTN#');
				$('input#magiccharge').prop('disabled', true);
				$('input#magiccharge').attr('checked', false);
			} else {
				$('input#magiccharge').prop('disabled', false);
				$('input#dataType').val('MTN');
			}
		}
	});

	$('div.payment-gateways ul li').click(function () {
		$('div.payment-gateways p i').text($(this).data('tooltip'));
		$('input#dataIssuer').val($(this).attr('id'));
		$('div.payment-gateways ul li').removeClass('active');
		$(this).addClass('active');
	});
	$('div.operator[data-type]').click(function () {
		DefaultOperator = $(this).attr('data-type');
		if (DefaultChargeKind == 'InternetPackage') {
			paymentGatewayStatus[DefaultChargeKind] = true;
			setInternetPackage(DefaultOperator.toLowerCase());
		}
		startup();
	});

	$('form#chargeform input, form#chargeformselect').keypress(function (event) {
		if (DefaultChargeKind == 'Bill') {
			if (event.keyCode == 13) {
				event.preventDefault();
				return false;
			}
		}
	});

	// $('input[type="submit"]').click(function (e) {

	// 	e.preventDefault();
	// 	checkForm();
	// 	if (sendForm) {
	// 		const form_data={
	// 			amount:$('#dataAmountTemp').val()+0,
	// 			order_id:Math.floor(Math.random() * (10000000 - 1)) + 1,
	// 			callback:'https://charge.paystar.ir/payment',
	// 			sign:''

	// 		};
	// 		console.log(form_data)
			
	// 		$.ajax(
	// 			{
	// 			type: 'POST',
	// 			url: 'https://core.paystar.ir/api/pardakht/create',
	// 			data: form_data,
	// 			async: false,
	// 			contentType: "application/json",
	// 			headers: {
	// 				"Authorization": "Bearer " + ''
	// 			},
	// 			dataType: 'json',
	// 			success: function (data) {
	// 				$('.connecting p').text('انتقال به بانک ...');
	// 				doProccess(data);
	// 			},
	// 			error: function (e) {
	// 				$('.cover').fadeOut();
	// 				$('.connecting').fadeOut();
	// 				dialogue("در حال حاضر امکان برقرار ارتباط با سرور وجود ندارد. (خطا: " + e.status + ")<br>لطفاً بعداً مراجعه نمایید.", "خطا");
	// 				// console.log(e);
	// 				isTarabord = false;
	// 			}
	// 		});

	// 		// })
	// 		// $('.cover').fadeIn();
	// 		// $('.connecting p').text('دریافت اطلاعات ...');
	// 		// $('.connecting').attr('style', 'top:' + ($(window).height() - $('div.connecting').height()) / 2 + 'px; right:' + ($(window).width() - $('div.connecting').width()) / 2 + 'px; display:block!important;');
	// 	}
	// 	// if (sendForm) {
	// 	// $('.cover').fadeIn();
	// 	// $('.connecting p').text('دریافت اطلاعات ...');
	// 	// $('.connecting').attr('style', 'top:' + ($(window).height() - $('div.connecting').height()) / 2 + 'px; right:' + ($(window).width() - $('div.connecting').width()) / 2 + 'px; display:block!important;');
	// 	// 	$.ajax({
	// 	// 		type: 'POST',
	// 	// 		url: 'https://chr724.ir/services/v3/EasyCharge/' + action,
	// 	// 		data: $('form#chargeform').serialize(),
	// 	// 		async: false,
	// 	// 		contentType: "application/json",
	// 	// 		dataType: 'jsonp',
	// 	// 		crossDomain: true,
	// 	// 		success: function(data) {
	// 	// 			$('.connecting p').text('انتقال به بانک ...');
	// 	// 			doProccess(data);
	// 	// 		},
	// 	// 		error: function(e) {
	// 	// $('.cover').fadeOut();
	// 	// $('.connecting').fadeOut();
	// 	// dialogue("در حال حاضر امکان برقرار ارتباط با سرور وجود ندارد. (خطا: " + e.status + ")<br>لطفاً بعداً مراجعه نمایید.", "خطا");
	// 	// // console.log(e);
	// 	// isTarabord = false;
	// 	// 		}
	// 	// 	});
	// 	//     if ($('input#save-information').is(':checked')) {
	// 	//         $.cookie('cellphone', $('input#dataCellphone').val());
	// 	//         $.cookie('email', $('input#dataEmail').val());
	// 	//     }
	// 	// }
	// 	// return false;
	// });
	function doProccess(data) {
		if (data.status == 1) {
			window.location.replace(data.paymentInfo.url);
			if ($('#dataIssuer').val() == 'Zarinpal') {
				Zarinak.setAuthority(data.paymentInfo.paymentGateway.authority);
				Zarinak.open();
				$('.connecting p').text('لطفاً صبر کنید ...');
			} else {
				
			}
		} else {
			dialogue(data.errorMessage, "خطا");
			isTarabord = false;
			$('.cover').fadeOut();
			$('.connecting').fadeOut();
		}
	}

	var sendForm;
	function checkForm() {
		sendForm = false;
		var emptyCheck = true;
		var cellphoneCheck = true;
		var cellphoneFormatCheck = true;
		var emailCheck = true;
		var billCheck = true;
		var amountCheck = true;
		var cellphone = $('input#dataCellphone').val();
		var email = $('input#dataEmail').val();
		var divType = DefaultChargeKind;
		if (jQuery.inArray(DefaultChargeKind, ['PIN', 'TopUp', 'WiMax']) > -1) {
			divType = 'charge';
		}

		if (DefaultChargeKind == 'TopUp') {
			if (!isTarabord) {
				if (cellphone.length == 11 && !isNaN(cellphone) && jQuery.inArray(cellphone.substr(0, 3), ['090', '091', '092', '093', '099']) !== -1) {
					if (DefaultOperator == 'MTN' || DefaultOperator == 'MTN!') {
						if (jQuery.inArray(cellphone.substring(0, 3), ['093', '090']) == -1) {
							cellphoneFormatCheck = false;
						}
					} else if (DefaultOperator == 'MCI') {
						if (jQuery.inArray(cellphone.substring(0, 3), ['091', '099']) == -1) {
							cellphoneFormatCheck = false;
						}
					} else if (DefaultOperator == 'RTL') {
						if (jQuery.inArray(cellphone.substring(0, 4), ['0921', '0922']) == -1) {
							cellphoneFormatCheck = false;
						}
					}
				} else {
					cellphoneCheck = false;
				}
			}
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (email.length > 0 && !filter.test(email)) {
				emailCheck = false;
			}
		} else if (DefaultChargeKind == 'PIN') {
			if ((cellphone.length == 0 || jQuery.inArray(cellphone, ['093', '090', '091', '092']) != -1) && email.length == 0) {
				emptyCheck = false;
				dialogue('جهت استفاده از خدمات پشتیبانی، ایمیل یا شماره موبایل خود را وارد نمایید.', 'تذکر');
			} else {
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (email.length > 0 && !filter.test(email)) {
					emailCheck = false;
				}

				if (emailCheck && jQuery.inArray(cellphone, ['093', '090', '091', '092']) == -1) {
					if (cellphone.length == 11 && !isNaN(cellphone)) {
						if (jQuery.inArray(cellphone.substr(0, 3), ['090', '091', '092', '093', '099']) == -1) {
							cellphoneCheck = false;
						} else {
							cellphoneCheck = true;
						}
					} else {
						cellphoneCheck = false;
					}
				}
			}
		} else if (DefaultChargeKind == 'WiMax') {
			if (cellphone.length == 11 && !isNaN(cellphone)) {
				if (DefaultOperator == 'WiMax') {
					if (jQuery.inArray(cellphone.substr(0, 3), ['094']) == -1) {
						cellphoneCheck = false;
					}
				}
			} else {
				cellphoneCheck = false;
			}
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (email.length > 0 && !filter.test(email)) {
				emailCheck = false;
			}
		} else if (DefaultChargeKind == 'InternetPackage') {
			var cellphoneFormats = {
				"mtn": /(0)?9([0,3]{1})\d{8}/,
				"mci": /(0)?9([1,9]{1})\d{8}/,
				"tdlte": /(0)?94\d{8}/,
				"rtl": /^([0]{1})([9]{1})([2]{1})([1,2]{1})([0-9]{7})$/
			};
			var regex = cellphoneFormats[DefaultOperator.toLowerCase()];
			var selectedType = $('.sim-type-container').find('label.active').data('type');
			if (selectedType.includes('ثابت')) {
				regex = cellphoneFormats['tdlte'];
			}
			if (!isTarabord) {
				if (cellphone.length == 11 && !isNaN(cellphone) && jQuery.inArray(cellphone.substr(0, 3), ['090', '091', '092', '093', '099', '094']) !== -1) {
					if (!regex.test(cellphone)) {
						cellphoneFormatCheck = false;
					}
				} else {
					cellphoneCheck = false;
				}
			}
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (email.length > 0 && !filter.test(email)) {
				emailCheck = false;
			}
		} else if (DefaultChargeKind == 'Bill') {
			var billId = $('input#BillId').val();
			var paymentId = $('input#PaymentId').val();

			if (billId == '' || paymentId == '') {
				emptyCheck = true;
				dialogue('شناسه قبض و شناسه پرداخت را وارد نمایید', 'تذکر');
				return;
			}
			if (isNaN(billId) || isNaN(paymentId)) {
				emptyCheck = false;
				dialogue('شناسه قبض و شناسه پرداخت فقط باید عدد باشند.', 'تذکر');
			} else {
				if (!checkBillElement(billId)) {
					billCheck = false;
				} else {
					if (!checkBillElement(paymentId.substr(0, paymentId.length - 1))) {
						billCheck = false;
					} else {
						billCheck = true;
					}
				}

				if (cellphone.length == 0 && email.length == 0) {
					emptyCheck = false;
					dialogue('جهت استفاده از خدمات پشتیبانی، ایمیل یا شماره موبایل خود را وارد نمایید.', 'تذکر');
				} else {
					var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
					if (email.length > 0 && !filter.test(email)) {
						emailCheck = false;
					}

					if (cellphone.length > 0) {
						if (cellphone.length == 11 && !isNaN(cellphone)) {
							if (jQuery.inArray(cellphone.substr(0, 3), ['090', '091', '092', '093', '099']) == -1) {
								cellphoneCheck = false;
							} else {
								cellphoneCheck = true;
							}
						} else {
							cellphoneCheck = false;
						}
					}
				}
			}
		} else if (DefaultChargeKind == 'GiftCard') {
			if (cellphone.length == 0 && email.length == 0) {
				emptyCheck = false;
				dialogue('جهت استفاده از خدمات پشتیبانی، ایمیل یا شماره موبایل خود را وارد نمایید.', 'تذکر');
			} else {
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (email.length > 0 && !filter.test(email)) {
					emailCheck = false;
				}

				if (cellphone.length > 0) {
					if (cellphone.length == 11 && !isNaN(cellphone)) {
						if (jQuery.inArray(cellphone.substr(0, 3), ['090', '091', '092', '093', '099']) == -1) {
							cellphoneCheck = false;
						} else {
							cellphoneCheck = true;
						}
					} else {
						cellphoneCheck = false;
					}
				} else {
					dialogue('لطفاً شماره موبایل خودتان را وارد نمایید، اطلاعات گیفت کارت فقط به موبایل شما پیامک می شود.', 'تذکر');
					emptyCheck = false;
				}
			}
		} else {
			if (cellphone.length == 0 && email.length == 0) {
				emptyCheck = false;
				dialogue('جهت استفاده از خدمات پشتیبانی، ایمیل یا شماره موبایل خود را وارد نمایید.', 'تذکر');
			} else {
				var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				if (email.length > 0 && !filter.test(email)) {
					emailCheck = false;
				}

				if (cellphone.length > 0) {
					if (cellphone.length == 11 && !isNaN(cellphone)) {
						if (jQuery.inArray(cellphone.substr(0, 3), ['090', '091', '092', '093', '099']) == -1) {
							cellphoneCheck = false;
						} else {
							cellphoneCheck = true;
						}
					} else {
						cellphoneCheck = false;
					}
				}
			}
		}

		if (cellphoneFormatCheck == false) {
			if (DefaultChargeKind == 'TopUp' || DefaultChargeKind == 'InternetPackage') {
				if (!isTarabord) {
					Swal.fire({
						title: '',
						text: "شما " + (DefaultChargeKind === "TopUp" ? "شارژ مستقیم" : "بسته اینترنت") + " " + operatorsName[DefaultOperator] + " را انتخاب کردید اما شماره " + cellphone + " مربوط به اپراتور " + operatorsName[DefaultOperator] + " نیست!" +
							" آیا این شماره را به " + operatorsName[DefaultOperator] + " ترابرد کردید؟\n",
						type: 'warning',
						showCancelButton: true,
						confirmButtonColor: '#3085d6',
						cancelButtonColor: '#d33',
						confirmButtonText: 'بله ترابرد کردم.',
						cancelButtonText: 'خیر اشتباه شد.'
					}).then((result) => {
						if (result.value) {
							cellphoneFormatCheck = true;
							isTarabord = true;
							$('#dataIsTarabord').val(true);
							$(document).find('input[type="submit"]').trigger('click');
						} else {
							Swal.fire({
								title: '',
								text: 'شماره صحیح  اپراتور ' + operatorsName[DefaultOperator] + " را وارد کنید.",
								type: 'warning',
								confirmButtonText: 'باشه.',
							});
						}
					});
					return;
				}
			}
		}

		if (cellphoneCheck == false) {
			if ($('div#content div.' + divType + ' div.input.text.account div.message').length <= 0) {
				$('div#content div.' + divType + ' div.input.text.account').prepend('<div class="message error-message">شماره وارد شده صحیح نمی باشد.</div>');
			}
		} else {
			$('div#content div.' + divType + ' div.input.text.account div.message').remove();
		}

		if (emailCheck == false) {

			if ($('div#content div.' + divType + ' div.input.text.email div.message').length <= 0) {
				$('div#content div.' + divType + ' div.input.text.email').prepend('<div class="message error-message">این ایمیل صحیح نمی باشد.</div>');
			}
		} else {
			$('div#content div.' + divType + ' div.input.text.email div.message').remove();
		}

		if (DefaultChargeKind == 'PIN' || DefaultChargeKind == 'TopUp') {
			if ($('input#dataAmount').val() < 500 || $('input#dataAmount').val() > 50000) {
				if ($('div.input.text.amount div.message').length <= 0) {
					$('div.input.text.amount').prepend('<div class="message error-message">مبلغ وارد شده میبایست بزرگتر از 500 و کوچک تر از 50،000 تومان باشد.</div>');
					$('div.input.select.amount').prepend('<div class="message error-message">مبلغ وارد شده میبایست بزرگتر از 500 و کوچک تر از 50،000 تومان باشد.</div>');
				}
				amountCheck = false;
			} else {
				$('div.input.text.amount div.message').remove();
				amountCheck = true;
			}
		}
		if (emptyCheck && cellphoneCheck && emailCheck && amountCheck && cellphoneFormatCheck) {
			sendForm = true;
		} else {
			sendForm = false;
		}
	}

	setInterval((function () {
		if (DefaultChargeKind == 'TrafficCard' || DefaultChargeKind == 'GiftCard' || DefaultChargeKind == 'Antivirus') {
			$('input#dataCount').val($('.container.' + DefaultChargeKind + ' .' + DefaultChargeKind + ' input#count').val());
		}
		if (DefaultChargeKind == 'PIN') {
			$('input#dataCount').val($('.container.PIN div#content div.charge input#count').val());
			$('input#dataCount').val($('.container.PIN div#content div.charge input#count').val());
		}
		setAmount();

		if (DefaultChargeKind == 'TopUp') {
			if (DefaultOperator == 'MTN') {
				$('input#dataAmount').val($('input#dataAmountTopUpMTNTemp').val());
			} else {
				$('input#dataAmount').val($('input#dataAmountTemp').val());
			}
		} else if (DefaultChargeKind == 'PIN') {
			$('input#dataAmount').val($('input#dataAmountTemp').val());
			$('.container.PIN div#content div.charge .amount-value').text($('input#dataCount').val() * $('input#dataAmount').val());
		} else if (DefaultChargeKind == 'WiMax') {
			$('input#dataAmount').val($('input#dataAmountTopUpMTNTemp').val());
		}

		var divType = DefaultChargeKind;
		if (jQuery.inArray(DefaultChargeKind, ['PIN', 'TopUp', 'WiMax']) > -1) {
			divType = 'charge';
		}
		$('input#dataEmail').val($('div#content div.' + divType + ' input[type=email]').val());
		$('input#dataCellphone').val($('div#content div.' + divType + ' input.cellphone').val());
	}), 200);

	if ($("#dataAmountTemp").length) {
		$("#dataAmountTemp").ionRangeSlider({
			values: [1000, 2000, 5000, 10000, 20000],
			type: 'single',
			postfix: " تومان",
			prettify: false,
			from: 0,
			onLoad: function (obj) {
				$('#dataAmountTemp').val(1000);
			},
			onChange: function (obj) {
				$('#dataAmountTemp').val(obj.fromValue);
			},
		});
	}

	if ($("#dataAmountTopUpMTNTemp").length) {
		$("#dataAmountTopUpMTNTemp").ionRangeSlider({
			min: 500,
			max: 50000,
			type: 'single',
			postfix: " تومان",
			prettify: false,
			step: 500,
			from: 1000,
		});
	}

	if ($("input#count").length) {
		$("input#count").ionRangeSlider({
			min: 1,
			max: 5,
			type: 'single',
			postfix: " عدد",
			prettify: false,
			step: 1,
			from: 0,
			onChange: function (obj) {
				$('#dataCount').val(obj.fromNumber);
				setAmount();
			},
		});
	}

	function dialogue(content, title) {
		$('<div />').qtip({
			content: {
				text: content,
				title: {
					text: title,
					button: true
				}
			},
			position: {
				my: 'center', at: 'center',
				target: $(window)
			},
			show: {
				ready: true,
				modal: {
					on: true,
					blur: true
				}
			},
			hide: true,
			style: 'qtip-bootstrap qtip-shadow ui-tooltip-rounded helpModalClass',
			events: {
				render: function (event, api) {
					$('button', api.elements.content).click(function (e) {
						api.hide(e);
					});
				},
				hide: function (event, api) { api.destroy(); }
			}
		});
	}

	$('.help').qtip({
		content: {
			text: 'درحال بارگزاری ...',
			ajax: {
				url: "https://chr724.ir/pages/help",
				dataType: 'html'
			},
			title: {
				text: 'راهنما',
				button: true
			}
		},
		position: {
			my: 'center', // ...at the center of the viewport
			at: 'center',
			target: $(window)
		},
		show: {
			event: 'click', // Show it on click...
			solo: true, // ...and hide all other tooltips...
			modal: {
				effect: function (state) {
					$(this).fadeTo(1000, state ? 0.6 : 0, function () {
						if (!state) { $(this).hide(); }
					});
				}
			}
		},
		hide: false,
		style: 'qtip-bootstrap qtip-shadow ui-tooltip-rounded helpModalClass'
	});

	// By suppling no content attribute, the library uses each elements title attribute by default
	$('.support').qtip({
		content: '<p>پشتیبانی تلفنی: 88019574-021</p><p>ایمیل:support@paystar.ir</p>',
		style:
		{
			classes: 'qtip-green qtip-rounded qtip-shadow',
			width: '200px'
		},
		position:
		{
			my: 'top center',  // Position my top left...
			at: 'bottom center', // at the bottom right of...
		},
		hide: 'unfocus'
	});

	$('div.payment-gateways ul li').qtip({
		content: { attr: 'data-tooltip' },
		style:
		{
			classes: 'qtip-dark qtip-rounded qtip-shadow bank-qtip',
		},
		position:
		{
			my: 'bottom center',  // Position my top left...
			at: 'top center', // at the bottom right of...
		}
	});

	$('#logo').tinycircleslider({
		dotsSnap: true
		, radius: 70
		, dotsHide: false
		, interval: false
	});

	$('.dot').qtip({
		content: { attr: 'data-tooltip' },
		style:
		{
			classes: 'qtip-dark qtip-rounded qtip-shadow bank-qtip',
		},
		position:
		{
			my: 'bottom center',  // Position my top left...
			at: 'top center', // at the bottom right of...
		}
	});

	var eventType = "mousedown";
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		eventType = "touchstart";
	}

	$('.dot').on(eventType, function () {
		$('div.notify').hide();
		DefaultChargeKind = $(this).data('type');

		if (jQuery.inArray(DefaultChargeKind, ['Bill', 'GiftCard', 'Antivirus']) == -1) {
			DefaultOperator = 'MTN';
			$('input#magiccharge').prop('checked', false);
			$('input#magiccharge').prop('disabled', false);
			$('input#NonCreditMTN').prop('checked', false);
			$('input#NonCreditMTN').prop('disabled', false);
		}
		startup();
		$('.operators.InternetPackage').find('.operator[data-type=' + DefaultOperator + ']').trigger('click');
		if (DefaultChargeKind == 'TrafficCard') {
			setProducts('TrafficCard', '');
		}
	});

	$('input#CheckBill').click(function () {
		var billIdCheck = true;
		var paymentIdCheck = true;
		var billCheck = true;
		var emptyCheck = true;
		var emailCheck = true;
		var cellphoneCheck = true;
		var billId = $('input#BillId').val();
		var paymentId = $('input#PaymentId').val();
		var email = $('input#dataEmail').val();
		var cellphone = $('input#dataCellphone').val();

		if (billId == '' || paymentId == '') {
			emptyCheck = true;
			dialogue('شناسه قبض و شناسه پرداخت را وارد نمایید', 'تذکر');
			return;
		}
		if (isNaN(billId) || isNaN(paymentId)) {
			emptyCheck = false;
			dialogue('شناسه قبض و شناسه پرداخت فقط باید عدد باشند.', 'تذکر');
		} else {
			if (!checkBillElement(billId.replace(/^[0]+/g, ""))) {
				billIdCheck = false;
			}
			if (!checkBillElement(paymentId.substr(0, paymentId.length - 1).replace(/^[0]+/g, ""))) {
				paymentIdCheck = false;
			}
			if (!checkBillElement(billId.replace(/^[0]+/g, "") + paymentId.replace(/^[0]+/g, ""))) {
				billCheck = false;
			}
		}

		if (cellphone.length == 0 && email.length == 0) {
			emptyCheck = false;
			dialogue('جهت استفاده از خدمات پشتیبانی، ایمیل یا شماره موبایل خود را وارد نمایید.', 'تذکر');
		} else {
			var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			if (email.length > 0 && !filter.test(email)) {
				emailCheck = false;
			}

			if (cellphone.length > 0) {
				if (cellphone.length == 11 && !isNaN(cellphone)) {
					if (jQuery.inArray(cellphone.substr(0, 3), ['090', '091', '092', '093', '099']) == -1) {
						cellphoneCheck = false;
					} else {
						cellphoneCheck = true;
					}
				} else {
					cellphoneCheck = false;
				}
			}
		}

		if (emptyCheck && billIdCheck && paymentIdCheck && cellphoneCheck && emailCheck) {
			if (!billCheck) {
				dialogue('شناسه قبض با شناسه پرداخت همخوانی ندارد.', 'تذکر');
				return;
			}
			var billTypesPersian = ["آب", "بــرق", "گـــاز", "تلفن ثابت", "تلفن همراه", "عوارض شهرداری", "", "", "جریمه راهنمایی و رانندگی", "بیمه پاسارگاد", "سایر"];
			var billTypesEnglish = ["water", "electricity", "gas", "telephone", "cellphone", "mayoralty", "", "", "police", "pasargad", "others"];
			var billLength = billId.length;
			var paymentLength = paymentId.length;
			var billType = billId.substr((billLength - 2), 1) - 1;
			if (billType === -1) {
				billCoNumber = billId.substr((billLength - 5), 3);
				if (billCoNumber == 102) {
					billType = 9;
				} else {
					billType = 10;
				}
			}
			var billAmount = paymentId.substr(0, (paymentLength - 5)) * 1000; // Rial
			$('table#bill-info span#type').removeClass().addClass('bill').addClass(billTypesEnglish[billType]);
			$('table#bill-info span#type-title').text(billTypesPersian[billType]);
			$('table#bill-info span#amount').text(billAmount);
			$('table#bill-info span#bill-id').text(billId);
			$('table#bill-info span#payment-id').text(paymentId);
			$('table#bill-info span#email').text(email);
			$('table#bill-info span#cellphone').text(cellphone);
			$('div.container.Bill div.check').slideUp();
			$('div.container.Bill div.verify').slideDown();
			$('div.container.Bill div.payment-gateways').fadeIn();
			$('div.container.Bill div.submit').fadeIn();

			paymentGatewayStatus[DefaultChargeKind] = true;
		}

		if (billIdCheck == false) {
			if ($('div.input.text.billId div.message').length <= 0) {
				$('div.input.text.billId').prepend('<div class="message error-message">شناسه قبض معتبر نیست.</div>');
			}
		} else {
			$('div.input.text.billId div.message').remove();
		}

		if (paymentIdCheck == false) {
			if ($('div.input.text.paymentId div.message').length <= 0) {
				$('div.input.text.paymentId').prepend('<div class="message error-message">شناسه پرداخت معتبر نیست.</div>');
			}
		} else {
			$('div.input.text.paymentId div.message').remove();
		}

		if (emailCheck == false) {
			if ($('div.Bill div.Bill div.input.text.email div.message').length <= 0) {
				$('div.Bill div.Bill div.input.text.email').prepend('<div class="message error-message">این ایمیل صحیح نمی باشد.</div>');
			}
		} else {
			$('div.Bill div.Bill div.input.text.email div.message').remove();
		}

		if (cellphoneCheck == false) {
			if ($('div.Bill div.Bill div.input.text.account div.message').length <= 0) {
				$('div.Bill div.Bill div.input.text.account').prepend('<div class="message error-message">شماره وارد شده صحیح نمی باشد.</div>');
			}
		} else {
			$('div.Bill div.Bill div.input.text.account div.message').remove();
		}
	});

	function checkBillElement(element) {
		var checkSum = element.substr(element.length - 1, 1);
		element = element.substr(0, element.length - 1);
		element = element.split("");
		coefficient = 2;
		billLength = element.length;
		sum = 0;
		for (i = (billLength - 1); i >= 0; i--) {
			sum += coefficient * element[i];
			coefficient++;
			if (coefficient == 8) {
				coefficient = 2;
			}
		}

		calculatedCheckSum = sum % 11;
		if (calculatedCheckSum == 1 || calculatedCheckSum == 0) {
			calculatedCheckSum = 0;
		} else {
			calculatedCheckSum = 11 - calculatedCheckSum;
		}

		if (calculatedCheckSum == checkSum) {
			return true;
		}
		return false;
	}

	var GiftCardKinds = ["GooglePlay", "Microsoft", "iTunes", "Amazon", "XBox", "PlayStation", "PlayStationPlus"];
	var GiftCardKindTitle = ["Google Play", "Microsoft", "iTunes", "Amazon", "XBox", "PlayStation", "PlayStation Plus"];
	var GiftCardKindDescription =
		[
			"خرید نرم افزار، بازی و ..."
			, "خرید نرم افزار، بازی و ..."
			, "خرید موسیقی"
			, "خرید کتاب، فیلم، موسیقی و نرم افزار"
			, "خرید بازی، فیلم، موسیقی و نمایش های تلوزیونی"
			, "بازی آنلاین"
			, "بازی آنلاین"
		];

	$('div.operator.GiftCard').click(function () {
		$('div.GiftCard div.giftcard-types > select').attr('id', 'GiftCard' + $(this).data('type') + 'Types');
		setProducts('giftCard', $(this).data('type'));
		$('div#content div.GiftCard div.info div#operator').removeClass().addClass('operator GiftCard ' + $(this).data('type'));
		$('div#content div.GiftCard div.info div.title').text("گیفت کارت " + GiftCardKindTitle[GiftCardKinds.indexOf($(this).data('type'))]);
		$('div#content div.GiftCard div.info div.description').text(GiftCardKindDescription[GiftCardKinds.indexOf($(this).data('type'))]);
		$('div.container.GiftCard div.GiftCard div.operators').slideUp(500);
		$('div.container.GiftCard div.GiftCard div.buy').slideDown(1500);
		$('div.container.GiftCard div.payment-gateways').fadeIn();
		$('div.container.GiftCard div.submit').fadeIn();

		paymentGatewayStatus[DefaultChargeKind] = true;
	});

	$('div.GiftCard div.giftcard-types select').change(function () {
		$('.container.GiftCard .GiftCard input#UnitAmount').val($(this).find(':selected').data('price'));
		$('#dataProductId').val($(this).find(':selected').val());
	});

	$('div.back-button').click(function () {
		$('div.container.' + DefaultChargeKind + ' div.' + DefaultChargeKind + ' div.buy').hide();
		$('div.container.' + DefaultChargeKind + ' div.' + DefaultChargeKind + ' div.operators').show(500);
		$('div.container.' + DefaultChargeKind + ' div.payment-gateways').fadeOut();
		$('div.container.' + DefaultChargeKind + ' div.submit').fadeOut();
		paymentGatewayStatus[DefaultChargeKind] = false;
	});

	var AntivirusKinds = ["Eset", "BitDefender", "iTunes", "Amazon"];
	var AntivirusKindTitle = ["Eset", "BitDefender", "iTunes", "Amazon"];
	var AntivirusKindDescription =
		[
			"آنتی ویروس قدرتمند Eset",
			"آنتی ویروس قدرتمند BitDefender",
			"آنتی ویروس قدرتمند Kaspersky",
			"آنتی ویروس قدرتمند Norton"
		];

	$('div.operator.Antivirus').click(function () {
		$('div.Antivirus div.antivirus-types > select').attr('id', 'Antivirus' + $(this).data('type') + 'Types');
		setProducts('antivirus', $(this).data('type'));
		$('div#content div.Antivirus div.info div#operator').removeClass().addClass('operator Antivirus ' + $(this).data('type'));
		$('div#content div.Antivirus div.info div.title').text("آنتی ویروس " + AntivirusKindTitle[AntivirusKinds.indexOf($(this).data('type'))]);
		$('div#content div.Antivirus div.info div.description').text(GiftCardKindDescription[GiftCardKinds.indexOf($(this).data('type'))]);
		$('div.container.Antivirus div.Antivirus div.operators').slideUp(500);
		$('div.container.Antivirus div.Antivirus div.buy').slideDown(1500);
		$('div.container.Antivirus div.payment-gateways').fadeIn();
		$('div.container.Antivirus div.submit').fadeIn();

		paymentGatewayStatus[DefaultChargeKind] = true;
	});

	$('div.Antivirus div.antivirus-types select').change(function () {
		$('.container.Antivirus .Antivirus input#UnitAmount').val($(this).find(':selected').data('price'));
		$('#dataProductId').val($(this).find(':selected').val());
	});
	$('div.InternetPackage div.internetPackage-types select').change(function () {
		$('.container.InternetPackage .InternetPackage input#UnitAmount').val($(this).find(':selected').data('price'));
		$('#dataProductId').val($(this).find(':selected').val());
	});
	$('div.TrafficCard select#TrafficCardTypes').change(function () {
		$('.container.TrafficCard .TrafficCard input#UnitAmount').val($(this).find(':selected').data('price'));
		$('#dataProductId').val($(this).find(':selected').val());
	});

	$("input.cellphone").blur(function () {
		if ($(this).val().length == 11) {
			$("input.cellphone").each(function (index) {
				$(this).val($("input#dataCellphone").val());
			});
		}
	});

	$("input[type=email]").blur(function () {
		$("input[type=email]").each(function (index) {
			$(this).val($("input#dataEmail").val());
		});
	});

	$("input#BillId").keyup(function () {
		if ($(this).val().length >= $(this).attr('maxLength')) {
			$("input#PaymentId").focus();
		}
	});

	function setAmount() {
		$('.container.' + DefaultChargeKind + ' .' + DefaultChargeKind + ' .amount-value').text($('input#dataCount').val() * $('.container.' + DefaultChargeKind + ' .' + DefaultChargeKind + ' input#UnitAmount').val());
		$('input#dataAmount').val($('input#dataCount').val() * $('.container.' + DefaultChargeKind + ' .' + DefaultChargeKind + ' input#UnitAmount').val());
	}

	function setProducts(group, subGroup) {
		if (subGroup != '') {
			var jsonData = products[group][subGroup];
		} else {
			var jsonData = products[group];
		}

		groupPascalCase = group.charAt(0).toUpperCase() + group.slice(1);
		$('select#' + groupPascalCase + subGroup + 'Types').find('option').remove();
		$.each(jsonData, function (key, val) {
			$('select#' + groupPascalCase + subGroup + 'Types').append(
				$('<option data-price="' + val.price + '"></option>').val(val.id).html(val.name)
			);
		});
		$('.container.' + groupPascalCase + ' .' + groupPascalCase + ' input#UnitAmount').val(jsonData[0].price);
		$('#dataProductId').val(jsonData[0].id);
	}
	$('.InternetPackage .sim-type-container').on('click', 'label', function () {
		$(this).parent().children().removeClass('active');
		$(this).addClass('active');
		setInternetPackage(DefaultOperator.toLowerCase(), $(this).data('type'));
		startup();
	});
	$('#InternetPackageCategories').on('change', function () {
		setInternetPackage(DefaultOperator.toLowerCase(), $('.InternetPackage .sim-type-container').find('label.active').data('type'), $(this).find('option:selected').data('package-type'));
	});
	function setInternetPackage(operator, simType, category, packageId) {
		var packages = products.internetPackage[operator];
		if (simType == null) {
			//clear divs
			$('.InternetPackage').find('.sim-type-container').html('');
			$('form#chargeform').slideDown(200);
			$('.InternetPackage #payment').fadeIn();
			$('form#chargeform').find('.InternetPackage .buy').slideDown(200);
			$.each(packages, function (key, value) {
				$('.InternetPackage').find('.sim-type-container').append("<label class='radio-inline' data-type='" + key + "'><input type='radio' name='sim-type'/>" + key + "</label>");
			});
			$('.InternetPackage').find('.sim-type-container label').first().trigger('click');
		} else {
			if (category == null) {
				var internetTypes = packages[simType];
				//clear select
				$('#InternetPackageCategories').html('');
				$.each(internetTypes, function (key, value) {
					$('#InternetPackageCategories').append("<option data-package-type='" + key + "'>" + key + "</option>");
				});
				$('#InternetPackageCategories').first().trigger('change');
			} else {
				var packagesByCategory = packages[simType][category];
				//clear package
				$('#InternetPackageTypes').html('');
				if (packagesByCategory == null) {
					$('.package').html("بسته ای در این دسته وجود ندارد.");
				} else {
					$.each(packagesByCategory, function (key, value) {
						var option = $('<option data-price="' + value.price + '"></option>').val(value.id).html(value["name"]);
						$('#InternetPackageTypes').append(option);
					});
					$('.InternetPackage').find('#UnitAmount').val($('#InternetPackageTypes').find('option:first-child').data('price'));
					$('#dataCount').val(1);
					if (packageId == null) {
						$('#InternetPackageTypes').first().trigger('click');
					} else {
						$('#InternetPackageTypes').find('option[value="' + packageId + '"]').trigger('click');
					}
				}
			}
		}
	}

	$.ajax({
		type: 'GET',
		url: "https://chr724.ir/services/v3/EasyCharge/initializeDataCategorizedFormat",
		data: "{}",
		async: false,
		contentType: "application/json",
		dataType: 'jsonp',
		crossDomain: true,
		success: function (data) {
			products = data.products;
			paymentGateways = data.paymentGateways;
			initailize();
		},
		error: function (e) {
			dialogue("در حال حاضر امکان برقرار ارتباط با سرور وجود ندارد. (خطا: " + e.status + ")<br>لطفاً بعداً مراجعه نمایید.", "خطا");
			// console.log(e);
		}
	});

	function initailize() {
		$.each(products, function (key, val) {
			if (jQuery.isEmptyObject(val)) {
				$('#content fieldset > .' + key).html('<p class="service-caution">در حال حاضر در این دسته محصولی برای فروش وجود ندارد.</p>');
			}
		});

		$.each(paymentGateways, function (index, value) {
			$('div#content div.payment-gateways ul li#' + value).attr('style', 'display:inline-block;');
		});

		$('div#content div.payment-gateways ul').attr('style', 'width:' + paymentGateways.length * 55 + 'px;');

		$.each(products.giftCard, function (key, val) {
			if (val == '' || val == null) {
				$('.operator.GiftCard.' + key).hide();
			}
		});

		$.each(products.antivirus, function (key, val) {
			if (val == '' || val == null) {
				$('.operator.Antivirus.' + key).hide();
			}
		});

		$('.container').slideDown(300);

		$('div.notify').attr('style', 'left:' + ($('#logo').offset().left - 25) + 'px;' + 'top:' + (($('.container').height() - 100) / 2) + 'px');
		$('div.notify').fadeIn(1000).delay(8000).fadeOut(1000);
	}


	function readCookie(service, phonePrefix) {
		if (!$.cookie('cellphone')) {
			$('input#dataAccountTemp').val(phonePrefix);
		} else {
			if ((service == 'TopUp' || service == 'WiMax' || service == 'InternetPackage')) {
				if ($.cookie('cellphone').substring(0, 3) == phonePrefix.substring(0, 3)) {
					$('input#dataAccountTemp').val($.cookie('cellphone'));
				} else {
					$('input#dataAccountTemp').val(phonePrefix);
				}
			} else {
				$('input#dataAccountTemp').val($.cookie('cellphone'));
			}
		}
	}

	$("input.cellphone").keydown(function (e) {
		// Allow: backspace and delete
		if ($.inArray(e.keyCode, [46, 8]) !== -1 ||
			// Allow: Ctrl+A, Command+A
			(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
			// Allow: home, end, left, right, down, up
			(e.keyCode >= 35 && e.keyCode <= 40)) {
			// let it happen, don't do anything
			return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
			e.preventDefault();
		}
	});

	$("input.cellphone").keyup(function (e) {
		// Convert persian digits to english digits
		$(this).val(persianDigitsToEnglish($(this).val()));
	});

	$("input.cellphone").bind("paste", function (e) {
		// Convert persian digits to english digits
		$(this).val(persianDigitsToEnglish(e.originalEvent.clipboardData.getData('text')));
	});

	String.prototype.replaceArray = function (find, replace) {
		var replaceString = this;
		var regex;
		for (var i = 0; i < find.length; i++) {
			regex = new RegExp(find[i], "g");
			replaceString = replaceString.replace(regex, replace[i]);
		}
		return replaceString;
	};

	function persianDigitsToEnglish(persianDigits) {
		var firstPersianArray = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
		var secondPersianArray = ["۰", "۱", "۲", "٣", "٤", "٥", "٦", "٧", "۸", "۹"]; // just 3,4,5,6,7 is different
		var englishArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
		return persianDigits.replaceArray(firstPersianArray, englishArray).replaceArray(secondPersianArray, englishArray);
	}
});