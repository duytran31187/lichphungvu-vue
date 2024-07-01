import { createApp, ref, reactive } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';
import { LE_KINH, LE_TRONG, LE_NHO, getTinhNamPhungVuInstant } from './lichphungvu/dist/index.mjs';
// check nam
var currentDate = new Date();
var defaultYear = currentDate.getFullYear();
//////
function getNgayLeEventClass(loaiLe) {
  const defaultClss = 'col detail-le event border';
  let classes = '';
  switch (loaiLe) {
    case LE_KINH:
      classes = defaultClss + ' le_kinh_d';
      break;
    case LE_NHO:
      classes = defaultClss + ' le_nho_d';
      break;
    case LE_TRONG:
      classes = defaultClss + ' le_trong_d';
      break;
    default:
      classes = defaultClss + ' bg-light';
      break;
  }
  return classes;
}
function printDate(d) {
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  let day;
  let month;
  day = d.getDate();
  month = d.getMonth() + 1;
  let year = d.getFullYear();

  let weekday = d.getDay();
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;
  return `${weekdays[weekday]}, ${day}-${month}-${year}`;
}

function doResearch(year) {
  const namPhungvuIns = getTinhNamPhungVuInstant(year);
  const namPhungVu = namPhungvuIns.getNamPhungVu();
  const fullNamPhungVuData = namPhungvuIns.getFullLichPhungVuTheoNam();
  let finalData = [];
  for (let dd in fullNamPhungVuData) { // resort to make index start from 0...
    const formattedItem = {
      ...fullNamPhungVuData[dd]
    };
    finalData.push(formattedItem);
  }
  const yearInfo = yearInfoTitle(namPhungVu);
  return {
    finalData,
    yearInfo
  }
}
function yearInfoTitle(namPhungVu) {
  return 'Năm Phụng vụ ' + namPhungVu.year + ' - ' + namPhungVu.yearABC + '- ' + namPhungVu.oddEven;
}
const app = Vue.createApp({
  data() {
    const { finalData, yearInfo } = doResearch(defaultYear);
    return {
      leTrong: LE_TRONG,
      leKinh: LE_KINH,
      leNho: LE_NHO,
      today: 'Today',
      yearInfo,
      fullNamPhungVu: finalData,
      printDate,
      getNgayLeEventClass,
      searchYearInfo: defaultYear,
      showLeTrong: true,
      showLeNho: true,
      showLeKinh: true,
    }
  },
  methods: {
    doResearch() {
      const { finalData, yearInfo } = doResearch(this.searchYearInfo);
      this.yearInfo = yearInfo;
      this.fullNamPhungVu = finalData;
    },
    toggleLeTrong() {
      this.showLeTrong = !this.showLeTrong;
    },
    toggleLeKinh() {
      this.showLeKinh = !this.showLeKinh;
    },
    toggleLeNho() {
      this.showLeNho = !this.showLeNho;
    }
  }
});
app.mount('#app');