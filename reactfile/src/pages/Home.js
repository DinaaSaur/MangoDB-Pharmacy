import { useHistory } from 'react-router-dom';

const Home = () => {
    const history = useHistory();
    
    return ( 
        <div className="home">
            <h2>Home Page</h2>
            <p>This is the home page</p>
            <button onClick={() => history.push('/')}>Home</button>
            <button onClick={() => history.push('/dashboard')}>Dashboard</button>
        </div>
     );
}
 
export default Home;