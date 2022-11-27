import Input from "./Input";
import { MBTI } from "../@types";

const MBTIS = [
  "ISTJ",
  "ISTP",
  "ISFJ",
  "ISFP",
  "INTJ",
  "INTP",
  "INFJ",
  "INFP",
  "ESTJ",
  "ESTP",
  "ESFJ",
  "ESFP",
  "ENTJ",
  "ENTP",
  "ENFJ",
  "ENFP",
];

const MBTISelector = ({
  value,
  onChange,
}: {
  value?: MBTI;
  onChange: React.FormEventHandler<HTMLSelectElement>;
}) => (
  <Input.Select
    name="MBTI"
    value={value ?? ""}
    onChange={onChange}
    placeholder="MBTI를 선택해 주세요."
  >
    {MBTIS.map((value) => (
      <option key={value} value={value}>
        {value}
      </option>
    ))}
  </Input.Select>
);

export default MBTISelector;
