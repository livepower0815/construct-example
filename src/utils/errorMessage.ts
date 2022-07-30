export const messageType = {
  Toast: 'toast',
  Alert: 'alert',
  PassThrough: 'passThrough'
}

export const errorCodeEnum = {
  'api.too_much': {
    endpoint: [],
    default: {
      message: '公告已满5则，无法新增，请取消欲替换的公告',
      type: messageType.Alert
    }
  },
  'api.body.param_invalid.code': {
    endpoint: [
      {
        urlregex: 'v1/recovery',
        message: '手机号/验证码错误，请重新输入',
        type: messageType.Alert
      }
    ],
    default: {
      message: '手机号/验证码错误，请重新输入',
      type: messageType.Alert
    }
  },
  'api.data_exist': {
    endpoint: [],
    default: {
      message: '帐号重复',
      type: messageType.Alert
    }
  },
  'api.body.param_invalid.invite_code': {
    endpoint: [],
    default: {
      message: '非有效邀請碼，請重新輸入',
      type: messageType.Alert
    }
  },
  'api.data_invalid': {
    endpoint: [
      {
        urlregex: 'v1/verification/check',
        message: '手机号/验证码错误，请重新输入',
        type: messageType.Alert
      },
      {
        urlregex: 'v1/recovery',
        message: '手机号/验证码错误，请重新输入',
        type: messageType.Alert
      }
    ],
    default: {
      message: '資料輸入錯誤，请重新操作。',
      type: messageType.Alert
    }
  },
  'api.body.param_invalid.user_id': {
    endpoint: [],
    default: {
      message: '检举失败',
      type: messageType.Toast
    }
  },
  'api.body.param_invalid.block_id': {
    endpoint: [],
    default: {
      message: '新增失败',
      type: messageType.Toast
    }
  },
  'api.body.param_invalid.old_password': {
    endpoint: [],
    default: {
      message: '旧密码错误，请重新填写',
      type: messageType.Alert
    }
  },
  'api.unauthorized': {
    endpoint: [
      {
        urlregex: 'v1/login',
        message: '手机号/密码错误，请重新输入',
        type: messageType.PassThrough
      },
      {
        urlregex: 'v1/web/login',
        message: '手机号/密码错误，请重新输入',
        type: messageType.PassThrough
      }
    ]
  },
  'api.body.param_invalid.contact': {
    endpoint: [
      {
        urlregex: 'v1/contacts/search',
        message: '搜寻失败',
        type: messageType.Toast
      },
      {
        urlregex: 'v1/users/contacts',
        message: '新增失败',
        type: messageType.Toast
      }
    ]
  },
  'api.unknown': {
    endpoint: [
      {
        urlregex: 'v1/groups/.*/clear',
        message: '删除退出失败',
        type: messageType.Toast
      },
      //DELETE /v1/groups/${group_id}/members/${user_id}
      {
        urlregex: 'v1/groups/.*/members/.*',
        message: '删除失败',
        type: messageType.Toast
      },
      //DELETE: /v1/users/me
      {
        urlregex: 'v1/users/me',
        message: '删除失败',
        type: messageType.Toast
      }
    ]
  },
  'api.db.unknown': {
    //For custom endpoint message
    endpoint: [
      //POST /v1/groups/{id}/clear
      {
        urlregex: 'v1/groups/.*/clear',
        message: '删除退出失败',
        type: messageType.Toast
      },
      //DELETE /v1/groups/${group_id}/members/${user_id}
      {
        urlregex: 'v1/groups/.*/members/.*',
        message: '删除失败',
        type: messageType.Toast
      },
      //DELETE: /v1/users/me
      {
        urlregex: 'v1/users/me',
        message: '删除失败',
        type: messageType.Toast
      }
    ]
  },
  'api.body.param_invalid.phone': {
    endpoint: [
      // phone number not used
      {
        urlregex: 'v1/recovery',
        message: '手机号/验证码错误，请重新输入',
        type: messageType.Alert
      }
    ],
    default: {
      message: '手机号/验证码错误，请重新输入',
      type: messageType.Toast
    }
  },
  'api.outdated_version': {
    default: {
      message: '请更新版本',
      type: messageType.Alert
    }
  },
  'api.body.param_invalid.device_id': {
    endpoint: [
      {
        urlregex: 'v1/login/qrcode',
        message: '装置错误, 请重新确认',
        type: messageType.Toast
      },
      {
        urlregex: 'v1/login/qrcode/scan',
        message: '装置错误, 请重新确认',
        type: messageType.Toast
      },
      {
        urlregex: 'v1/login/qrcode/validate',
        message: '装置错误, 请重新确认',
        type: messageType.Toast
      }
    ]
  },
  'api.body.param_invalid.data': {
    endpoint: [
      {
        urlregex: 'v1/login/qrcode/scan',
        message: '扫码装置错误, 请重新确认',
        type: messageType.Toast
      },
      {
        urlregex: 'v1/login/qrcode/validate',
        message: '扫码装置错误, 请重新确认',
        type: messageType.Toast
      }
    ]
  },
  'api.body.param_invalid.passcode': {
    endpoint: [
      {
        urlregex: 'v1/login/qrcode/validate',
        message: '验证码错误，请重新输入',
        type: messageType.Toast
      }
    ]
  },
  'api.forbidden': {
    default: {
      message: '无此权限',
      type: messageType.PassThrough
    }
  },
  'api.noConnection': {
    default: {
      message: '网路连线异常',
      type: messageType.PassThrough
    }
  }
}

/**
 * @description map error 返回文案
 */
export const getErrorObj = (errorKey, url) => {
  const errorObj = errorCodeEnum[errorKey]
  if (!errorObj) return { message: 'error not match', type: messageType.Toast }
  if (errorObj.endpoint) {
    const findUrl = errorObj.endpoint.find(item => {
      const regexp = new RegExp(item.urlregex, 'i')
      return regexp.test(url)
    })
    return findUrl ? findUrl : errorObj.default || { message: 'error not match', type: messageType.Toast }
  } else {
    return errorObj.default || { message: 'error not match', type: messageType.Toast }
  }
}
