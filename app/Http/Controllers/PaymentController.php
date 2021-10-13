<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PaymentController extends Controller
{

    public function __construct($terminal = '')
		{
			$this->terminal = $terminal;
		}

    public function paymentRequest($data)
	{
        print_r($data);
        $result = $this->curl('https://card.paystar.ir/api/call', $data);
        print_r($result);
        if (is_object($result) && isset($result->status)) {
            $this->data = $result->data;
            if ($result->status == 'ok') {
                return $result->data;
            } else {
                $this->error = $result->message;
            }
        } else {
            $this->error = 'خطا در ارتباط با درگاه پی استار';
        }
        return false;
	}
    public function paymentVerify($data)
    {
        if ($data['amp;hashid']) {
            $result = $this->curl('https://card.paystar.ir/api/verify', array(
                    'token'  => $this->terminal,
                    'hashid' => $data['amp;hashid'],
                ));
            if (is_object($result) && isset($result->status)) {
                $this->data = $result->data;
                if ($result->data->status == 1) {
                    $this->txn_id = $data['amp;hashid'];
                    return true;
                } else {
                    $this->error = $result->message;
                }
            } else {
                $this->error = 'خطا در ارتباط با درگاه پی استار';
            }
        } else {
            $this->error = 'تراکنش توسط کاربر لغو شد';
        }
        return false;
    }

    public function curl($url, $data)
    {
        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => $data,
        ));

        $response = curl_exec($curl);

        curl_close($curl);

        return json_decode($response);
    }
}
