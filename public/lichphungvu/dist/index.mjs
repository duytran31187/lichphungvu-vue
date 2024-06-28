var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/lephucsinhlib.js
var require_lephucsinhlib = __commonJS({
  "src/lephucsinhlib.js"(exports, module) {
    "use strict";
    var PI = Math.PI;
    function INT(d) {
      return Math.floor(d);
    }
    function jdFromDate(dd, mm, yy) {
      var a, y, m, jd;
      a = INT((14 - mm) / 12);
      y = yy + 4800 - a;
      m = mm + 12 * a - 3;
      jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
      if (jd < 2299161) {
        jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
      }
      return jd;
    }
    function NewMoon(k) {
      var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
      T = k / 1236.85;
      T2 = T * T;
      T3 = T2 * T;
      dr = PI / 180;
      Jd1 = 241502075933e-5 + 29.53058868 * k + 1178e-7 * T2 - 155e-9 * T3;
      Jd1 = Jd1 + 33e-5 * Math.sin((166.56 + 132.87 * T - 9173e-6 * T2) * dr);
      M = 359.2242 + 29.10535608 * k - 333e-7 * T2 - 347e-8 * T3;
      Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 1236e-8 * T3;
      F = 21.2964 + 390.67050646 * k - 16528e-7 * T2 - 239e-8 * T3;
      C1 = (0.1734 - 393e-6 * T) * Math.sin(M * dr) + 21e-4 * Math.sin(2 * dr * M);
      C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
      C1 = C1 - 4e-4 * Math.sin(dr * 3 * Mpr);
      C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 51e-4 * Math.sin(dr * (M + Mpr));
      C1 = C1 - 74e-4 * Math.sin(dr * (M - Mpr)) + 4e-4 * Math.sin(dr * (2 * F + M));
      C1 = C1 - 4e-4 * Math.sin(dr * (2 * F - M)) - 6e-4 * Math.sin(dr * (2 * F + Mpr));
      C1 = C1 + 1e-3 * Math.sin(dr * (2 * F - Mpr)) + 5e-4 * Math.sin(dr * (2 * Mpr + M));
      if (T < -11) {
        deltat = 1e-3 + 839e-6 * T + 2261e-7 * T2 - 845e-8 * T3 - 81e-9 * T * T3;
      } else {
        deltat = -278e-6 + 265e-6 * T + 262e-6 * T2;
      }
      ;
      JdNew = Jd1 + C1 - deltat;
      return JdNew;
    }
    function SunLongitude(jdn) {
      var T, T2, dr, M, L0, DL, L;
      T = (jdn - 2451545) / 36525;
      T2 = T * T;
      dr = PI / 180;
      M = 357.5291 + 35999.0503 * T - 1559e-7 * T2 - 48e-8 * T * T2;
      L0 = 280.46645 + 36000.76983 * T + 3032e-7 * T2;
      DL = (1.9146 - 4817e-6 * T - 14e-6 * T2) * Math.sin(dr * M);
      DL = DL + (0.019993 - 101e-6 * T) * Math.sin(dr * 2 * M) + 29e-5 * Math.sin(dr * 3 * M);
      L = L0 + DL;
      L = L * dr;
      L = L - PI * 2 * INT(L / (PI * 2));
      return L;
    }
    function getSunLongitude(dayNumber, timeZone) {
      return INT(SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
    }
    function getNewMoonDay(k, timeZone) {
      return INT(NewMoon(k) + 0.5 + timeZone / 24);
    }
    function getLunarMonth11(yy, timeZone) {
      var k, off, nm, sunLong;
      off = jdFromDate(31, 12, yy) - 2415021;
      k = INT(off / 29.530588853);
      nm = getNewMoonDay(k, timeZone);
      sunLong = getSunLongitude(nm, timeZone);
      if (sunLong >= 9) {
        nm = getNewMoonDay(k - 1, timeZone);
      }
      return nm;
    }
    function getLeapMonthOffset(a11, timeZone) {
      var k, last, arc, i;
      k = INT((a11 - 2415021076998695e-9) / 29.530588853 + 0.5);
      last = 0;
      i = 1;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
      do {
        last = arc;
        i++;
        arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
      } while (arc != last && i < 14);
      return i - 1;
    }
    function convertSolar2Lunar2(dd, mm, yy, timeZone) {
      var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
      dayNumber = jdFromDate(dd, mm, yy);
      k = INT((dayNumber - 2415021076998695e-9) / 29.530588853);
      monthStart = getNewMoonDay(k + 1, timeZone);
      if (monthStart > dayNumber) {
        monthStart = getNewMoonDay(k, timeZone);
      }
      a11 = getLunarMonth11(yy, timeZone);
      b11 = a11;
      if (a11 >= monthStart) {
        lunarYear = yy;
        a11 = getLunarMonth11(yy - 1, timeZone);
      } else {
        lunarYear = yy + 1;
        b11 = getLunarMonth11(yy + 1, timeZone);
      }
      lunarDay = dayNumber - monthStart + 1;
      const diff = INT((monthStart - a11) / 29);
      lunarLeap = 0;
      lunarMonth = diff + 11;
      if (b11 - a11 > 365) {
        const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
        if (diff >= leapMonthDiff) {
          lunarMonth = diff + 10;
          if (diff == leapMonthDiff) {
            lunarLeap = 1;
          }
        }
      }
      if (lunarMonth > 12) {
        lunarMonth = lunarMonth - 12;
      }
      if (lunarMonth >= 11 && diff < 4) {
        lunarYear -= 1;
      }
      return new Array(lunarDay, lunarMonth, lunarYear, lunarLeap);
    }
    module.exports = {
      convertSolar2Lunar: convertSolar2Lunar2
    };
  }
});

// src/utils.ts
function cloneDate(d) {
  return new Date(d);
}
function newDate(year, month, day) {
  month--;
  const d = new Date(year, month, day);
  d.setHours(1);
  d.setMinutes(0);
  d.setSeconds(0);
  return d;
}
function addDate(currentDate, numOfDate) {
  const newDate2 = cloneDate(currentDate);
  newDate2.setDate(newDate2.getDate() + numOfDate);
  return newDate2;
}
function getChristmasDay(year) {
  return newDate(year, 12, 25);
}
function timNgayTrongTuanSauNgay(d, dayOfWeek) {
  let count = 1;
  let resultDay;
  let breakTheLoop = false;
  do {
    const testDate = addDate(d, count);
    if (testDate.getDay() == dayOfWeek) {
      breakTheLoop = true;
      resultDay = cloneDate(testDate);
    }
    count++;
    if (count > 7) {
      breakTheLoop = true;
    }
  } while (!breakTheLoop);
  if (!resultDay) {
    throw new Error(`cant find timNgayTrongTuanSauNgay for d ${d.toDateString()} for ${dayOfWeek}`);
    return null;
  }
  return resultDay;
}
var timChuaNhatGanNhatTuNgay = (d) => {
  d.setDate(d.getDate() - 1);
  const foundDate = timNgayTrongTuanSauNgay(d, 0);
  if (foundDate instanceof Date) {
    return foundDate;
  }
  return false;
};
var buildKeyInNumberFromDate = (date) => {
  const clonedD = cloneDate(date);
  clonedD.setHours(0);
  clonedD.setMinutes(0);
  clonedD.setSeconds(0);
  return clonedD.getTime();
};
var tenChuaNhatThuongNienThu = (n) => {
  return `CN ${n} mua thuong nien`;
};

// src/commonData.ts
var nameOfDays = {
  year: "N\u0103m",
  yearABC: "n\u0103m A|B|C",
  oddEven: "N\u0103m ch\u1EB5n l\u1EBB",
  theEpiphanyOfTheLord: "L\u1EC5 Ch\xFAa Hi\u1EC3n Linh",
  leChuaChiuPhepRua: "L\u1EC5 Ch\xFAa ch\u1ECBu ph\xE9p r\u1EEDa",
  ashWed: "Th\u1EE9 t\u01B0 l\u1EC5 tro",
  firstSundayOfLent: "Ch\xFAa nh\u1EADt th\u1EE9 nh\u1EA5t m\xF9a chay",
  secondSundayOfLent: "Ch\xFAa nh\u1EADt th\u1EE9 2 m\xF9a chay",
  thirdSundayOfLent: "Ch\xFAa nh\u1EADt th\u1EE9 3 m\xF9a chay",
  fourthSundayOfLent: "Ch\xFAa nh\u1EADt th\u1EE9 4 m\xF9a chay",
  fifthSundayOfLent: "Ch\xFAa nh\u1EADt th\u1EE9 5 m\xF9a chay",
  palmSunday: "L\u1EC5 L\xE1",
  easterSunday: "Ph\u1EE5c sinh",
  secondSundayOfEaster: "Ch\xFAa nh\u1EADt th\u1EE9 2 ph\u1EE5c sinh",
  thirdSundayOfEaster: "Ch\xFAa nh\u1EADt th\u1EE9 3 ph\u1EE5c sinh",
  fourthSundayOfEaster: "Ch\xFAa nh\u1EADt th\u1EE9 4 ph\u1EE5c sinh",
  fifthSundayOfEaster: "Ch\xFAa nh\u1EADt th\u1EE9 5 ph\u1EE5c sinh",
  sixthSundayOfEaster: "Ch\xFAa nh\u1EADt th\u1EE9 6 ph\u1EE5c sinh",
  theAscentionOfTheLord: "L\u1EC5 Ch\xFAa L\xEAn Tr\u1EDDi",
  pentecostSunday: "L\u1EC5 Ch\xFAa Th\xE1nh Th\u1EA7n hi\u1EC7n xu\u1ED1ng",
  firstSundayOfAdvent: "Ch\xFAa nh\u1EADt th\u1EE9 nh\u1EA5t m\xF9a v\u1ECDng",
  secondSundayOfAdvent: "Ch\xFAa nh\u1EADt th\u1EE9 2 m\xF9a v\u1ECDng",
  thirdSundayOfAdvent: "Ch\xFAa nh\u1EADt th\u1EE9 3 m\xF9a v\u1ECDng",
  fourthSundayOfAdvent: "Ch\xFAa nh\u1EADt th\u1EE9 t\u01B0 m\xF9a v\u1ECDng",
  christmas: "Gi\xE1ng sinh",
  leThanhGia: "L\u1EC5 Th\xE1nh Gia",
  chuaKitoVua: "L\u1EC5 Ch\xFAa KiTo Vua",
  firstOrdinarySundayAfterPentecostSunday: "Chua Nhat Thuong Nien sau Le Chua Thanh than hien xuong",
  leDucMeChuaTroi: "Th\xE1nh Ma-ri-a, \xD0\u1EE9c M\u1EB9 Ch\xFAa Tr\u1EDDi",
  leChuaBaNgoi: "L\u1EC5 Ch\xFAa Ba Ng\xF4i",
  leMinhMauThanhChua: "L\u1EC5 M\xECnh M\xE1u Th\xE1nh Ch\xFAa",
  leThanhTamChuaGieSu: "L\u1EC5 Th\xE1nh T\xE2m Ch\xFAa Gi\xEA Su"
};
var LE_KINH = "L\u1EC5 K\xEDnh";
var LE_NHO = "L\u1EC5 Nh\u1EDB";
var LE_TRONG = "L\u1EC5 Tr\u1ECDng";
var danhSachNgayLeCoDinh = (year) => {
  return [
    {
      name: "Th\xE1nh Ma-ri-a, \xD0\u1EE9c M\u1EB9 Ch\xFAa Tr\u1EDDi",
      date: newDate(year, 1, 1),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "Th\xE1nh Ba-xi-li-\xF4 C\u1EA3 v\xE0 th\xE1nh Gh\xEA-g\xF4-ri-\xF4 Na-di-en, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 1, 2),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Kinh Danh r\u1EA5t th\xE1nh Ch\xFAa Gi\xEA-su",
      date: newDate(year, 1, 3),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh R\xE2y-mun-\u0111\xF4 P\xEA-nha-pho, linh m\u1EE5c",
      date: newDate(year, 1, 7),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Hi-la-ri-\xF4, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 1, 13),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh An-t\xF4n, vi\u1EC7n ph\u1EE5",
      date: newDate(year, 1, 17),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Pha-bi-a-n\xF4, gi\xE1o ho\xE0ng, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 1, 20),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh X\xEA-b\xE1t-ti-a-n\xF4, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 1, 20),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh A-n\xEA, trinh n\u1EEF, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 1, 21),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Vinh-s\u01A1n, ph\xF3 t\u1EBF, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 1, 22),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Phan-xi-c\xF4 \u0111\u01A1 Xan, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 1, 24),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Phao-l\xF4 T\xF4ng \u0111\u1ED3 tr\u1EDF l\u1EA1i",
      date: newDate(year, 1, 25),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Ti-m\xF4-th\xEA v\xE0 th\xE1nh Ti-t\xF4, gi\xE1m m\u1EE5c",
      date: newDate(year, 1, 26),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh An-gi\xEA-la M\xEA-ri-si, trinh n\u1EEF",
      date: newDate(year, 1, 27),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh T\xF4-ma A-qui-n\xF4, linh m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 1, 28),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an B\u1ED1t-c\xF4, linh m\u1EE5c",
      date: newDate(year, 1, 31),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "D\xE2ng Ch\xFAa Gi\xEA-su Trong \u0110\u1EC1n Th\xE1nh",
      date: newDate(year, 2, 2),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh An-ga-ri-\xF4, gi\xE1m m\u1EE5c",
      date: newDate(year, 2, 3),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh B\u01A1-la-xi-\xF4, gi\xE1m m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 2, 3),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh A-ga-ta, trinh n\u1EEF, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 2, 5),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Phao-l\xF4 Mi-ki v\xE0 c\xE1c b\u1EA1n, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 2, 6),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh C\xF4-l\xE1t-ti-ca, trinh n\u1EEF",
      date: newDate(year, 2, 10),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c M\u1EB9 L\u1ED9-\u0111\u1EE9c",
      date: newDate(year, 2, 11),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Sy-ri-l\xF4, \u0111an s\u0129 v\xE0 th\xE1nh M\xEA-t\xF4-\u0111i-\xF4, gi\xE1m m\u1EE5c",
      date: newDate(year, 2, 14),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "B\u1EA3y th\xE1nh l\u1EADp d\xF2ng T\xF4i T\u1EDB \u0110\u1EE9c M\u1EB9",
      date: newDate(year, 2, 17),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ph\xEA-r\xF4 \u0110a-mi-a-n\xF4, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 2, 21),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "L\u1EADp t\xF4ng t\xF2a th\xE1nh Ph\xEA-r\xF4 T\xF4ng \u0111\u1ED3",
      date: newDate(year, 2, 22),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Gh\xEA-g\xF4-ri-\xF4 th\xE0nh Narek, vi\u1EC7n ph\u1EE5, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 2, 27),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ca-xi-mia",
      date: newDate(year, 3, 4),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh n\u1EEF Pe-p\xEA-tu-a v\xE0 th\xE1nh n\u1EEF Ph\xEA-li-xi-ta, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 3, 7),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh P\xE1t-tric, gi\xE1m m\u1EE5c",
      date: newDate(year, 3, 17),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Sy-ri-l\xF4, gi\xE1m m\u1EE5c Gi\xEA-ru-sa-lem, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 3, 18),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Giu-se, B\u1EA1n tr\u0103m n\u0103m \u0110\u1EE9c Trinh n\u1EEF Maria",
      date: newDate(year, 3, 19),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "L\u1EC5 Truy\u1EC1n Tin",
      date: newDate(year, 3, 25),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "Th\xE1nh M\xE1c-c\xF4, t\xE1c gi\u1EA3 s\xE1ch Tin M\u1EEBng",
      date: newDate(year, 4, 25),
      fixed: true,
      type: LE_KINH
    },
    {
      name: "Th\xE1nh Lu-i \u0111\u01A1 M\xF4ng-pho, linh m\u1EE5c",
      date: newDate(year, 4, 28),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ph\xEA-r\xF4 Sa-nen, linh m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 4, 28),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ca-ta-ri-na Si-\xEA-na, trinh n\u1EEF, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 4, 29),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Pi-\xF4 V, gi\xE1o ho\xE0ng",
      date: newDate(year, 4, 30),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Giu-se th\u1EE3",
      date: newDate(year, 5, 1),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh A-tha-na-xi-\xF4, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 5, 2),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Phi-lip-ph\xEA v\xE0 th\xE1nh Gia-c\xF4-b\xEA, t\xF4ng \u0111\u1ED3",
      date: newDate(year, 5, 3),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh N\xEA-r\xEA-\xF4 v\xE0 th\xE1nh A-ki-l\xEA-\xF4, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 5, 12),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh P\u0103ng-ra-xi-\xF4, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 5, 12),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c M\u1EB9 Fa-ti-ma",
      date: newDate(year, 5, 13),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh M\xE1t-thi-a, T\xF4ng \u0111\u1ED3",
      date: newDate(year, 5, 14),
      fixed: true,
      type: LE_KINH
    },
    {
      name: "Th\xE1nh B\xEA-na-\u0111i-n\xF4 Xi-\xEA-na, linh m\u1EE5c",
      date: newDate(year, 5, 20),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Christ\xF4ph\xEA de Magallanes, linh m\u1EE5c, v\xE0 c\xE1c b\u1EA1n, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 5, 21),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ri-ta th\xE0nh Ca-xi-a, N\u1EEF tu",
      date: newDate(year, 5, 22),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Phi-lip-ph\xEA N\xEA-ri, linh m\u1EE5c",
      date: newDate(year, 5, 26),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Au-tinh th\xE0nh Can-t\u01A1-b\u01A1-ri, gi\xE1m m\u1EE5c",
      date: newDate(year, 5, 27),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c Maria th\u0103m vi\u1EBFng b\xE0 \xCA-li-sa-b\xE9t",
      type: LE_KINH,
      date: newDate(year, 5, 31),
      fixed: true
    },
    {
      name: "Th\xE1nh M\xE1c-s\xEA-li-n\xF4 v\xE0 th\xE1nh Ph\xEA-r\xF4, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 6, 2),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ca-r\xF4-l\xF4 Loan-ga v\xE0 c\xE1c b\u1EA1n, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 6, 3),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh B\xF4-ni-ph\xE1t, gi\xE1m m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 6, 5),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh N\xF4-bec-t\xF4, gi\xE1m m\u1EE5c",
      date: newDate(year, 6, 6),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ba-na-ba, t\xF4ng \u0111\u1ED3",
      date: newDate(year, 6, 11),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh An-t\xF4n th\xE0nh Pa-\u0111\xF4-va, linh m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 6, 13),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh R\xF4-moan-\u0111\xF4, vi\u1EC7n ph\u1EE5",
      date: newDate(year, 6, 19),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Sinh nh\u1EADt th\xE1nh Gio-an T\u1EA9y Gi\u1EA3",
      date: newDate(year, 6, 24),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "Th\xE1nh Ph\xEA-r\xF4 v\xE0 th\xE1nh Phao-l\xF4, t\xF4ng \u0111\u1ED3",
      date: newDate(year, 6, 29),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "C\xE1c th\xE1nh t\u1EED \u0111\u1EA1o ti\xEAn kh\u1EDFi c\u1EE7a gi\xE1o \u0111o\xE0n R\xF4-ma",
      date: newDate(year, 6, 30),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh T\xF4-ma, t\xF4ng \u0111\u1ED3",
      date: newDate(year, 7, 3),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh n\u1EEF \xCA-li-sa-b\xE9t B\u1ED3-\u0111\xE0o-nha",
      date: newDate(year, 7, 4),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Augustin\xF4 Tri\u1EC7u Vinh, linh m\u1EE5c v\xE0 c\xE1c b\u1EA1n, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 7, 9),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Bi\u1EC3n-\u0111\u1EE9c, vi\u1EC7n ph\u1EE5",
      date: newDate(year, 7, 11),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ca-mi-l\xF4 Len-li, linh m\u1EE5c",
      date: newDate(year, 7, 14),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh B\xF4-na-ven-tu-ra, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 7, 15),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c M\u1EB9 n\xFAi Cat-minh",
      date: newDate(year, 7, 16),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh L\xF4-ren-x\xF4 B\u01A1-rin-\u0111i-xi, linh m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 7, 21),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ma-ri-a Ma-\u0111a-l\xEA-na",
      date: newDate(year, 7, 22),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Bi-ghit-ta, n\u1EEF tu",
      date: newDate(year, 7, 23),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Sa-ben Mac-lup, linh m\u1EE5c",
      date: newDate(year, 7, 24),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gia-c\xF4-b\xEA, t\xF4ng \u0111\u1ED3",
      date: newDate(year, 7, 25),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-a-kim v\xE0 th\xE1nh An-na, song th\xE2n \u0110\u1EE9c Maria",
      fixed: true,
      date: newDate(year, 7, 26),
      type: LE_NHO
    },
    {
      name: "Th\xE1nh n\u1EEF M\xE1c-ta, th\xE1nh n\u1EEF Ma-ri-a v\xE0 th\xE1nh La-xa-r\u01A1",
      date: newDate(year, 7, 29),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ph\xEA-r\xF4 Kim Ng\xF4n, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 7, 30),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh I-nha-xi-\xF4 L\xF4i-\xF4-la, linh m\u1EE5c",
      date: newDate(year, 7, 31),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh An-phong Ma-ri-a Li-g\xF4-ri, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 8, 1),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an Ma-ri-a Vi-a-n\xEA, linh m\u1EE5c",
      date: newDate(year, 8, 4),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Cung hi\u1EBFn th\xE1nh \u0111\u01B0\u1EDDng \u0110\u1EE9c Ma-ri-a",
      date: newDate(year, 8, 5),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Ch\xFAa Hi\u1EC3n Dung",
      date: newDate(year, 8, 6),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Ga-\xEA-ta-n\xF4, linh m\u1EE5c",
      date: newDate(year, 8, 7),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Xit-t\xF4 II, gi\xE1o ho\xE0ng v\xE0 c\xE1c b\u1EA1n, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 8, 7),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh \u0110a-minh, linh m\u1EE5c",
      date: newDate(year, 8, 8),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh C\u1EDD-la-ra, trinh n\u1EEF",
      date: newDate(year, 8, 11),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an-na Phan-xi-ca S\u0103ng-tan, n\u1EEF tu",
      date: newDate(year, 8, 12),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh P\xF4n-xi-a-n\xF4, gi\xE1o ho\xE0ng, v\xE0 th\xE1nh Hip-p\xF4-li-t\xF4, linh m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 8, 13),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh M\xE1c-xi-mi-li-a-n\xF4 K\xF4n-b\xEA, linh m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 8, 14),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c Ma-ri-a L\xEAn Tr\u1EDDi",
      date: newDate(year, 8, 15),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an \u01A0-\u0111\u01A1, linh m\u1EE5c",
      date: newDate(year, 8, 19),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh B\xEA-na-\u0111\xF4, vi\u1EC7n ph\u1EE5, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 8, 20),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Pi\xF4 X, gi\xE1o ho\xE0ng",
      date: newDate(year, 8, 21),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c Ma-ri-a N\u1EEF v\u01B0\u01A1ng",
      date: newDate(year, 8, 22),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Bartolommeo t\xF4ng \u0111\u1ED3",
      date: newDate(year, 8, 24),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Giu-se Ca-la-xan, linh m\u1EE5c",
      date: newDate(year, 8, 25),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Lu-y",
      date: newDate(year, 8, 25),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh n\u1EEF M\xF4-ni-ca",
      date: newDate(year, 8, 27),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh  u-tinh, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 8, 28),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an T\u1EA9y Gi\u1EA3 b\u1ECB tr\u1EA3m quy\u1EBFt",
      date: newDate(year, 8, 29),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gr\xEA-g\xF4-ri-\xF4 C\u1EA3, gi\xE1o ho\xE0ng, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 9, 3),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh T\xEA-r\xEA-xa Cal-cut-ta, n\u1EEF tu",
      date: newDate(year, 9, 5),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Sinh nh\u1EADt \u0110\u1EE9c trinh n\u1EEF Maria",
      date: newDate(year, 9, 8),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Ph\xEA-r\xF4 C\u01A1-la-ve, linh m\u1EE5c",
      date: newDate(year, 9, 9),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Danh R\u1EA5t Th\xE1nh trinh n\u1EEF Ma-ri-a",
      date: newDate(year, 9, 12),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Suy t\xF4n Th\xE1nh gi\xE1",
      date: newDate(year, 9, 14),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c M\u1EB9 s\u1EA7u bi",
      date: newDate(year, 9, 15),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Co-n\xEA-li-\xF4, gi\xE1o ho\xE0ng v\xE0 th\xE1nh Sip-ri-a-n\xF4, gi\xE1m m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 9, 16),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh R\xF4-be-t\xF4 Be-la-mi-n\xF4, gi\xE1m m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 9, 17),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh n\u1EEF Hildegarde th\xE0nh Bingen, trinh n\u1EEF, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 9, 17),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gia-nu-a-ri-\xF4, gi\xE1m m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 9, 19),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh M\xE1t-th\xEAu, t\xF4ng \u0111\u1ED3, t\xE1c gi\u1EA3 s\xE1ch Tin M\u1EEBng",
      date: newDate(year, 9, 21),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Pi-\xF4 th\xE0nh Pi-e-tren-ci-na, linh m\u1EE5c",
      date: newDate(year, 9, 23),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh C\xF3t-ma v\xE0 th\xE1nh \u0110a-mi-a-n\xF4, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 9, 26),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Vinh-s\u01A1n Phao-l\xF4, linh m\u1EE5c",
      date: newDate(year, 9, 27),
      fixed: true,
      type: LE_NHO
    },
    {
      name: "C\xE1c T\u1ED5ng l\xE3nh thi\xEAn th\u1EA7n Mi-ca-en, G\xE1p-ri-en v\xE0 Ra-pha-en",
      date: newDate(year, 9, 29),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Gi\xEA-r\xF4-ni-m\xF4, linh m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 9, 30),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh T\xEA-r\xEA-xa H\xE0i \u0110\u1ED3ng Gi\xEA-su, trinh n\u1EEF, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 10, 1),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "C\xE1c thi\xEAn th\u1EA7n h\u1ED9 th\u1EE7",
      date: newDate(year, 10, 2),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Phan-xi-c\xF4 \xC1t-xi-di",
      date: newDate(year, 10, 4),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh B\u01A1-ru-n\xF4, linh m\u1EE5c",
      date: newDate(year, 10, 6),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c M\u1EB9 M\xE2n C\xF4i",
      date: newDate(year, 10, 7),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an L\xEA-\xF4-n\xE1c-\u0111i, linh m\u1EE5c",
      date: newDate(year, 10, 9),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh \u0110i-\xF4-ni-xi-\xF4, gi\xE1m m\u1EE5c v\xE0 c\xE1c b\u1EA1n, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 10, 9),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ca-l\xEDt-t\xF4 I, gi\xE1o ho\xE0ng, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 10, 14),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh T\xEA-r\xEA-xa Gi\xEA-su, trinh n\u1EEF, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 10, 15),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh H\xE9t-v\xEDch, n\u1EEF tu",
      date: newDate(year, 10, 16),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ma-ga-ri-ta Ma-ri-a A-la-c\u1ED1c, trinh n\u1EEF",
      date: newDate(year, 10, 16),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh I-nha-xi-\xF4 th\xE0nh An-ti-\xF4-khi-a, gi\xE1m m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 10, 17),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Lu-ca, t\xE1c gi\u1EA3 S\xE1ch Tin M\u1EEBng",
      date: newDate(year, 10, 18),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an Phao-l\xF4 II, gi\xE1o ho\xE0ng",
      date: newDate(year, 10, 22),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an th\xE0nh Ca-p\xE9t-ra-n\xF4, linh m\u1EE5c",
      date: newDate(year, 10, 23),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh An-t\xF4n Ma-ri-a C\u01A1-la-r\xE9t, gi\xE1m m\u1EE5c",
      date: newDate(year, 10, 24),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Si-mon v\xE0 th\xE1nh Giu-\u0111a, t\xF4ng \u0111\u1ED3",
      date: newDate(year, 10, 28),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "C\xE1c Th\xE1nh Nam N\u1EEF",
      date: newDate(year, 11, 1),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "C\u1EA7u Cho C\xE1c T\xEDn H\u1EEFu \u0110\xE3 Qua \u0110\u1EDDi",
      date: newDate(year, 11, 2),
      fixed: true
    },
    {
      name: "Th\xE1nh M\xE1c-ti-n\xF4 Po-r\xE9t, tu s\u0129",
      date: newDate(year, 11, 3),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ca-r\xF4-l\xF4 B\xF4-r\xF4-m\xEA-\xF4, gi\xE1m m\u1EE5c",
      date: newDate(year, 11, 4),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Cung hi\u1EBFn th\xE1nh \u0111\u01B0\u1EDDng La-t\xEA-ra-n\xF4",
      date: newDate(year, 11, 9),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh L\xEA-\xF4 C\u1EA3, gi\xE1o ho\xE0ng, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 11, 10),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh M\xE1c-ti-n\xF4 th\xE0nh Tua, gi\xE1m m\u1EE5c",
      date: newDate(year, 11, 11),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gi\xF4-sa-ph\xE1t, gi\xE1m m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 11, 12),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh n\u1EEF \xCA-li-sa-bet n\u01B0\u1EDBc Hung-ga-ri",
      date: newDate(year, 11, 17),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Cung hi\u1EBFn th\xE1nh \u0111\u01B0\u1EDDng th\xE1nh Ph\xEA-r\xF4 v\xE0 th\xE1nh \u0111\u01B0\u1EDDng th\xE1nh Phao-l\xF4",
      date: newDate(year, 11, 18),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c M\u1EB9 d\xE2ng m\xECnh trong \u0111\u1EC1n th\u1EDD",
      date: newDate(year, 11, 21),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh An-r\xEA D\u0169ng L\u1EA1c v\xE0 c\xE1c b\u1EA1n, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 11, 24),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Ca-ta-ri-na A-l\xEA-xan-ri-a, trinh n\u1EEF, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 11, 25),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh An-r\xEA, T\xF4ng \u0111\u1ED3",
      date: newDate(year, 11, 30),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Phan-xi-c\xF4 Xa-vi-e, linh m\u1EE5c",
      date: newDate(year, 12, 3),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Gioan \u0110a-m\xE1t, linh m\u1EE5c, ti\u1EBFn s\u0129 H\u1ED9i Th\xE1nh",
      date: newDate(year, 12, 4),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c M\u1EB9 V\xF4 Nhi\u1EC5m Nguy\xEAn T\u1ED9i",
      date: newDate(year, 12, 8),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an \u0110i-\xEA-g\xF4",
      date: newDate(year, 12, 9),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c trinh n\u1EEF Ma-ri-a L\xF4-r\xEA-t\xF4",
      date: newDate(year, 12, 10),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh \u0110a-ma-x\xF4 I, gi\xE1o ho\xE0ng",
      date: newDate(year, 12, 11),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "\u0110\u1EE9c trinh n\u1EEF Ma-ri-a Goa-\u0111a-lu-p\xEA",
      date: newDate(year, 12, 12),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an th\xE0nh K\xEA-ty, linh m\u1EE5c",
      date: newDate(year, 12, 23),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "24 th\xE1ng 12 M\xF9a V\u1ECDng",
      date: newDate(year, 12, 24),
      fixed: true
    },
    {
      name: "Ch\xFAa Gi\xE1ng Sinh",
      date: newDate(year, 12, 25),
      type: LE_TRONG,
      fixed: true
    },
    {
      name: "Th\xE1nh T\xEA-pha-n\xF4, t\u1EED \u0111\u1EA1o ti\xEAn kh\u1EDFi",
      date: newDate(year, 12, 26),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh Gio-an, T\xF4ng \u0111\u1ED3, t\xE1c gi\u1EA3 s\xE1ch Tin m\u1EEBng",
      date: newDate(year, 12, 27),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "C\xE1c th\xE1nh Anh H\xE0i, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 12, 28),
      type: LE_KINH,
      fixed: true
    },
    {
      name: "Th\xE1nh T\xF4-ma B\xE9c-k\xE9t, gi\xE1m m\u1EE5c, t\u1EED \u0111\u1EA1o",
      date: newDate(year, 12, 29),
      type: LE_NHO,
      fixed: true
    },
    {
      name: "Th\xE1nh Xin-vet-t\xEA I, gi\xE1o ho\xE0ng",
      date: newDate(year, 12, 31),
      type: LE_NHO,
      fixed: true
    }
  ];
};

