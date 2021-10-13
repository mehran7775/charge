<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Constants\OrderStatus;

class MainController extends Controller
{
    public function index()
    {
        return view('index');
    }

    public function callback(Request $request)
    {
        if($request->input('status')==0){
            // OrderStatus::INIT;
        }
        return view('callback');
    }

    public function pardakhtCreate(Request $request)
    {
        $res=$this->curl(config('app.base_api_url') . '/pardakht/create', [
            'amount' => 10000,
            'order_id' => 12222,
            'callback' => 'http://localhost:8000/callback',
            'sign' => hash_hmac(
                'SHA512',
                '10000#12222#http://localhost:8000/callback',
                '14A9429F715E12D3B5BE98A5F94065ED11B26E87645B093D0067E75D7495F8440E580DA9142C5CDF3F23A8F91C5BB95B080E02679689B21B62DC1028A341D5C2554C11B780D58F56E5977CBA17B5DDC46EAE9A464E20276DFEC166B08B402B451AD8D5DBC9AAD116A2D64D56E5C94544E81B78F667F11E57F216662345CCB6CA'
            ),
        ], [
            'Content-Type: application/json',
            'Authorization: Bearer gk3y5y561d0w3y'
        ]);
        
        if(json_decode($res)->status== 1){
            DB::table('orders')->insert(
                [
                    'ref_num' => json_decode($res)->data->ref_num,
                    'phone' => 'PHONE',
                    'amount' => 'AMOUNT'
                ]
           );

           $token = json_decode($res)->data->token;
           return view('sendtoken')->with(compact('token'));
        }
    }

    public function curl($url, $data = [], $headers=[] , $method = 'POST')
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
            CURLOPT_HTTPHEADER => $headers
        ]);

        $response = curl_exec($curl);

        curl_close($curl);
        
        return $response;
    }
}
