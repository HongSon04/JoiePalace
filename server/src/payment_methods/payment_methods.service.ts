import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import dayjs, { locale } from 'dayjs';
import { OnePayInternational, VNPay } from 'vn-payments';
import { MomoCallbackDto } from './dto/momo-callback.dto';
import { VNPayCallbackDto } from './dto/vnpay-callback.dto';
import { OnepayCallbackDto } from './dto/onepay-calback.dto';
import * as CryptoJS from 'crypto-js';
import axios from 'axios';
@Injectable()
export class PaymentMethodsService {
  constructor(private prismaService: PrismaService) {}

  // ? Other

  private onepayIntl = new OnePayInternational({
    paymentGateway: process.env.ONEPAY_PAYMENT_GATEWAY,
    merchant: process.env.ONEPAY_MERCHANT,
    accessCode: process.env.ONEPAY_ACCESS_CODE,
    secureSecret: process.env.ONEPAY_SECURE_SECRET,
  });

  private sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  // ! Payment Momo
  async momo(id: number, req, res) {
    try {
      const findDeposit = await this.prismaService.deposits.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!findDeposit) {
        throw new HttpException(
          { message: 'Không tìm thấy giao dịch' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (findDeposit.status === 'success') {
        throw new HttpException(
          { message: 'Giao dịch đã được thanh toán' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // If amount > 50000000 => error
      if (findDeposit.amount > 50000000) {
        throw new HttpException(
          {
            message:
              'Số tiền cọc không được lớn hơn 50.000.000 do Momo giới hạn',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      var accessKey = process.env.MOMO_ACCESS_KEY;
      var secretKey = process.env.MOMO_SECRET_KEY;
      var orderInfo = 'Thanh toán tiền cọc';
      var partnerCode = process.env.MOMO_PARTNER_CODE;
      var redirectUrl = `${process.env.WEB_URL}payment-methods/momo-callback?deposit_id=${id}`;
      var ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
      var requestType = 'payWithMethod';
      var amount = Number(findDeposit.amount);
      var orderId = Date.now().toString();
      var requestId = orderId;
      var extraData = '';
      var paymentCode =
        'T8Qii53fAXyUftPV3m9ysyRhEanUs9KlOPfHgpMR0ON50U10Bh+vZdpJU7VY4z+Z2y77fJHkoDc69scwwzLuW5MzeUKTwPo3ZMaB29imm6YulqnWfTkgzqRaion+EuD7FN9wZ4aXE1+mRt0gHsU193y+yxtRgpmY7SDMU9hCKoQtYyHsfFR5FUAOAKMdw2fzQqpToei3rnaYvZuYaxolprm9+/+WIETnPUDlxCYOiw7vPeaaYQQH0BF0TxyU3zu36ODx980rJvPAgtJzH1gUrlxcSS1HQeQ9ZaVM1eOK/jl8KJm6ijOwErHGbgf/hVymUQG65rHU2MWz9U8QUjvDWA==';
      var orderGroupId = '';
      var autoCapture = true;
      var lang = 'vi';

      var rawSignature =
        'accessKey=' +
        accessKey +
        '&amount=' +
        amount +
        '&extraData=' +
        extraData +
        '&ipnUrl=' +
        ipnUrl +
        '&orderId=' +
        orderId +
        '&orderInfo=' +
        orderInfo +
        '&partnerCode=' +
        partnerCode +
        '&redirectUrl=' +
        redirectUrl +
        '&requestId=' +
        requestId +
        '&requestType=' +
        requestType;
      //puts raw signature
      console.log('--------------------RAW SIGNATURE----------------');
      console.log(rawSignature);
      //signature
      const crypto = require('crypto');
      var signature = crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');
      console.log('--------------------SIGNATURE----------------');
      console.log(signature);

      //json object send to MoMo endpoint
      const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: 'Test',
        storeId: 'MomoTestStore',
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: requestType,
        autoCapture: autoCapture,
        extraData: extraData,
        orderGroupId: orderGroupId,
        signature: signature,
      });
      //Create the HTTPS objects
      const https = require('https');
      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };
      //Send the request and get the response
      const req = await https.request(options, (ress) => {
        console.log(`Status: ${ress.statusCode}`);
        console.log(`Headers: ${JSON.stringify(ress.headers)}`);
        ress.setEncoding('utf8');
        ress.on('data', (body) => {
          const response = JSON.parse(body);
          if (ress.statusCode === HttpStatus.CREATED && response.payUrl) {
            return res.status(HttpStatus.CREATED).json({
              message: 'Tạo đơn đặt cọc thành công',
              status: HttpStatus.OK,
              payUrl: response.payUrl,
            });
          } else {
            return res.status(400).json({
              message: 'Tạo đơn đặt cọc thất bại',
              status: HttpStatus.BAD_REQUEST,
            });
          }
        });
        ress.on('end', () => {
          console.log('No more data in response.');
        });
      });

      req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
      });
      // write data to request body
      console.log('Sending....');
      req.write(requestBody);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ payment_method.service.ts -> momo', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ? Callback Momo
  async callbackMomo(query: MomoCallbackDto, res) {
    try {
      if (Number(query.resultCode) === 0) {
        const findDeposit = await this.prismaService.deposits.findFirst({
          where: {
            id: Number(query.deposit_id),
          },
        });
        if (!findDeposit) {
          throw new HttpException(
            { message: 'Không tìm thấy giao dịch' },
            HttpStatus.BAD_REQUEST,
          );
        }
        await this.prismaService.deposits.update({
          where: {
            id: Number(query.deposit_id),
          },
          data: {
            status: 'success',
            payment_method: 'momo',
          },
        });
        // ? Find booking detail by deposit_id
        const findBookingDetail =
          await this.prismaService.booking_details.findFirst({
            where: {
              deposit_id: Number(query.deposit_id),
            },
          });
        await this.prismaService.bookings.update({
          where: {
            id: Number(findBookingDetail.booking_id),
          },
          data: {
            is_deposit: true,
          },
        });
        // ? Redirect to success page
        this.successPayment(res);
      } else {
        // ? Redirect to fail page
        this.failPayment(res);
      }
    } catch (error) {
      console.log('Lỗi từ payment_method.service.ts -> callbackVNPay', error);
      return this.failPayment(res);
    }
  }

  // ! Payment VNPay
  async vnpay(id: number, req, res) {
    try {
      const findDeposit = await this.prismaService.deposits.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!findDeposit) {
        throw new HttpException(
          { message: 'Không tìm thấy giao dịch' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (findDeposit.status === 'success') {
        throw new HttpException(
          { message: 'Giao dịch đã được thanh toán' },
          HttpStatus.BAD_REQUEST,
        );
      }

      process.env.TZ = 'Asia/Ho_Chi_Minh';

      let date = new Date();
      let createDate = dayjs(date).format('YYYYMMDDHHmmss');

      let ipAddr =
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

      let tmnCode = process.env.VNP_TMN_CODE;
      let secretKey = process.env.VNP_HASH_SECRET;
      let vnpUrl = process.env.VNP_URL;
      let returnUrl = `${process.env.WEB_URL}payment-methods/vnpay-callback?deposit_id=${id}`;
      let orderId = dayjs(date).format('DDHHmmss');
      let amount = findDeposit.amount;
      let bankCode = '';

      let locale = 'vn';

      let currCode = 'VND';
      let vnp_Params = {};
      vnp_Params['vnp_Version'] = '2.1.0';
      vnp_Params['vnp_Command'] = 'pay';
      vnp_Params['vnp_TmnCode'] = tmnCode;
      vnp_Params['vnp_Locale'] = locale;
      vnp_Params['vnp_CurrCode'] = currCode;
      vnp_Params['vnp_TxnRef'] = orderId;
      vnp_Params['vnp_OrderInfo'] =
        `Thanh toán tiền cọc cho ID: ${findDeposit.transactionID}`;
      vnp_Params['vnp_OrderType'] = 'other';
      vnp_Params['vnp_Amount'] = amount * 100;
      vnp_Params['vnp_ReturnUrl'] = returnUrl;
      vnp_Params['vnp_IpAddr'] = ipAddr;
      vnp_Params['vnp_CreateDate'] = createDate;
      if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
      }

      vnp_Params = this.sortObject(vnp_Params);

      let querystring = require('qs');
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require('crypto');
      let hmac = crypto.createHmac('sha512', secretKey);
      let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
      vnp_Params['vnp_SecureHash'] = signed;
      vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

      res.redirect(vnpUrl);
      if (vnpUrl) {
        return res.status(HttpStatus.CREATED).json({
          message: 'Tạo đơn đặt cọc thành công',
          status: HttpStatus.OK,
          payUrl: vnpUrl,
        });
      } else {
        return res.status(400).json({
          message: 'Tạo đơn đặt cọc thất bại',
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ payment_method.service.ts -> vnpay', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ? Callback VNPay
  async callbackVNPay(query: VNPayCallbackDto, res) {
    try {
      if (query.vnp_ResponseCode === '00') {
        await this.prismaService.deposits.update({
          where: {
            id: Number(query.deposit_id),
          },
          data: {
            status: 'success',
            payment_method: 'vnpay',
          },
        });

        // ? Find booking detail by deposit_id
        const findBookingDetail =
          await this.prismaService.booking_details.findFirst({
            where: {
              deposit_id: Number(query.deposit_id),
            },
          });
        await this.prismaService.bookings.update({
          where: {
            id: Number(findBookingDetail.booking_id),
          },
          data: {
            is_deposit: true,
          },
        });
        this.successPayment(res);
      } else {
        this.failPayment(res);
      }
    } catch (error) {
      console.log('Lỗi từ payment_method.service.ts -> callbackVNPay', error);
      return this.failPayment(res);
    }
  }

  // ! Payment OnePay
  async onePay(id: number, req, res) {
    try {
      const findDeposit = await this.prismaService.deposits.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!findDeposit) {
        throw new HttpException(
          { message: 'Không tìm thấy giao dịch' },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (findDeposit.status === 'success') {
        throw new HttpException(
          { message: 'Giao dịch đã được thanh toán' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkoutData = {
        amount: findDeposit.amount,
        customerId: findDeposit.transactionID,
        currency: 'VND',
        returnUrl: `${process.env.WEB_URL}payment-methods/onepay-callback?deposit_id=${id}`,
        againLink: `${process.env.WEB_URL}payment-methods/onepay/${id}`,
        clientIp:
          req.headers['x-forwarded-for'] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          req.connection.socket.remoteAddress,
        locale: 'vn',
        orderId: findDeposit.transactionID,
        transactionId: findDeposit.transactionID,
        vpcCommand: 'pay',
      };

      this.onepayIntl
        .buildCheckoutUrl(checkoutData as any)
        .then((checkoutUrl) => {
          return res.status(HttpStatus.CREATED).json({
            message: 'Tạo đơn đặt cọc thành công',
            status: HttpStatus.OK,
            payUrl: checkoutUrl.href,
          });
          // res.end();
        })
        .catch((err) => {
          console.log('Lỗi từ payment_method.service.ts -> onepay', err);
          return res.status(400).json({
            message: 'Tạo đơn đặt cọc thất bại',
            status: HttpStatus.BAD_REQUEST,
          });
        });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ payment_method.service.ts -> onepay', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ? Callback OnePay
  async callbackOnePay(query: OnepayCallbackDto, res) {
    console.log('query', query);
    if (query.vpc_TxnResponseCode === '0') {
      await this.prismaService.deposits.update({
        where: {
          id: Number(query.deposit_id),
        },
        data: {
          status: 'success',
          payment_method: 'onepay',
        },
      });

      // ? Find booking detail by deposit_id
      const findBookingDetail =
        await this.prismaService.booking_details.findFirst({
          where: {
            deposit_id: Number(query.deposit_id),
          },
        });
      await this.prismaService.bookings.update({
        where: {
          id: Number(findBookingDetail.booking_id),
        },
        data: {
          is_deposit: true,
        },
      });
      this.successPayment(res);
    } else {
      this.failPayment(res);
    }
  }

  // ! Payment ZaloPay
  async zaloPay(id, req, res) {
    try {
      const findDeposit = await this.prismaService.deposits.findFirst({
        where: {
          id: Number(id),
        },
      });
      if (!findDeposit) {
        throw new HttpException(
          { message: 'Không tìm thấy giao dịch' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // if (findDeposit.status === 'success') {
      //   throw new HttpException(
      //     { message: 'Giao dịch đã được thanh toán' },
      //     HttpStatus.BAD_REQUEST,
      //   );
      // }
      const config = {
        app_id: process.env.ZALO_APP_ID,
        key1: process.env.ZALO_KEY_1,
        key2: process.env.ZALO_KEY_2,
        endpoint: process.env.ZALO_ENDPOINT,
      };
      const embed_data = {
        preferred_payment_method: [],
        redirecturl: ``,
      };

      const items = [{}];
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
        app_id: config.app_id,
        app_trans_id: `${dayjs(Date.now()).format('YYMMDD')}-${findDeposit.transactionID}-${transID}`,
        app_user: 'user123',
        app_time: Date.now(), // miliseconds
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: findDeposit.amount,
        description: `Thanh toán tiền cọc cho ID: ${findDeposit.transactionID}`,
        bank_code: '',
        mac: '',
        callback_url: `${process.env.WEB_URL}payment-methods/zalopay-callback?deposit_id=${id}`,
      };

      const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;
      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
      axios
        .post(config.endpoint, null, { params: order })
        .then(({ data }) => {
          if (data.return_code === 1) {
            return res.status(HttpStatus.CREATED).json({
              message: 'Tạo đơn đặt cọc thành công',
              status: HttpStatus.OK,
              payUrl: data.order_url,
            });
          } else {
            return res.status(HttpStatus.BAD_REQUEST).json({
              status: HttpStatus.BAD_REQUEST,
              message: { data },
            });
          }
        })
        .catch((err) => console.log(err));

      const result = await axios.post(config.endpoint, null, { params: order });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log('Lỗi từ payment_method.service.ts -> zaloPay', error);
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra, vui lòng thử lại sau !',
      );
    }
  }

  // ? Callback ZaloPay
  async callbackZaloPay(query, req, res) {  
    let result = {} as any;
    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, process.env.ZALO_KEY_2).toString();

      // kiểm tra callback hợp lệ (đến từ ZaloPay server)
      if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, process.env.ZALO_KEY_2 as any);
        dataJson['app_trans_id'];

        result.return_code = 1;
        result.return_message = 'success';
        await this.prismaService.deposits.update({
          where: {
            id: Number(query.deposit_id),
          },
          data: {
            status: 'success',
            payment_method: 'zalopay',
          },
        });

        const findBookingDetail =
          await this.prismaService.booking_details.findFirst({
            where: {
              deposit_id: Number(query.deposit_id),
            },
          });
        await this.prismaService.bookings.update({
          where: {
            id: Number(findBookingDetail.booking_id),
          },
          data: {
            is_deposit: true,
          },
        });

        this.successPayment(res);
      }
    } catch (ex) {
      result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
      result.return_message = ex.message;
    }
    console.log('result', result);
    res.json(result);
  }

  // *********************************************************
  // ! Payment Success
  private async successPayment(res) {
    res.redirect(`${process.env.WEB_URL}thanh-toan-thanh-cong`);
  }

  // ! Payment Fail
  private async failPayment(res) {
    res.redirect(`${process.env.WEB_URL}thanh-toan-that-bai`);
  }
}
