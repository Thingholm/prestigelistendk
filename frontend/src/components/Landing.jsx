import "/node_modules/flag-icons/css/flag-icons.min.css";
import "../assets/style/style.css";
import Top10HomeList from "./Top10HomeList";

function Landing() {
    return (
        <div className="landing-container">
            <div className="landing-quote-container">
                <h2>"Cycling isn't a game, it's a sport. Tough, hard and unpitying, and it requires great sacrifices. One plays football, or tennis, or hockey. One doesn't play at cycling."</h2>
                <h3>- Jean De Gribaldy</h3>
            </div>
            <span className="landing-gradient"></span>
            <Top10HomeList />
        </div>
    );
}

export default Landing;