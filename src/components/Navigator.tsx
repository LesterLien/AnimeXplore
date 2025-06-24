import { Routes, Route } from 'react-router-dom';
import Home from './Home';

export default function Navigator() {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
        </Routes>
    );
}

