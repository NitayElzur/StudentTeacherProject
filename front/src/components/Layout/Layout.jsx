import './Layout.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';

function Layout() {
    const navigate = useNavigate();
    function handleGoBack() {
        navigate(-1)
    }
    return (
        <div id='main-content'>
            <div id="header">
                <Link to={'/'}>Home Page</Link>
                <button onClick={handleGoBack}>go back</button>
            </div>
            <div id="non-header">
                <Outlet />
            </div>
        </div>
    )
}
export default Layout;