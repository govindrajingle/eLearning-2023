import {Provider} from '../context'
import { ToastContainer } from 'react-toastify';
import TopNav from '../components/TopNav';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd';
import '../public/css/styles.css';
import "react-toastify/dist/ReactToastify.css";


function MyApp ({ Component, pageProps}){
    return (
        <Provider>
        <ToastContainer position='top-center'/>
        <TopNav/>
        <Component {...pageProps}/>

        </Provider>

    );
};

export default MyApp;