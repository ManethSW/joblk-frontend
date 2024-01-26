import withAuth from '@/app/hooks/UserChecker';
import React from 'react';

const preview = () => {
    return (
        <div>
           <h1>Content</h1>
        </div>
    );
};

export default withAuth(preview);
