type NamPhungVu = {
    year: number;
    yearABC: string;
    oddEven: string;
    leDucMeChuaTroi?: Date;
    theEpiphanyOfTheLord: Date;
    leChuaChiuPhepRua: Date;
    ashWed: Date;
    firstSundayOfLent: Date;
    secondSundayOfLent: Date;
    thirdSundayOfLent: Date;
    fourthSundayOfLent: Date;
    fifthSundayOfLent: Date;
    palmSunday: Date;
    easterSunday: Date;
    secondSundayOfEaster: Date;
    thirdSundayOfEaster: Date;
    fourthSundayOfEaster: Date;
    fifthSundayOfEaster: Date;
    sixthSundayOfEaster: Date;
    theAscentionOfTheLord: Date;
    pentecostSunday: Date;
    leChuaBaNgoi: Date;
    leMinhMauThanhChua: Date;
    leThanhTamChuaGieSu: Date;
    chuaKitoVua: Date;
    firstSundayOfAdvent: Date;
    secondSundayOfAdvent: Date;
    thirdSundayOfAdvent: Date;
    fourthSundayOfAdvent: Date;
    leThanhGia: Date;
    firstOrdinarySundayAfterPentecostSunday: number;
};
declare const nameOfDays: {
    year: string;
    yearABC: string;
    oddEven: string;
    theEpiphanyOfTheLord: string;
    leChuaChiuPhepRua: string;
    ashWed: string;
    firstSundayOfLent: string;
    secondSundayOfLent: string;
    thirdSundayOfLent: string;
    fourthSundayOfLent: string;
    fifthSundayOfLent: string;
    palmSunday: string;
    easterSunday: string;
    secondSundayOfEaster: string;
    thirdSundayOfEaster: string;
    fourthSundayOfEaster: string;
    fifthSundayOfEaster: string;
    sixthSundayOfEaster: string;
    theAscentionOfTheLord: string;
    pentecostSunday: string;
    firstSundayOfAdvent: string;
    secondSundayOfAdvent: string;
    thirdSundayOfAdvent: string;
    fourthSundayOfAdvent: string;
    christmas: string;
    leThanhGia: string;
    chuaKitoVua: string;
    firstOrdinarySundayAfterPentecostSunday: string;
    leDucMeChuaTroi: string;
    leChuaBaNgoi: string;
    leMinhMauThanhChua: string;
    leThanhTamChuaGieSu: string;
};
type NgayLeData = {
    name: string;
    type?: string;
    fixed?: boolean;
    date?: Date;
};
type SingleDateData = {
    date: Date;
    cacNgayLe: NgayLeData[];
};
declare const LE_KINH = "L\u1EC5 K\u00EDnh";
declare const LE_NHO = "L\u1EC5 Nh\u1EDB";
declare const LE_TRONG = "L\u1EC5 Tr\u1ECDng";

declare class TinhNamPhungVu {
    private year;
    private pLePhucSinh;
    private pThuTuLeTro;
    private pNgayLeChuaHienLinh;
    private pLeThanhGia;
    private p4TuanMuaVong;
    private namPhungVu;
    private fullYear;
    private firstSundayOfYear;
    private printed;
    constructor(year: number);
    private getFullYearKeyFromDate;
    private addNgayLeVoDanhSach;
    private tinhNgayPhucSinh;
    private tinhThuTuLeTro;
    private get ngayLePhucSinh();
    private get ngayLeTro();
    private get ngayLeChuaHienLinh();
    private get ngayLeThanhGia();
    private get bonTuanMuaVong();
    private tinhLichPhungVu;
    getNamPhungVu(): NamPhungVu | undefined;
    private populateCalculatedDaysToCalender;
    private setSameTimeOfDate;
    private populateCacNgayLeCoDinh;
    private nameChuaNhaMuaThuongNienThu;
    /**
     * goi sau khi da populate het cac ngay le co dinh, theo cong thu
     */
    private tinhchuaNhatMuaThuongNien;
    private populateTuanBatNhat;
    private populateTuanThanh;
    getFullLichPhungVuTheoNam(): SingleDateData[];
}

declare function getTinhNamPhungVuInstant(year: number): TinhNamPhungVu;

export { LE_KINH, LE_NHO, LE_TRONG, getTinhNamPhungVuInstant, nameOfDays };
