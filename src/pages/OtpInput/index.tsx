import { PageContainer } from '@ant-design/pro-components';
import OtpInput from "@/components/OtpInput";
import {useState} from "react";

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
            <OtpInput length={6} isNumber={true} onComplete={onComplete}/>
            {str&&<div>{str}</div>}
        </PageContainer>
    );
};

export default AccessPage;
