import React from "react";
import Input from "./Input";
import * as constants from "../common/constants";

const REGIONS = [
  { code: constants.REGION_SEOUL, value: "서울특별시" },
  { code: constants.REGION_BUSAN, value: "부산광역시" },
  { code: constants.REGION_DAEGU, value: "대구광역시" },
  { code: constants.REGION_INCHEON, value: "인천광역시" },
  { code: constants.REGION_GWANGJU, value: "광주광역시" },
  { code: constants.REGION_DAEJEON, value: "대전광역시" },
  { code: constants.REGION_ULSAN, value: "울산광역시" },
  { code: constants.REGION_SEJONG, value: "세종특별자치시" },
  { code: constants.REGION_GYEONGGIDO, value: "경기도" },
  { code: constants.REGION_GANGWONDO, value: "강원도" },
  { code: constants.REGION_CHUNGCHEONGBUKDO, value: "충청북도" },
  { code: constants.REGION_CHUNGCHEONGNAMDO, value: "충청남도" },
  { code: constants.REGION_JEOLLABUKDO, value: "전라북도" },
  { code: constants.REGION_JEOLLANAMDO, value: "전라남도" },
  { code: constants.REGION_GYEONGSANGBUKDO, value: "경상북도" },
  { code: constants.REGION_GYEONGSANGNAMDO, value: "경상남도" },
  { code: constants.REGION_JEJUDO, value: "제주특별자치도" },
];

const RegionSelector = ({
  value,
  onChange,
  placeholder = "지역을 선택해 주세요.",
}: {
  value?: string;
  onChange: React.FormEventHandler<HTMLSelectElement>;
  placeholder?: string;
}) => (
  <Input.Select
    name="region"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
  >
    {REGIONS.map(({ code, value }) => (
      <option key={code} value={code}>
        {value}
      </option>
    ))}
  </Input.Select>
);

export default RegionSelector;
