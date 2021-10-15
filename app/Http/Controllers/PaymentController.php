<?php

namespace App\Http\Controllers;

use App\Constants\OrderStatus;
use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function paymentRequest(Request $request)
    {

        $request->validate([
            'phone_number' => 'required|digits:11|numeric',
            'amount' => 'required|numeric|min:5,max:6',
        ], [
            'phone_number.required' => 'شماره تلفن الزامی می باشد',
            'phone_number.digits' => 'شماره تلفن باید یازده رقم باشد',
            'phone_number.numeric' => 'شماره تلفن صحیح نمی باشد',
            'amount.required' => 'مقدار اعتبار الزامی می باشد',
            'amount.numeric' => 'مقدار صحیح نمی باشد',
            'amount.digits.min' => 'مقدار باید حداقل 100000 ریال باشد',
            'amount.digits.max' => 'مقدار باید حداکثر 1000000 ریال باشد',
        ]);
        $amount = $request->input('amount');
        $order = Order::create([
            'amount' => $amount,
            'phone_number' => $request->input('phone_number'),
            'status' => OrderStatus::INIT,
        ]);
        $res = $this->curl(config('app.base_api_url') . '/pardakht/create', [
            'amount' => $amount,
            'order_id' => $order->id,
            'callback' => config('app.callback_url'),
            'sign' => hash_hmac(
                'SHA512',
                $amount . '#' . $order->id . '#' . config('app.callback_url'),
                config('app.key_sign')
            ),
        ], [
            'Content-Type: application/json',
            'Authorization: Bearer ' . config('app.getway_id'),
        ]);
        if (json_decode($res)->status == 1) {
            $token = json_decode($res)->data->token;
            return view('sendToken')->with(compact('token'));
        } else {
            $failCreatePayment = [
                'title' => 'ایجاد پرداخت',
                'body' => 'مقدار های ورودی برای ایجاد پرداخت معتبر نمی باشد',
            ];
            return view('callback')->with(compact('failCreatePayment'));
        }
    }
    public function callback(Request $request)
    {
        $order = Order::findOrFail($request->input('order_id'));
        if ($order->status == OrderStatus::INIT) {
            if ($request->input('status') == 1) {
                $order->status = OrderStatus::PAYED;
                $order->save();
                $this->paymentVerify($request, $order);
            } else {
                $order->status = OrderStatus::FAIL;
                $order->save();
                $fail = [
                    'title' => 'شارژ تلفن همراه',
                    'body' => 'پرداخت انجام نشد',
                ];

                return view('callback')->with(compact('fail'));
            }
        } else if ($order->status == OrderStatus::PAYED) {
            $this->paymentVerify($request, $order);
        } else if ($order->status == OrderStatus::VERIFIED) {
            $verified = [
                'title' =>'شارژ تلفن همراه',
                'body' => ' پرداخت قبلا پردازش شده است.'
            ];
            return view('callback')->with(compact('verified'));
        } else {
            $order->status = OrderStatus::FAIL;
            $order->save();
            $fail = [
                'title' => 'شارژ تلفن همراه',
                'body' => 'پرداخت انجام نشد',
            ];
            return view('callback')->with(compact('fail'));
        }
    }
    public function paymentVerify($request, $order)
    {
        $res = $this->curl(config('app.base_api_url') . '/pardakht/verify', [
            'ref_num' => $request->input('ref_num'),
            'amount' => $order->amount,
            'sign' => hash_hmac(
                'SHA512',
                $order->amount . '#' . $request->input('ref_num') . '#' . $request->input('card_number') . '#' . $request->input('tracking_code'),
                config('app.key_sign')
            ),
        ], [
            'Content-Type: application/json',
            'Authorization: Bearer ' . config('app.getway_id'),
        ]);

        if (json_decode($res)->status == 1) {
            $order->status = OrderStatus::VERIFIED;
            $order->save();

            // call api to charge user phone_number
            $successVerifyPayment = [
                'title' => 'شارژ تلفن همراه',
                'body' => 'شارژ با موفقیت انجام شد'
            ];
            return view('callback')->with(compact('successVerifyPayment'));
        }

        $order->status = OrderStatus::INIT;
        $order->save();
        $failVerifyPayment = [
            'title' => 'شارژ تلفن همراه',
            'body' =>'پرداخت با موفقیت وریفای نشد،مبلغ مورد نظر به کارت شما بازگشت داده میشود'
        ];
        return view('callback')->with(compact('failVerifyPayment'));
    }
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
}
