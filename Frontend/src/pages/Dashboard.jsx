import Barchart from '../components/barchart/Barchart'
import Cateogory from '../components/category/Cateogory'
import Information from '../components/information/Information'
import Navbar from '../components/navbar/Navbar'
import Sidebar from '../components/sidebar/Sidebar'


const Dashboard = ({isDark,setIsDark}) => {
    return (
        <div>
            <Sidebar dark={isDark} />
            <Navbar dark={isDark} setIsDark={setIsDark} />
            <Information dark={isDark} />
            <div className="wrapper">
                <Barchart dark={isDark} />
                <Cateogory dark={isDark} />
            </div>
        </div>
    )
}

export default Dashboard
