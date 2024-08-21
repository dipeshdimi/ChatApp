import Sidebar from '../components/01_sidebar';
import Chats from '../components/02_chats';
import { useState, useEffect } from 'react';

const Home = () => {
    const [isChatSelected, setIsChatSelected] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsChatSelected(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleChatSelect = () => {
        setIsChatSelected(true);
    };

    const handleBackClick = () => {
        setIsChatSelected(false);
    };

    return (
        <div className="chatPage">
            <Sidebar show={!isChatSelected} onSelectChat={handleChatSelect} />
            <Chats show={isChatSelected} onBack={handleBackClick} />
        </div>
    );
}

export default Home;
