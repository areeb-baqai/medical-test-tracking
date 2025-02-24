import React from 'react';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
    return (
        <div>
            <h1>Welcome to Our Application</h1>
            <div>
                <Link to="/signup">Sign Up</Link>
                <Link to="/signin">Sign In</Link>
            </div>
        </div>
    );
};

export default MainPage; 