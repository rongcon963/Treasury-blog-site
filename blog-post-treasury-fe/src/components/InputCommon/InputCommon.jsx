import { useState } from 'react';
import styles from './styles.module.scss';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import cls from 'classnames';

function InputCommon({ label, type, isRequired = false, ...props }) {
  const { labelInput, boxInput, boxIcon, container, errMsg, isErrInput } = styles;
  const { formik, id } = props;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const isShowPassword = type === 'password' && showPassword ? 'text' : type;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isErr = formik.touched[id] && formik.errors[id];
  const messageErr = formik.errors[id];

  return (
    <div className={container}>
      <div
        className={cls(labelInput, {
          [errMsg]: isErr
        })}
      >
        {label} {isRequired && <span>*</span>}
      </div>
      <div className={boxInput}>
        <input
          type={isShowPassword}
          {...props}
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values[id]}
          className={cls({ [isErrInput]: isErr })}
        />
        {isPassword && (
          <div className={boxIcon} onClick={handleShowPassword}>
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        )}
        {isErr && <div className={errMsg}>{messageErr}</div>}
      </div>
    </div>
  );
}

export default InputCommon;
