import { Outlet }   from '@tanstack/react-router'
import Navbar from './components/Navbar'

const Root = () => (
    <div>
        <Navbar />
        <Outlet />
    </div>
)

export default Root