// src/cacNgayLeNamPhungVu.ts
var { convertSolar2Lunar } = require_lephucsinhlib();
var tinhngayramsau21thang3 = (y) => {
  let ngayRamFound = false;
  let count = 0;
  let dateFrom21 = 21;
  let month = 3;
  do {
    const ngayAm = convertSolar2Lunar(
      dateFrom21,
      month,
      y,
      7
      // UTC+7
    );
    const lunarDay = ngayAm[0];
    if (lunarDay === 16) {
      ngayRamFound = true;
    }
    count++;
    dateFrom21++;
    if (dateFrom21 == 32) {
      dateFrom21 = 1;
      month = 4;
    }
  } while (!ngayRamFound);
  return {
    year: y,
    month,
    day: dateFrom21
  };
};
function tinhThuTuLeTro(ngayLePhucSinh) {
  const d = cloneDate(ngayLePhucSinh);
  d.setDate(d.getDate() - 46);
  return d;
}
var tinhNgayPhucSinh = (year) => {
  const simpleDateParam = tinhngayramsau21thang3(year);
  let closestSunday = newDate(simpleDateParam.year, simpleDateParam.month, simpleDateParam.day);
  const foundDate = timChuaNhatGanNhatTuNgay(closestSunday);
  if (foundDate instanceof Date) {
    return foundDate;
  }
  return false;
};
function tinhLeChuaHienLinh(y) {
  const ngayLeHienLinh = newDate(y, 1, 6);
  switch (ngayLeHienLinh.getDay()) {
    case 1:
      return newDate(y, 1, 5);
    case 2:
      return newDate(y, 1, 4);
    case 3:
      return newDate(y, 1, 3);
    case 4:
      return newDate(y, 1, 2);
    case 5:
      return newDate(y, 1, 8);
    case 6:
      return newDate(y, 1, 7);
    default:
      return ngayLeHienLinh;
  }
}
function tinhLeThanhGia(y) {
  const christMas = getChristmasDay(y);
  let count = 1;
  let breakTheLoop = false;
  let foundDate = newDate(y, 12, 30);
  do {
    let octaveDay = addDate(christMas, count);
    if (octaveDay.getDay() == 0) {
      breakTheLoop = true;
      foundDate = octaveDay;
    }
    count++;
    if (count > 6) {
      breakTheLoop = true;
    }
  } while (!breakTheLoop);
  return foundDate;
}
function tinhLeChuaChiuPhepRua(y) {
  const leHienLinh = tinhLeChuaHienLinh(y);
  const day7 = newDate(y, 1, 7);
  const day8 = newDate(y, 1, 8);
  let ngayLe;
  if (leHienLinh.getTime() == day7.getTime()) {
    ngayLe = timNgayTrongTuanSauNgay(day7, 1);
  } else if (leHienLinh.getTime() == day8.getTime()) {
    ngayLe = timNgayTrongTuanSauNgay(day8, 1);
  } else {
    ngayLe = timNgayTrongTuanSauNgay(leHienLinh, 0);
  }
  if (ngayLe instanceof Date) {
    return ngayLe;
  } else {
    return false;
  }
}
var tinhLeChuaKiToVua = (chuaNhatThuNhatMuaVong) => {
  let tuan = cloneDate(chuaNhatThuNhatMuaVong);
  tuan.setDate(tuan.getDate() - 7);
  return tuan;
};
var tinhLeChuaThanhThanHienxuong = (easter) => {
  const d = cloneDate(easter);
  return addDate(d, 49);
};
var tinhLeChuaBaNgoi = (leChuaThanhThanHienXuong) => {
  const d = cloneDate(leChuaThanhThanHienXuong);
  return addDate(d, 7);
};
var tinhLeMinhMauThanhChua = (tinhLeChuaBaNgoi2) => {
  const d = cloneDate(tinhLeChuaBaNgoi2);
  return addDate(d, 7);
};
var tinhLeThanhTamChuaGieSu = (tinhLeMinhMauThanhChua2) => {
  const d = cloneDate(tinhLeMinhMauThanhChua2);
  return addDate(d, 5);
};
var tinhChuaNhatThuongNienDauTienSauLeChuaThanhThanHienXuong = (leKiToVua, leChuatthienxuong) => {
  let count = 33;
  let found = false;
  const chuaNhatThuongNienDauTienMua2 = cloneDate(leChuatthienxuong);
  chuaNhatThuongNienDauTienMua2.setDate(chuaNhatThuongNienDauTienMua2.getDate() + 7);
  if (leChuatthienxuong.getDay() != 0 || leKiToVua.getDay() != 0) {
    console.error("invalid params");
    return 100;
  }
  do {
    let sunday34 = cloneDate(leKiToVua);
    sunday34.setDate(sunday34.getDate() - (34 - count) * 7);
    count--;
    if (sunday34.toDateString() == chuaNhatThuongNienDauTienMua2.toDateString()) {
      found = true;
      count++;
    }
  } while (!found);
  return count;
};
function tinhNamABC(y) {
  let yearStr = y.toString();
  let yearNums = Array.from(yearStr);
  let countNum = 0;
  let year;
  yearNums.forEach((element) => {
    countNum += parseInt(element);
  });
  switch (countNum % 3) {
    case 1:
      year = "A";
      break;
    case 2:
      year = "B";
      break;
    default:
      year = "C";
  }
  return year;
}
function tinh4TuanMuaVong(y) {
  let chrismastDate = getChristmasDay(y);
  let sundayFound = false;
  let count = 0;
  let finalResult;
  do {
    let closestSunday_1 = chrismastDate;
    closestSunday_1.setDate(chrismastDate.getDate() - 1);
    if (closestSunday_1.getDay() === 0) {
      let sunday4 = new Date(closestSunday_1.getTime());
      let sunday3 = new Date(sunday4.getTime());
      sunday3.setDate(sunday3.getDate() - 7);
      let sunday2 = new Date(sunday3.getTime());
      sunday2.setDate(sunday2.getDate() - 7);
      let sunday1 = new Date(sunday2.getTime());
      sunday1.setDate(sunday2.getDate() - 7);
      sundayFound = true;
      finalResult = {
        week1: sunday1,
        week2: sunday2,
        week3: sunday3,
        week4: sunday4
      };
      break;
    }
    count++;
  } while (!sundayFound);
  return finalResult;
}
var firstSundayOfLent = (ashWednesday) => {
  return addDate(ashWednesday, 4);
};
var secondSundayOfLent = (ashWednesday) => {
  return addDate(ashWednesday, 11);
};
var thirdSundayOfLent = (ashWednesday) => {
  return addDate(ashWednesday, 18);
};
var fourthSundayOfLent = (ashWednesday) => {
  return addDate(ashWednesday, 25);
};
var fifthSundayOfLent = (ashWednesday) => {
  return addDate(ashWednesday, 32);
};
var calculateTheAscentionOfTheLord = (easter) => {
  return addDate(easter, 42);
};
var palmSunday = (ashWednesday) => {
  return addDate(ashWednesday, 39);
};

