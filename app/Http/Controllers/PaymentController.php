<?php

namespace App\Http\Controllers;

use App\Constants\OrderStatus;
use App\Constants\PardakhtStatus;
use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function paymentRequest(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|size:11',
            'amount' => 'required|numeric|min:1000|max:500000',
        ], [
            'phone_number.required' => 'شماره تلفن الزامی می باشد',
            'phone_number.size' => 'شماره تلفن باید یازده رقم باشد',
            'amount.required' => 'مقدار اعتبار الزامی می باشد',
            'amount.numeric' => 'مقدار صحیح نمی باشد',
            'amount.digits.min' => 'مقدار باید حداقل 50000 ریال باشد',
            'amount.digits.max' => 'مقدار باید حداکثر 500000 ریال باشد',
        ]);


        $amount = $request->get('amount');
        
        $order = Order::create([
            'amount' => $amount,
            'phone_number' => $request->get('phone_number'),
            'status' => OrderStatus::INIT,
            'operator' => $request->get('type_operator')

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

        if (json_decode($res)->status == PardakhtStatus::SUCCESS) {
            $token = json_decode($res)->data->token;
            return view('sendToken')->with(compact('token'));
        } else {
            $message = [
                'title' => 'ایجاد پرداخت',
                'body' => 'مقدار های ورودی برای ایجاد پرداخت معتبر نمی باشد',
                'status' => 'danger'
            ];
            return view('callback')->with(compact('message'));
        }
    }

    public function callback(Request $request)
    {
        $order = Order::findOrFail($request->get('order_id'));
        if ($order->status == OrderStatus::INIT) {
            if ($request->get('status') == PardakhtStatus::SUCCESS) {
                $order->status = OrderStatus::PAYED;
                $order->save();

                return $this->paymentVerify($request, $order);
            } else {
                $order->status = OrderStatus::FAIL;
                $order->save();
                $message = [
                    'title' => 'شارژ تلفن همراه',
                    'body' => 'پرداخت انجام نشد',
                    'status' => 'danger'
                ];
                return view('callback')->with(compact('message'));
            }
        } else {
            $message = [
                'title' => 'شارژ تلفن همراه',
                'body' => 'تراکنش قبلا پردازش شده است',
                'status' => 'danger'
            ];
            return view('callback')->with(compact('message'));
        }
    }

    private function paymentVerify($request, $order)
    {
        $res = $this->curl(config('app.base_api_url') . '/pardakht/verify', [
            'ref_num' => $request->get('ref_num'),
            'amount' => $order->amount,
            'sign' => hash_hmac(
                'SHA512',
                $order->amount . '#' . $request->get('ref_num') . '#' . $request->get('card_number') . '#' . $request->get('tracking_code'),
                config('app.key_sign')
            ),
        ], [
            'Content-Type: application/json',
            'Authorization: Bearer ' . config('app.getway_id'),
        ]);

        if (json_decode($res)->status == PardakhtStatus::SUCCESS) {
            $order->status = OrderStatus::VERIFIED;
            $order->save();

            /**
             * ******************************************************
             * 
             *  TODO: call api to charge user phone_number
             * 
             * ******************************************************
            */
            $data=[
                'Phone' => $order->phone_number,
                'Price' => $order->amount,
                'OperatorName' => $order->operator
            ];
            return $this->chargePhoneNumber($data);
        }

        $order->status = OrderStatus::FAIL;
        $order->save();

        $message = [
            'title' => 'شارژ تلفن همراه',
            'body' => 'پرداخت وریفای نشد،مبلغ مورد نظر به کارت شما بازگشت داده میشود',
            'status' => 'danger'
        ];

        return view('callback')->with(compact('message'));
    }

    private function chargePhoneNumber($data)
    {
        $res_refresh_token = $this->curl(config('app.charge_api.url_refresh_token'),
            [
                'token' => config('app.charge_api.user_token'),
                'secret' => config('app.charge_api.secret_key')
            ]
            ,
            [
                'Content-Type' => 'application/json'
            ]
         );

         $token=json_decode($res_refresh_token)->data->token;

         $res = $this->curl(config('app.charge_api.base_url_api'),
            $data,
            [
                'Api-key' => config('app.charge_api.api_key'),
                'Content-Type' =>'application/json',
                'Authorization' => 'Bearer '.$token
            ]
         );

         dd($res);

         if(json_decode($res)->status = 'ok'){
            $message = [
                'title' => 'شارژ تلفن همراه',
                'body' => 'شارژ با موفقیت انجام شد',
                'status' => 'success'
            ];
            return view('callback')->with(compact('message'));
         }

         $message = [
            'title' => 'شارژ تلفن همراه',
            'body' => 'شارژ انجام نشد',
            'status' => 'danger'
        ];

        return view('callback')->with(compact('message'));
    }

    private function curl($url, $data = [], $headers = [], $method = 'POST')
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
