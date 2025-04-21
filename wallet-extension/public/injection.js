// this script is injected into the webpage to provide the Stacks Wallet provider to the app
// it listens for messages from the app and forwards them to the background.js script for confirmation
// REFERENCE: https://wbips.netlify.app/wbips/WBIP001
const StacksWallet = {
  isStacksWallet: true,

  request: async function (method, params) {
    // todo: verify literal method is of correct type
    let supportedMethods = [
      "getAddresses",
      "stx_signMessage",
      "stx_transferStx",
      "stx_transferSip10Ft",
      "stx_signTransaction",
      "stx_signStructuredMessage",
      "stx_getAddresses",
      "stx_deployContract",
      "stx_callContract",
      "signPsbt",
      "sendTransfer",
    ];

    if (!supportedMethods.includes(method))
      return new Error(`Method ${method} is not supported by Stacks Wallet.`);

    // todo: verify params are valid based on method type

    // construct JSON RPC 2.0 request object
    const id = crypto.randomUUID();
    const rpcRequest = {
      jsonrpc: "2.0",
      id: id,
      method,
      params,
    };

    // dispatch custom event to content.js script with request details
    document.dispatchEvent(new CustomEvent("stackswallet_request", { detail: rpcRequest }));

    // return a Promise that resolves or rejects based on the response of wallet extension
    return new Promise(function (resolve, reject) {
      function handleMessageFromStacksWallet(event) {
        const response = event.data;
        if (response.id !== id) return;
        window.removeEventListener("message", handleMessageFromStacksWallet);
        if ("error" in response) {
          reject(response);
        } else {
          resolve(response);
        }
      }
      window.addEventListener("message", handleMessageFromStacksWallet);
    });
  },
};

window.StacksWallet = StacksWallet;