// src/TinhNamPhungVu.ts
var TinhNamPhungVu = class {
  constructor(year) {
    // cac ngay le tinh theo cong thu
    this.fullYear = [];
    // full 365 ngay
    this.firstSundayOfYear = void 0;
    // CN tuan dau tien de tinh mua thuong nien
    this.printed = false;
    this.year = +year;
    let date = newDate(this.year, 1, 1);
    const endDate = newDate(this.year + 1, 1, 1);
    while (date < endDate) {
      if (!this.firstSundayOfYear && date.getDay() == 0) {
        this.firstSundayOfYear = cloneDate(date);
      }
      this.addNgayLeVoDanhSach(date, "", "", true);
      date.setDate(date.getDate() + 1);
    }
    ;
  }
  getFullYearKeyFromDate(date) {
    return buildKeyInNumberFromDate(date);
  }
  addNgayLeVoDanhSach(date, ngayLe, loaiNgayLe, fixed = false) {
    let indexStr = this.getFullYearKeyFromDate(date);
    const singleDateData = {
      name: ngayLe,
      type: loaiNgayLe ? loaiNgayLe : "",
      fixed
    };
    if (!this.fullYear[indexStr]) {
      let ngayLeData = {
        date: newDate(this.year, date.getMonth() + 1, date.getDate()),
        cacNgayLe: []
      };
      this.fullYear[indexStr] = ngayLeData;
    }
    if (ngayLe != "") {
      this.fullYear[indexStr].cacNgayLe.push(singleDateData);
    }
  }
  tinhNgayPhucSinh() {
    return tinhNgayPhucSinh(this.year);
  }
  tinhThuTuLeTro() {
    return tinhThuTuLeTro(this.ngayLePhucSinh);
  }
  get ngayLePhucSinh() {
    if (!this.pLePhucSinh) {
      this.pLePhucSinh = this.tinhNgayPhucSinh();
    }
    return this.pLePhucSinh;
  }
  get ngayLeTro() {
    if (!this.pThuTuLeTro) {
      this.pThuTuLeTro = this.tinhThuTuLeTro();
    }
    return this.pThuTuLeTro;
  }
  get ngayLeChuaHienLinh() {
    if (!this.pNgayLeChuaHienLinh) {
      this.pNgayLeChuaHienLinh = tinhLeChuaHienLinh(this.year);
    }
    return this.pNgayLeChuaHienLinh;
  }
  get ngayLeThanhGia() {
    if (!this.pLeThanhGia) {
      this.pLeThanhGia = tinhLeThanhGia(this.year);
    }
    return this.pLeThanhGia;
  }
  get bonTuanMuaVong() {
    if (!this.p4TuanMuaVong) {
      this.p4TuanMuaVong = tinh4TuanMuaVong(this.year);
    }
    return this.p4TuanMuaVong;
  }
  tinhLichPhungVu() {
    const tuanMuaVong = this.bonTuanMuaVong;
    const leChuaKiToVua = tinhLeChuaKiToVua(tuanMuaVong.week1);
    const pentecostSunday = tinhLeChuaThanhThanHienxuong(this.ngayLePhucSinh);
    const leChuaBaNgoi = tinhLeChuaBaNgoi(pentecostSunday);
    const leMinhMauThanhChua = tinhLeMinhMauThanhChua(leChuaBaNgoi);
    const leThanhTamChuaGieSu = tinhLeThanhTamChuaGieSu(leMinhMauThanhChua);
    const chuaNhatThuongNienDauTienSauLeChuaThanhThanHienXuong = tinhChuaNhatThuongNienDauTienSauLeChuaThanhThanHienXuong(
      leChuaKiToVua,
      pentecostSunday
    );
    const leChuaChiuPhepRua = tinhLeChuaChiuPhepRua(this.year);
    if (!(leChuaChiuPhepRua instanceof Date)) {
      throw Error(`can't find LeChuaChiuPhepRua nam ${this.year}`);
    }
    this.namPhungVu = {
      year: this.year,
      yearABC: tinhNamABC(this.year),
      oddEven: this.year % 2 == 0 ? "Even ( N\u0103m ch\u1EB5n)" : "Odd (N\u0103m l\u1EBB)",
      theEpiphanyOfTheLord: this.ngayLeChuaHienLinh,
      firstOrdinarySundayAfterPentecostSunday: chuaNhatThuongNienDauTienSauLeChuaThanhThanHienXuong,
      leChuaChiuPhepRua,
      ashWed: this.ngayLeTro,
      firstSundayOfLent: firstSundayOfLent(this.ngayLeTro),
      secondSundayOfLent: secondSundayOfLent(this.ngayLeTro),
      thirdSundayOfLent: thirdSundayOfLent(this.ngayLeTro),
      fourthSundayOfLent: fourthSundayOfLent(this.ngayLeTro),
      fifthSundayOfLent: fifthSundayOfLent(this.ngayLeTro),
      palmSunday: palmSunday(this.ngayLeTro),
      easterSunday: this.ngayLePhucSinh,
      secondSundayOfEaster: addDate(this.ngayLePhucSinh, 7),
      thirdSundayOfEaster: addDate(this.ngayLePhucSinh, 14),
      fourthSundayOfEaster: addDate(this.ngayLePhucSinh, 21),
      fifthSundayOfEaster: addDate(this.ngayLePhucSinh, 28),
      sixthSundayOfEaster: addDate(this.ngayLePhucSinh, 35),
      theAscentionOfTheLord: calculateTheAscentionOfTheLord(this.ngayLePhucSinh),
      pentecostSunday,
      leChuaBaNgoi,
      leMinhMauThanhChua,
      leThanhTamChuaGieSu,
      chuaKitoVua: leChuaKiToVua,
      firstSundayOfAdvent: tuanMuaVong.week1,
      secondSundayOfAdvent: tuanMuaVong.week2,
      thirdSundayOfAdvent: tuanMuaVong.week3,
      fourthSundayOfAdvent: tuanMuaVong.week4,
      leThanhGia: this.ngayLeThanhGia
    };
  }
  getNamPhungVu() {
    if (!this.namPhungVu) {
      this.tinhLichPhungVu();
    }
    return this.namPhungVu;
  }
  populateCalculatedDaysToCalender() {
    const namphungVuIns = this.getNamPhungVu();
    const LeTrong = [
      "theEpiphanyOfTheLord",
      // Le Chua Hien Linh
      "theAscentionOfTheLord",
      // Le Chua Len Troi
      "pentecostSunday",
      //: 'Lễ Chúa Thánh Thần hiện xuống'
      "leChuaBaNgoi",
      //: leChuaBaNgoi
      "leMinhMauThanhChua",
      "leThanhTamChuaGieSu",
      "chuaKitoVua"
    ];
    const LeKinh = [
      "leChuaChiuPhepRua",
      "leThanhGia"
    ];
    for (let key in namphungVuIns) {
      if (namphungVuIns.hasOwnProperty(key)) {
        const val = namphungVuIns[key];
        const nameOfDate = nameOfDays[key];
        if (val instanceof Date) {
          if (nameOfDays.hasOwnProperty(key)) {
            let loaiNgayLe = "";
            if (LeTrong.includes(key)) {
              loaiNgayLe = LE_TRONG;
            } else if (LeKinh.includes(key)) {
              loaiNgayLe = LE_KINH;
            }
            this.addNgayLeVoDanhSach(val, nameOfDate, loaiNgayLe, false);
          } else {
            throw new Error(`khong the tim thay ten ngay le cho ngay: ${key}`);
          }
        }
      }
    }
  }
  setSameTimeOfDate(date) {
    const d = cloneDate(date);
    d.setHours(1);
    d.setMinutes(0);
    d.setSeconds(0);
    return d;
  }
  populateCacNgayLeCoDinh() {
    const LeCoDinh = danhSachNgayLeCoDinh(this.year);
    let d;
    for (d of LeCoDinh) {
      this.addNgayLeVoDanhSach(d.date, d.name, d.type, d.fixed);
    }
  }
  nameChuaNhaMuaThuongNienThu(n) {
    return tenChuaNhatThuongNienThu(n);
  }
  /**
   * goi sau khi da populate het cac ngay le co dinh, theo cong thu
   */
  tinhchuaNhatMuaThuongNien() {
    const namPhungVu = this.namPhungVu;
    const leChuaHienLinh = namPhungVu.theEpiphanyOfTheLord;
    let d = cloneDate(leChuaHienLinh);
    d.setDate(d.getDate() + 7);
    if (d.toDateString() == namPhungVu.leChuaChiuPhepRua.toDateString()) {
      d.setDate(d.getDate() + 7);
    }
    const thu4LeTro = namPhungVu.ashWed;
    let muaThuongNienThu = 2;
    while (d.getTime() < thu4LeTro.getTime()) {
      this.addNgayLeVoDanhSach(
        d,
        this.nameChuaNhaMuaThuongNienThu(muaThuongNienThu),
        "",
        false
      );
      d.setDate(d.getDate() + 7);
      muaThuongNienThu++;
    }
    muaThuongNienThu = namPhungVu.firstOrdinarySundayAfterPentecostSunday;
    d = cloneDate(namPhungVu.pentecostSunday);
    d = this.setSameTimeOfDate(d);
    d.setDate(d.getDate() + 7);
    const leKitoVua = this.setSameTimeOfDate(namPhungVu.chuaKitoVua);
    while (d.getTime() > namPhungVu.pentecostSunday.getTime() && d.getTime() < leKitoVua.getTime()) {
      if (d.toDateString() !== namPhungVu.leChuaBaNgoi.toDateString() && d.toDateString() !== namPhungVu.leMinhMauThanhChua.toDateString() && d.toDateString() !== newDate(this.year, 6, 29).toDateString()) {
        this.addNgayLeVoDanhSach(
          d,
          this.nameChuaNhaMuaThuongNienThu(muaThuongNienThu),
          "",
          false
        );
      }
      d.setDate(d.getDate() + 7);
      muaThuongNienThu++;
    }
  }
  populateTuanBatNhat() {
    const namPhungVu = this.namPhungVu;
    const d = cloneDate(namPhungVu.easterSunday);
    let batNhaThu = 1;
    do {
      d.setDate(d.getDate() + 1);
      batNhaThu++;
      this.addNgayLeVoDanhSach(
        d,
        `Thu ${batNhaThu} trong Tu\u1EA7n B\xE1t Nh\u1EADt L\u1EC5 Ph\u1EE5c Sinh`,
        LE_TRONG,
        false
      );
    } while (batNhaThu < 7);
  }
  populateTuanThanh() {
    const namPhungVu = this.namPhungVu;
    const d = cloneDate(namPhungVu.palmSunday);
    let thu = 1;
    do {
      d.setDate(d.getDate() + 1);
      thu++;
      this.addNgayLeVoDanhSach(
        d,
        `Thu ${thu} Tu\u1EA7n Th\xE1nh`,
        "",
        false
      );
    } while (thu < 7);
  }
  getFullLichPhungVuTheoNam() {
    this.populateCacNgayLeCoDinh();
    this.populateCalculatedDaysToCalender();
    this.tinhchuaNhatMuaThuongNien();
    this.populateTuanBatNhat();
    this.populateTuanThanh();
    this.printed = true;
    return this.fullYear;
  }
  // public getLichPhungVuTheoThang(month: number) {
  //     const fullMonth: SingleDateData[] = [];
  //     month--; // as getMonth() return 0-11
  //     if (!this.printed) {
  //         this.getFullLichPhungVuTheoNam();
  //     }
  //     // console.log(this.fullYear);
  //     for (let key in this.fullYear) {
  //         if (this.fullYear[key].date.getMonth() == month)
  //         {
  //             fullMonth.push(this.fullYear[key]);   
  //         }
  //     }
  //     return fullMonth;
  // }
};

// src/index.ts
function getTinhNamPhungVuInstant(year) {
  return new TinhNamPhungVu(year);
}
export {
  LE_KINH,
  LE_NHO,
  LE_TRONG,
  getTinhNamPhungVuInstant,
  nameOfDays
};
//# sourceMappingURL=index.mjs.map