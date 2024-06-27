// my-component.js
import { LE_KINH, LE_TRONG, LE_NHO, getTinhNamPhungVuInstant} from 'lichphungvu';

// check nam
var currentDate = new Date();
var defaultYear = currentDate.getFullYear();
let params = new URLSearchParams(window.location.search);
let searchYear = params.get('searchYear') ? params.get('searchYear') : defaultYear;
//////

const namPhungvuIns = getTinhNamPhungVuInstant(searchYear);
const namPhungVu = namPhungvuIns.getNamPhungVu();
const fullNamPhungVuData = namPhungvuIns.getFullLichPhungVuTheoNam();
let finalData = [];
for(let dd in fullNamPhungVuData) { // resort to make index start from 0...
  const formattedItem = {
    ...fullNamPhungVuData[dd]
  };
  finalData.push(formattedItem);
}
function isLeTrong(loaiLe) {
  return loaiLe == LE_TRONG
}
function isLeNho(loaiLe) {
  return loaiLe == LE_NHO
}

function isLeKinh(loaiLe) {
  return loaiLe == LE_KINH
}
function printDate(d) {
  const weekdays = ["CN","T2","T3","T4","T5","T6","T7"];

  let day;
  let month;
  day = d.getDate();
  month = d.getMonth() + 1;
  let year = d.getFullYear();
  
  let weekday = d.getDay();
  day = day < 10 ? '0'+day : day;
  month = month < 10 ? '0' + month : month;
  return `${weekdays[weekday]}, ${day}-${month}-${year}`;
}
export default {
  setup() {
    return {
        leTrong: LE_TRONG,
        leKinh: LE_KINH,
        leNho: LE_NHO,
        today: 'Today',
        yearInfo:  'Năm Phụng vụ '+ namPhungVu.year + ' - ' + namPhungVu.yearABC + '- ' + namPhungVu.oddEven,
        fullNamPhungVu: finalData,
        isLeTrong,
        isLeNho,
        isLeKinh,
        printDate
    }
  }
}