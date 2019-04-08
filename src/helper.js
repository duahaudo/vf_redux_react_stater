// UI action
import * as constant from "./constant";

export const getTimeValue = (dateTime, zone) => {
  const gap = moment.tz(zone).utcOffset() - moment().utcOffset();
  return moment(dateTime).add(gap, 'm')
};

export const setTimeValue = (dateTime, zone, format) => {
  const gap = moment.tz(zone).utcOffset() - moment().utcOffset();
  const formattedValue = moment(dateTime).subtract(gap, 'm').format(format);
  return moment.tz(formattedValue, format, zone).toISOString()
};

export const correctDate = (date, format = constant.DateFormat) => {
  return moment(date, 'YYYY-MM-DD').format(format);
};

export const stripHtml = (html) => {
  // Create a new div element
  const temporalDivElement = document.createElement("div");
  // Set the HTML content with the providen
  temporalDivElement.innerHTML = html;
  // Retrieve the text property of the element (cross-browser support)
  return temporalDivElement.textContent || temporalDivElement.innerText || "";
};

const isFunction = (fnName) => {
  return typeof window[fnName] === typeof(Function);
};

const SafeNative = (key, value) => {
  if (isFunction("NativeFunc")) {
    NativeFunc(key, value, value);
  } else {
    // Native isn't ready yet, store the call for later when it is
    pendingNativeCalls.push({key: key, value: value});
    if (pendingNativeCalls.length === 1) {
      setTimeout(ExecutePendingQueue, 100);
    }
  }
};

const CreateCallbackEventObject = (callbackId, callbackData) => "{ callbackId:'" + callbackId + "', callbackData:'" + callbackData + "' }"

export const callbackClose = () => SafeNative('callbackEvent', CreateCallbackEventObject('Close', null));

