import cn from "classnames";
import moment from "moment";

const DateBadge = ({
  className,
  date,
  children,
}: {
  className?: string | string[];
  date?: moment.MomentInput;
  children?: React.ReactNode;
}) => (
  <div
    className={cn(
      "inline-block rounded-full py-1.5 px-5 text-base font-normal",
      className
    )}
  >
    {children ? children : moment(date).format("YY.MM.DD(ddd)")}
  </div>
);

export default DateBadge;
