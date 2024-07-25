import Nav from './01a_nav'
import Search from './01b_search'
import Contacts from './01c_contacts'

const Sidebar = ({ show, onSelectChat }) => {
    return (
        <div id='sidebar' className={show ? 'show' : ''}>
            <Nav/>
            <Search/>
            <Contacts onSelectChat={onSelectChat} />
        </div>
    );
}

export default Sidebar;
