// import "./styles.css";

// const TextField = ({ labelName, textarea=false,type="text", ...props }) => {
//   return (
//     <div>
//       <p className="white mb_1">{labelName}</p>
//       {!textarea ? <input required={type === "date"} type={type} className="text_field" {...props}/> : <textarea className="text_field" {...props}/>}
//     </div>
//   );
// };

// export default TextField;


import "./styles.css";

const TextField = ({
  labelName,
  type = "text",
  textarea = false,
  select = false,
  options = [],
  ...props
}) => {
  console.log(options);
  
  return (
    <div className="fieldWrapper">
      {labelName && <p className="white mb_1">{labelName}</p>}

      {select ? (
        <select className="text_field" {...props}>
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
          required={type==="date"}
          {...props}
        />
      )}
    </div>
  );
};

export default TextField;
