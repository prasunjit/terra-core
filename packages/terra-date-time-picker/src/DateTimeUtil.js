import moment from 'moment-timezone';

class DateTimeUtil {
  static createSafeDate(date) {
    if (!date || (date && date.length === 0)) {
      return null;
    }

    const momentDate = moment(date);
    return momentDate.isValid() ? momentDate : null;
  }

  // Check if the iSODate contains the time part.
  // The time part in a valid ISO 8601 string is separated from the date part either by a space or 'T'.
  static hasTime(iSODate) {
    if (!DateTimeUtil.createSafeDate(iSODate)) {
      return false;
    }

    let timePart = '';

    if (iSODate.indexOf(' ') > 0) {
      timePart = iSODate.split(' ')[1];
    }

    if (iSODate.indexOf('T') > 0) {
      timePart = iSODate.split('T')[1];
    }

    return timePart.length > 0;
  }

  static formatISODateTime(iSODate, format) {
    if (!iSODate || iSODate.length <= 0) {
      return '';
    }

    const momentDate = moment(iSODate);
    return DateTimeUtil.formatMomentDateTime(momentDate, format);
  }

  static formatMomentDateTime(momentDate, format) {
    return momentDate && momentDate.isValid() ? momentDate.format(format) : '';
  }

  static syncDateTime(momentDate, iOSdate, time) {
    const date = moment(iOSdate);
    let newDate = momentDate ? momentDate.clone() : date;

    // If momentDate was null, a new moment date needs to be created and sync'd with the entered time.
    if (momentDate === null && time && time.length === 5) {
      newDate = DateTimeUtil.updateTime(newDate, time);
    }

    return newDate.year(date.get('year')).month(date.get('month')).date(date.get('date'));
  }

  static updateTime(momentDate, time) {
    const newDate = momentDate.clone();
    const date = moment(time, 'HH:mm', true);

    return newDate.hour(date.get('hour')).minute(date.get('minute'));
  }

  static isValidDateTime(date, time, format) {
    return DateTimeUtil.isValidDate(date, format) && DateTimeUtil.isValidTime(time);
  }

  static isValidDate(date, format) {
    const dateMoment = moment(date, format);
    return dateMoment.isValid();
  }

  static isValidTime(time) {
    const timeMoment = moment(time, 'HH:mm', true);
    return timeMoment.isValid();
  }

  static checkAmbiguousTime(dateTime) {
    if (!dateTime || !dateTime.isValid()) {
      return false;
    }

    const localizedDateTime = moment.tz(dateTime.format(), moment.tz.guess());
    const clonedDateTime = localizedDateTime.clone();

    clonedDateTime.add(1, 'hour');

    return localizedDateTime.isDST() && !clonedDateTime.isDST();
  }

  static getDaylightSavingTZDisplay() {
    return moment('2017-07-01').tz(moment.tz.guess()).format('z');
  }

  static getStandardTZDisplay() {
    return moment('2017-01-01').tz(moment.tz.guess()).format('z');
  }
}

export default DateTimeUtil;
