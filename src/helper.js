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
