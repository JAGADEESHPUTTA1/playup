import "./TextField.css";

const TextField = ({
  labelName,
  type = "text",
  textarea = false,
  select = false,
  options = [],
  className,
  ...props
}) => {
  return (
    <div className="fieldWrapper">
      {labelName && <p className="white mb_1 mt_16">{labelName}</p>}

      {select ? (
        <select className={`text_field ${className}`} {...props}>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : textarea ? (
        <textarea className="text_field" {...props} />
      ) : (
        <input
          type={type}
          className="text_field"
          required={type === "date"}
          {...props}
        />
      )}
    </div>
  );
};

export default TextField;