// registers the Stacks wallet extension provider with the global `wbip_providers` array
// REFERENCE: https://wbips.netlify.app/wbips/WBIP004
// this allows the stacks/connect v8 to recognize the provider and use it for confirming transactions
window.wbip_providers = window.wbip_providers || [];
window.wbip_providers.push({
  // `WbipProvider` type
  /** The global "path" of the provider (e.g. `"MyProvider"` if registered at `window.MyProvider`) */
  id: "StacksWallet",
  icon: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCABGAEYDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/igDzb4vfGH4XfAL4ceK/i78aPHfhr4afDTwRpv9q+KfGfi3U4NJ0XSbR7iCytUkuJ2DXF/qeo3VnpGiaTZpc6rrut3+naHo1lf6vqNlZXAB/F7+31/wdr6hFq2v/D3/AIJ4fCvS5tKtZdR0sftC/G7Tb6eXVVUahYrrPw7+Etreaa2mQLImn674c174k6pfXN7azNp3if4R6PcxyxkA/mj+MP8AwV4/4Kd/HbWb/WvH/wC3D+0TGdShSC70PwD8QtW+EXg2SJBtWMeBfhM/grwapKj95KmhCWY5aaSRiWIB8x6X+1X+1Vo2qLrejftK/H7StaV/OTV9N+MfxEstUE2cmUX9r4hiulkLfMz+aGJ6nPNFxpN7I++v2eP+C6//AAVa/Zu1W3vNA/a4+I3xO0QahZXeqeEv2gbwfHLRtYtbOQOdHfVPiINb8Z+HtLukHk3H/CE+KvC2oGHi3v4H2us80e6K9nP+V99uh/Wn/wAE4v8Ag6V/Z3/aK1PQPhV+2v4a0j9lb4p6m1pp1j8TrLVLi8/Z28T6tPNb2wGp6nrU0mv/AAa+03F1m3/4TG/8UeCdN03T7/VPEnxS0Z3tNPmq6ZLTW6Z/VjBPDdQxXFtLHPbzxpNDPC6yRSxSKHjkjkQlXR0YMjKSrKQQSDQIloA8x+NHxl+Gn7PXwp8e/G34x+LdN8DfDH4Z+GtR8V+MvFOrGdrXTNI02LewhtLOG51HVdUv52g0zQ9B0ezv9d8Ra3eafoOg6dqWs6jY2FwAf5Yv/BXD/grn8af+CoXxku7m8vNZ8Efs0eCtcuz8F/gmL0R2lhbxJc2Fv478dw2NxNYa58TNY0+4nF3eme+sfCtjqF54Z8L3JsJdV1PXAD8nrLSWkAeYlFOCqgfO4OPm5GI1PUZDFh0UAqxAOktrG3QqscEef7zLvbI77n3MPoCB2GOKmUuVXZdODnJRXV2/r+vM7nSNAkv9qiMMCQCNoI6jjGP/AK3r6V81mec08KneSSV+q7dPLzt6I+zybh6rjpRSpt3t01d/lp9/rc6ub4ZrNAXNpsbGd8SLGR17BdjE+rK3H4mvk/8AXCh7Xl9st7WcvP8Ar+tD7z/iH2JdHn9i7W/lfbXp/wAG55J4k8H3GkuSUYx5+WRVKlTngOvJVs9OSrcfxHaPrMszinilFqaafn5f1rufB5zw9VwLlzQatvdbf156W6n9QH/Bv1/wXO8Sfs0+OvCH7Fn7Xnj6TUP2ZfF15ZeGPhT8RfGWpsx/Z88SXUiWmi6NqWv6hKfsPwY1md4dMu01O4XRvhpdyWfiCG50LweniqRPpYy5lddT4ypFwlZ38ru+nT5JaJbJWSslZf6HYIIBHQ/UH8QeQR3B5B4PNUQfwr/8HaP7f2qX/iz4af8ABOz4d+IJbfQtD03SfjN+0OulaltGreINWNyPhT8Otdt7YxXCQ+HdGiuPiXqmi6kbvS9Xn8WfDHxBDbw6l4Vs7hQNz+NDQtEe6PnshKIRtBGQz4ByfUKCpIHDMwA+6ynlq4qnS+Jr7zuw+BqV7KKbv2XR/wBX9Pmd0nh+4fG1G+YZyQRx6k4wB/jgAnGeH+1qF7cy+9f5/oep/YGJ5b+zl3b1/wAv8i5Z6QsMq+cN53Y+bIUduAMe3XP0GcC6+NhOjJwetuj1Xr/X5EYXLqlPERjNNXaWq/rR+nzPo/4faJZzNGGij42n7ij0zkgZPX15wPrX4Vx1mtbDwqODa+K2/Z2/r/gH9OeGmSYfEypc8Y623X9bfn5n6DP+zAn/AArE+MF1yAar/wAI0fFf9jGwH2I6b/Zn9rfYP7UN5uGo/YP3v2g232D7b/xL8ra/8Tqv44/4jFX/ANb/AOxlgqv1T+1P7K+t+3ftvrX1n6r9Y+rey/3b23u+z9o6/sn7f4/9kP8ARP8A4lsp/wDEMv8AW7+1sM8f/Yf+sX9mfVY/V/7O+pfXfqX1729v7Q9h7/t/Z/Uvb/7Hf2X/AApn5zfEfRbaPzl2KQd6lSBznOVI+m4ex+gx/Y/Ama1sRCm5t62b89v+B/Wp/nZ4mZJh8NOryRjo5bLtv/wP+Dc+MPEVl9ivZFX7hbfEx54z0PYshBU+uA/yhlA/f8HJyoxb10R/KuY01TrySstXtof6bP8Awbfft/6n+2t+wbYeBPiHrsut/G79k/UNJ+EXjS/vrk3OseI/AE+nTXPwb8bao62Vun2i+8O6bq3gO6ubm71TWtd1j4a6z4q12+lv/EDFus84/gB/4KY/GXUf2jf+Civ7ZfxZv9Zl1+18QftD/ErTPDGpS43H4f8AgzxHeeB/hvZLtAHk6V4A8N+GtLgOAWgskZsuzE4Yip7Om5eR1YSl7WrGPmjz3wL4O+0Q20Zj5EabuP42AZ+n+2zY+ox1FflHFHEP1KM3z2snfXtf/K36X2/deCuElmMqd4c3Nbp3tr/T8tj6Gh+FdwmjjUv7Ouvsbym2F/8AZZvsZuACRard+X9nNwEHmfZ/M83bltm0DH46vEal/aH1P61R+scqq/V/bQddUXKyq+x5vaeyvp7Xl5L6c19/6BfhJX/sj+0nl+I+oup9WWPeFq/UniuVyeGWL9n9XeJSTk8P7R1lFOXJyq54t4o8MvpkzkQsArE8Ifxz0P4D8cYIr9dyDP8A+0KEfevddX+H9dPvPwjinhhZTiG1Dls/yb/Xe5o+DvEH9nTIrhlxgHK/TP8A+ocj3G415nFWRyx9GTUb3T7/AI/1+iPY4J4lhldeEZTUeVrfTbTy++7ufVSfHjxgfCA8H/8ACS33/CO/ZBZ/2b5VkX+w/wDQOGp/ZP7X/s3bi3/s7+0fsf2L/iW+R/Z3+iV/Pn/EIsq/t5Z3/ZFH+0fbvEfWb17fWNvrLw3tfqn1m/7z2/1dVfbr6zz/AFn98/6u/wCI/wDE3+qX+qf+smLeQfVPqf8AZ1sJ/uXMpfUfrv1f+0lgUv3H1L679V+pWy72P9nf7K/qz4B/8Ei/2vP25P2fPEX7RfwdufhZZ6Et94m0j4ceDPGXinW9I8afGLVPBt1NpuvW3g7+z/Cms+EtHjuPEFpqfgbw7e+OvFXhS01Dxvo+pWmuyeFvCMEXja4/pXgzhKvhcJTxMvZ043ahCTftKnJpJpKLio8ycFzyTcou6UbSf8ceInHmExePqYFe2qVOVSq1IJeype0XNCMnKcZyk4uNSXJGSjCcGpSm5Qj/AD96+0Wo2UV/BuaF0guIXaOWJmguVXbvilSOWJn3wkrKkckZXY6K2VH65hafs6UV1S/y/wCH+Z+CY6r7WtJ+bf3/APAsfuj/AMG637ePhr9hf9qb42az8RtU1GL4afEP4A3el32h204jstQ8c6B8RfAl14R1a6hbKSXWj6BqXj20spD80UOu3yrxM1dBxH4/+JvAOrWXxF8bWurxzjU7bxf4lg1MSrIsgv4dZvY7wSBvmV/tCyb1bB3E5wRxw45N0ZW7flrt/X6P1MrssRFv+Zfj/lufa/gLwS9s0ZaM49cHpxz78Y9QcjvX878e4WvVjV5FLXm2v+ev/A106n9ceGGMw1GVPncVbl3tf11t+S2d+5+nNv4g0Kf4T2vhpbKTz5fBltoQ0v7I5to5/wCzEtRe/aMG3McV2P7TSTz/AO0fOVZjGt5lh/DlPw64sjx8s0vD6is8/tP+0vrMPaTw31r6w8F9WTWIVaVBvByj7D6jy8y9q6Nov/T+r4zeHs/Bp8NKlUWcy4V/sJZL9QxDo0sb9R+oxzOOYyX1F4aniUsxp1I47+1uRRqfV4Yy6j8OeNPhab0yFLfPXon/ANYdzj3xxX9y8CYWtThTU1L7O9/Lv/Xc/wAvfE3GYerOq6bjvLb/AIH/AAbHi4+DV7FNvS3cfNn7p/z9fXr6mv3KGChWo2kk9Lapa/hb0/M/mitmdTD4luDslJ7N6+j6f8GyPvD9lv8A4JVftWftXrpuq+APBEfhf4bXxjk/4XB8TZ73wj8OZrMvhp/Dd2um6r4l+IAbZcWom+HXhrxXpun6pEtj4m1Hw6kv2tOVZDRcr8kVrfmf+XX5fkdk+K8RGm4c83pblT629UkuurT7X2P3D/aj8J+Lv+CRv/BKrUvgT8DP2qLKL47eMPiFFq2k6/renaZ4e+I+reHPiJqmnaH8TIf2cPAba14nuvAtr4dtdPTXrjxpqOoeJ08MT3XxL8TeH/EXhr4seLfhvJ4Z9zC4eGHpqlD4VeW1kr78q1sr9ut3u9PlMbjKmNxEsRVXvyUY2Tv8O3NK3vO3krpRXwrX+KXXPhdNYaFdCO28i3tobWGKGOPy4oo1urWGKKNFAVI0G1EReFUAKMDFdqaWn9f11OCSbd3fXzucT4R+GPifVtXubXw5b3sl6lhLPKtokryC1S4tY5CwjVm2CaWAEkY3FRnpmrkJH7z/APBS39ky/wDg7+35+1J4ak021ttP1f4t+J/iH4disAWs4vC/xPvG+IXh22hO0KHsdJ8SWun3Ua/LDeWlxBn90TXPWXMnF/1c7MPJxcZry/C+9vS5yfgj4eyXWh6ddpBl0hW1uvl+ZLm1CxS+Zxw0wVLoLz+6uIyR8wr4jOskp4tSUop32dr3/r/hrH6bw5xJUwDhao1t17O2/wBz6fcz9W/2C/2JLf8Aanf4g2fiDxjJ4J0L4YW3hcXc9jo8Ot63rF746k8VNodra2lzqWm21lYacvhLXbnVL+4knklH9kaTp9k32u/1XRflMv8AD3C4vEValafsIUlB+7TjOdSc+blSvKKjGPI5Tbu3eMUvecofb5x4t47LsHQpYal9aq4hzSU60qVKlTpKm5ylKMJylOTqRjTiuVJJzlJ8ihU9G/4dQfH7Uvihr/gaLS/Dtv4M0e+/0X4wa7q9lpnhbXtCnYy6df6d4f0yfxF4u/t28sllW78Mppl3baBrULabrPiW20m60jxNqv2OV8OPL5OmuRxg7KrZRUo/ZkoJykm1vHVRd48z+N/nud8ZrNqcar51UqR9+g7uVOb+KLm1GElF/DNcrmrSUIvmhH7e0X9kD/gn3+wrp+neLvj5rGh/E34jG1j1LR7b4haTaa5PqEis0cV74B+AGnNrlsdOmvbeBYPFHjgeNLLwxrsUN3D478KJIfL+shFUoqKd7eS/L/h/U+BqVKlebklyry1++Ttd+iWnQ8A/aA/4KrfE7xx9u0H4FaPJ8KPD8wa3/wCEz19NK8SfFDUbTb5Stb20y6r4M8D+faO9pdWtnH431qymhttS8O+OtHuFCI+b+v6/rzFGklvr5LRf5v8ADzR+J3xS8Lav8R/EV34h12/13xNrmozvqGv+KPFGraj4i8R+I9XljihN/rWv6xPeatrFxb2sENtFeahd3Fzgzx+Y0IipqVuurKlBO1lZLt/l+XqfMnxM+E4tNMtdPjtf399P5zqEyRaWo/iGOBLcyQmFujfZZwPuHFxl/WpjOnorL+v611Z+wH/Bv1+wl4Z+Lnx5+OPjb4meErfX/h14N+Elv4XZbkxqYvGnjPxl4e1bQmhikSQyBdD8E+KhNIq4iMkKs2ZgDrB8zfZL+v1MZrl9W/8Ah/0P3E/4LTfsep8SfCfh/wDaZ8MaJ/aXiD4b6YPDPj+3g2CafwJLfT3ml64sReIynw5rGoXkF/5KXd9NYa1DcFItO0O5lSa0XZSXTR+nf5frfoXh5pNwez1XTXqvmttellufzP2VjaacrpZxeSkjBnRWO0sowG24wGIwGIwWCqGztXHLKMZfErnfGcobO39dT0HwN8SviD8MNXn174ceN/FngTWbrT5tKutT8I6/qnh+8vNMuJIZ5dOvZtLurVr2yNzbWt4trdedBHf2VlfxIl7ZWlxDEaUYvmjeL/utrztp0uk7dy5VpTSjO00tUppSSe11dOztdX3tvo2j6U0D9v79qrw38NJfhnp3xLvbiKTUb+8T4h6+dQ8WfFy3sdSIe68PW3jnxVqesmLSUuGuLvTdR/so+NdCmujbaD4w0zSbLSdM07VOysr+rbb183+Hb7jCUYylzOKvpoklHT+6kl+j6q+p8hanqep63qeo63rmp6lrmt6xdPf6xretaheavrWsX8iqkuoavq+oz3Oo6pfzKiCa+v7m4u5tqmWZyM0h7FGgAoAqjw3b6/qFtbrp76hqN7Lb2VpAmWlmllkEVvbQp6ySyfKgwDJIzH5nY0waX+fof2p/8E7f2U7X9kv9nHw/4OvdPhs/Hni24bxz8RSv2eWS38RavaWkUOgrdRWlvM9t4c0q1stNeCWe+gTWF1q8sLp7TUEA64R5YpPd6v8AryWh51WfPNtfCtF6Lr83d662suh9walpun6zp1/pGrWNpqel6pZ3On6lpuoW0F7YahYXsL215Y31ncxy213Z3dvJJb3VrcxS29zBJJDPHJE7obM9j+VL/gop/wAE2Nf+AGs6n8Wvgvo+oa98ENWvJLnUtGsludR1T4WXl1ICLO8DGe9vPBk80hi0fXZWnl0pzDoniC4+1SaTqevctSm46rWP/pPr5dn8n3ffSrKfuy0n9yl5rs+6+a00X5B1kbBQAv8An+VACUAT21rc3txDaWdvNdXVxIsUFvbxPNPNK5wkcUUas8jsThVVSSegoA/pc/4Jof8ABNS8+GN3ov7QP7QGhQx+PY4odR+H/gHVLeOafwRLKm+DxD4gtZQ8dv4wgRlfTbB1N34WuD9pnNp4jt0j0nop07e9Lfou3m/PsunXXbkrVr3hB6fakuvkvLu+uy0vzfunW5yhQBHNDFcRSQTxRzQzI8UsUqLJHJHIpSSORGBV0dGZXVgQykgggmgD8nP2lP8AgkP+z78Zru98T/De4uPgh4wu5HubpPD2nxaj4G1KZ31C6neXwi89kNHubu4urWETaBqNhpVhZWSJB4enmeSRspUYvVe6/wAPu6fKy8jeGInHSXvrz+L7/wDNNn8/n7Vf7EnxI/ZJ1PTdO8ceJ/BHiL+1bVru2m8KXWvS7I1ySs8er6DpWx8YOI3lXJI3YGThKDhvb5X/AMkdUKsamiUk/O3+bPjRRuIUdSQBn3OKg0P1G/ZR/wCCW/xH/aa8P2HjtviR4J8IeB31P7FqbiDXdZ8VwQiLzGlsdHOm6bpF1KWKoI7jxFaIFLSGQlRG+saTkk7pJ+rf3afmYSrxjdcsm16Jffr+R/QB+y1/wTu/Z6/ZaNnrugaLL41+JEMCrL8Q/GCW97qdpPJBYJeHwxpqRjTfDNtNc2JubZ7aO6161jvb3T5PEN3Y3EkLbxpxjru+76enb87aXOadWc9HpHsv16vp5X1STPu8DHA4A4AHarMgoAD/2Q==",
  /** The name of the provider, as displayed to the user */
  name: "My Stacks Wallet",
  /** This is a fake, unverified website. */
  webUrl: "https://MyStacks.wallet",
  methods: [
    "getAddresses",
    "stx_signMessage",
    "stx_transferStx",
    "stx_transferSip10Ft",
    "stx_signTransaction",
    "stx_signStructuredMessage",
    "stx_getAddresses",
    "stx_deployContract",
    "stx_callContract",
    "signPsbt",
    "sendTransfer",
  ],
});

console.log(
  `[StacksWallet] ${
    window.StacksWallet.isStacksWallet
      ? "Stacks Wallet registered at `window.StacksWallet`!"
      : "Injection failed."
  }`
);
