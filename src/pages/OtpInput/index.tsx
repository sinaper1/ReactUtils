import { PageContainer } from '@ant-design/pro-components';
import {useState} from "react";
import OtpInput from "@/components/OtpInput";
import './index.less';

const AccessPage: React.FC = () => {
    const [str, setStr] = useState<string>();
    const onComplete = async (value: string) => {
        console.log(value, '-');
        setStr(value);
    }
    return (
        <PageContainer
            ghost
            header={{
                title: '一次性密码输入框',
            }}
        >
            <div className={'otp-input'}>
                <OtpInput length={6} isNumber={true} onComplete={onComplete}/>
            </div>
            {str&&<div>{str}</div>}
        </PageContainer>
    );
};

export default AccessPage;
