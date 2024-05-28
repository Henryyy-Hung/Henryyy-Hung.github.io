import { useState, useEffect } from 'react';
import AppRoutes from './AppRoute';
import FontFaceObserver from 'fontfaceobserver';
import {useTranslation} from "react-i18next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

    const { t } = useTranslation();

    // 设置网站标题
    useEffect(() => {
        document.title = t('site.title');
        const currentLanguage = localStorage.getItem('i18nextLng');
        document.documentElement.lang = currentLanguage;
    }, [t]);

    // 加载字体
    const [fontsLoaded, setFontsLoaded] = useState(false);
    useEffect(() => {
        const loadFonts = () => {
            const satoshiVariable = new FontFaceObserver('Satoshi-Variable', {
                weight: 500,
                style: 'normal',
            });
            return Promise.all([
                satoshiVariable.load(),
            ]);
        };
        loadFonts().then(() => setFontsLoaded(true));
    }, []);

    // infoLoaded属性应该慎用，它代表了全局的用户数据是否完成加载，可能会有超过100ms的延迟
            
    return (
        (!fontsLoaded)
        ? 
        (
            <></>
        )
        :
        (
            <>
                <ToastContainer />
                <AppRoutes/>
            </>
        )
    );
}

export default App;