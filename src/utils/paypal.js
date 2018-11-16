import axios from 'axios';
import HOSTS from '../env.config';
import { prelang } from './site';

// 获取PAYPAL支付参数
function getParams(order) {
  // PAYPAL支付后的回跳地址
  const redirectUrl = `${HOSTS.MOBILE}` + prelang('cashier/paypal/callback');

  // 未支付
  if (order.orderStatus === 'Unpaid') {
    return Promise.resolve({
      fee: 0,
      subId: order.subId,
      payAmount: order.orderAmountFormat,
      redirectUrl: redirectUrl,
    });
  }
  // 部分支付
  else {
    const url = `${HOSTS.ORDER_SERVICE}/api/orderPay/continueToPayView`;
    const params = { subId: order.subId };
    return axios.get(url, { params }).then(({ data }) => {
      return {
        subId: order.subId,
        fee: data.fee,
        payAmount: data.balanceAmount,
        redirectUrl: redirectUrl,
      };
    });
  }
}

// 处理PAYPAL支付
export default function handlePaypal(order, replace = false) {
  getParams(order).then(params => {
    const url = HOSTS.ORDER_SERVICE + '/api/orderPay/paypalPay';
    axios.get(url, { params }).then(({ data }) => {
      if (replace) {
        location.replace(data);
      } else {
        location.href = data;
      }
    });
  });
}
