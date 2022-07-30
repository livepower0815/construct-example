import libphonenumber from 'google-libphonenumber'
import countrieNameMap from '@/utils/countrieNameMap.json'
const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance()
const countrieNameArray = Object.keys(countrieNameMap)

/**
 * @typedef {object} Rule
 * @description 驗證規則
 * @property {string} message - 驗證錯誤回傳訊息
 * @property {RegExp} regExp - 驗證正則
 */

/**
 * @function validateForm
 * @description 驗證表單所有欄位，使用 formRules 規則驗證 formData
 * @param {object} formData - 表單資料
 * @param {object} formRules - 表單欄位驗證規則
 * @returns {boolean}
 * */
export const validateForm = (formData: Recordable<any>, formRules: RulesMap): boolean => {
  const formRuleKeys = Object.keys(formRules)
  return formRuleKeys.every(key => {
    if (formData[key] !== undefined) {
      return checkRules(formRules[key], formData[key])
    }
    return true
  })
}

/**
 * @function checkRules
 * @description 確認 value 是否符合全部的 rule
 * @param {Array.<Rule>} rules - 多數驗證規則
 * @param {string|number} value - 需要驗證的值
 * @returns {boolean}
 */
export const checkRules = (rules: ValidateRule[], value): boolean => {
  return rules.every(rule => checkValid(rule, value))
}

/**
 * @function checkValid
 * @description 確認 value 是否符合 rule
 * @param {object<Rule>} rule - 驗證規則
 * @param {string|number} value - 需要驗證的值
 * @returns {boolean}
 */
export const checkValid = (rule: ValidateRule, value): boolean => {
  if (rule.validator && typeof rule.validator === 'function') {
    // 驗證器優先
    return rule.validator(value)
  } else if (rule.regExp) {
    // 使用正則
    return rule.regExp.test(value.toString())
  } else {
    throw new Error('Function:"checkValid" has no legal properties')
  }
}

/**
 * @description 驗證手機格式 by 國碼
 * @param {number} numberWithNoAreaCode - 手機號碼
 * @param {string} country - 國碼：CN
 * @returns {boolean} - 是否符合
 */
export const phoneValidator = (numberWithNoAreaCode, country) => {
  try {
    if (numberWithNoAreaCode.length >= 2 && countrieNameArray.includes(country)) {
      return phoneUtil.isValidNumberForRegion(phoneUtil.parse(numberWithNoAreaCode, country), country)
    }
    return false
  } catch (e) {
    console.error('phoneValidator::', e)
    return false
  }
}
