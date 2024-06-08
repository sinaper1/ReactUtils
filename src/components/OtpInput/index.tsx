import React, { useState, useRef, useEffect } from 'react';
import './index.less';

interface OtpInputProps {
  length: number;
  isNumber?: boolean;
  onChange?: (otp: string) => void;
  onComplete: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = (props) => {
  const { length, isNumber=false, onChange, onComplete } = props;
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputsRef = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    // 判断是否只限于输入数字
    if (isNumber && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (onChange) {
      onChange(newOtp.join(''));
    }

    // 如果当前输入不为空，则将焦点移至下一个输入字段
    if (value && index < length - 1) {
      inputsRef.current[index + 1].focus();
    }

    // 如果OTP完成，触发onComplete
    if (newOtp.join('').length === length) {
      // 输入完成
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  return (
    <div className={'my-otp'}>
      {Array(length)
        .fill('')
        .map((_, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={otp[index]}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el!)}
            className={'my-otp-input'}
          />
        ))}
    </div>
  );
};

export default OtpInput;
