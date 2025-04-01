interface InputProps {
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  name,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
}) => {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border border-[#D0D5DD] p-4 rounded w-full outline-none focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
    />
  );
};

export default Input;
