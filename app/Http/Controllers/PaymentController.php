<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    const INIT = 1;
    const PAYED = 2;
    // const VERIFIED = 3;
    // const FAIL = 4;

    public function curl($url, $data = [], $headers = [], $method = 'POST')
    {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_POSTFIELDS => json_encode($data),
            CURLOPT_HTTPHEADER => $headers,
        ]);

        $response = curl_exec($curl);

        curl_close($curl);

        return $response;
    }
    public function paymentRequest(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|digits:11|numeric',
            'amount' => 'required|numeric |min:4,max:5',
        ]);

        $amount = $request->input('amount');
        $order = Order::create([
            'amount' => $amount,
            'phone_number' => $request->input('phone_number'),
        ]);
        $res = $this->curl(config('app.base_api_url') . '/pardakht/create', [
            'amount' => $amount,
            'order_id' => $order->id,
            'callback' => 'http://localhost:8000/callback',
            'sign' => hash_hmac(
                'SHA512',
                $amount . '#' . $order->id . '#http://localhost:8000/callback',
                '14A9429F715E12D3B5BE98A5F94065ED11B26E87645B093D0067E75D7495F8440E580DA9142C5CDF3F23A8F91C5BB95B080E02679689B21B62DC1028A341D5C2554C11B780D58F56E5977CBA17B5DDC46EAE9A464E20276DFEC166B08B402B451AD8D5DBC9AAD116A2D64D56E5C94544E81B78F667F11E57F216662345CCB6CA'
            ),
        ], [
            'Content-Type: application/json',
            'Authorization: Bearer gk3y5y561d0w3y',
        ]);
        if (json_decode($res)->status == 1 && json_decode($res)->data->token) {
            if (is_null($order->status) || $order->status == self::INIT) {
                $order->update([
                    'ref_num' => json_decode($res)->data->ref_num,
                ]);
                $token = json_decode($res)->data->token;
                return view('sendToken')->with(compact('token'));

            } else if ($order->status == self::PAYED) {
                $payed='قبلا پرداخت پردازش شده است.';
                return view('callback')->width(compact('payed'));
            }
        } else {
            $failCreatePayment = 'مقدار های ورودی برای ایجاد پرداخت معتبر نمی باشد';
            return view('callback')->width(compact('failCreatePayment'));
        }
    }

    public function callback(Request $request)
    {
        $order = Order::findOrFail($request->input('order_id'));
        if ($request->input('status') == 1) {
            $this->paymentVerify($request->input('ref_num'), $order->amount, $order->id);
        } else {
            $fail = [
                'phone_number' => $order->phone_number,
                'message' => 'پرداخت ناموف بوده است',
            ];
            return view('callback')->with(compact('fail'));
        }
    }

    public function paymentVerify($ref, $amount, $id)
    {
        $res = $this->curl(config('app.base_api_url') . '/pardakht/verify', [
            'ref_num' => $ref,
            'amount' => $amount,
            'sign' => hash_hmac(
                'SHA512',
                intval($amount) . '#' . $id . '#http://localhost:8000/callback',
                '14A9429F715E12D3B5BE98A5F94065ED11B26E87645B093D0067E75D7495F8440E580DA9142C5CDF3F23A8F91C5BB95B080E02679689B21B62DC1028A341D5C2554C11B780D58F56E5977CBA17B5DDC46EAE9A464E20276DFEC166B08B402B451AD8D5DBC9AAD116A2D64D56E5C94544E81B78F667F11E57F216662345CCB6CA'
            ),
        ], [
            'Content-Type: application/json',
            'Authorization: Bearer gk3y5y561d0w3y',
        ]);
        $data = json_decode($res);
        if ($data->status == 1) {
            // call api to charge user phone
            $successVerifyPayment='شارژ با موفقیت انجام شد';
            return view('callback')->with(compact('successVerifyPayment'));
        }
        $failVerifyPayment='پرداخت با موفقیت وریفای نشد،مبلغ مورد نظر با کارت شما بازگشت داده خواهد شد';
        return view('callback')->with(compact('failVerifyPayment'));
    }

}
